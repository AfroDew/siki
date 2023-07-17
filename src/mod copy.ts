const PUBLIC_DIR = "./app/+static";
const PORT = 8000;

interface RunConfig {
  hooks: Record<string, Page | RawHook>;
  layouts?: Record<string, Layout>;
  deno?: {
    serve: Deno.ServeInit & (Deno.ServeOptions | Deno.ServeTlsOptions);
  };
}

interface AppConfig {
  hooks: Map<string, Page | RawHook>;
  layouts: Map<string, Layout>;
}

/** Run Siki app */
export function runSiki(config: RunConfig) {
  // Create app config
  const appConfig: AppConfig = {
    hooks: new Map(Object.entries(config.hooks)),
    layouts: new Map(Object.entries(config.layouts ?? {})),
  };
  const ac = new AbortController();
  const server = Deno.serve({
    port: PORT,
    signal: ac.signal,
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
    },
    handler: async (request) => await handleRequest(appConfig, request),
    ...(config.deno ?? {}),
  });

  server.finished.then(() => console.log("Server closed"));

  // console.log("Closing server...");
  // ac.abort();
}

async function handleRequest(
  config: AppConfig,
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  const hook = config.hooks.get(url.pathname);

  // Handle request for raw hooks
  if (hook && hook.type === "raw") return await hook.handle(request);

  // Handle request for page hooks
  if (hook && hook.type === "page") {
    const handleResult = await setupHandle(config, hook)(request);
    if (handleResult instanceof Response) return handleResult;

    return new Response(handleResult, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Handle static files
  const filePath = PUBLIC_DIR + url.pathname;
  const fileContent = await getFile(filePath);
  // console.log({ url, filePath, fileContent });
  if (fileContent) return new Response(fileContent, { status: 200 });

  // Handle not found
  const notFoundHook = config.hooks.get("404");

  if (notFoundHook && notFoundHook.type === "page") {
    const handleResult = await setupHandle(config, notFoundHook)(request);

    if (handleResult instanceof Response) return handleResult;
    return new Response(handleResult, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function setupHandle(config: AppConfig, page: Page): HookHandle {
  // Get page's layout if specified and build
  return (page.layouts ?? []).reverse().reduce((acc, layoutId) => {
    const layout = config.layouts.get(layoutId);
    return (layout) ? layout.setupHandle(acc) : acc;
  }, page.handle);
}

export interface HookProps extends Record<string, any> {
  $request: Request;
  $url: URL;
}

export function createDefaultHookProps(request: Request): HookProps {
  const url = new URL(request.url);

  return {
    $request: request,
    $url: url,
  };
}

export interface PropsHandle {
  (props: HookProps): string;
}

type SimpleType = string | number | boolean | SimpleType[];

/** Siki component */
export function component(
  templates: TemplateStringsArray,
  ...values: SimpleType[] | PropsHandle[]
) {
  return (props: HookProps) => {
    const temp = templates.reduce((acc, str, i) => {
      const value = values[i] ?? "";

      // Handle props functions
      if (value instanceof Function) {
        return acc + str + value(props);
      }
      return acc + str + value;
    }, "")
      .trim()
      .replace(/\{([^}]+)\}/g, (_, placeholder) => {
        // Handle nested property access
        if (placeholder.includes(".")) {
          const fieldPaths = placeholder.trim().split(".") as string[];
          let value: any = props;

          // Find value
          for (const field of fieldPaths) {
            if (value instanceof Object) {
              value = value[field];
            }
          }

          // prevent rendering Object or undefined
          return (!value || value instanceof Object) ? "" : value;
        }

        const propValue = props[placeholder.trim()];
        return propValue !== undefined ? propValue : "";
      });

    return temp;
  };
}

function createRenderTemplate(
  templates: TemplateStringsArray,
  values: SimpleType[] | PropsHandle[],
) {
  return (props: HookProps) => {
    return templates.reduce((acc, str, i) => {
      const value = values[i] ?? "";

      // Handle props functions
      if (value instanceof Function) {
        return acc + str + value(props);
      }

      return acc + str + value;
    }, "")
      .trim()
      .replace(/\{([^}]+)\}/g, (_, placeholder) => {
        // Handle nested property access
        if (placeholder.includes(".")) {
          const fieldPaths = placeholder.trim().split(".") as string[];
          let value: any = props;

          // Find value
          for (const field of fieldPaths) {
            if (value instanceof Object) {
              value = value[field];
            }
          }

          // prevent rendering Object or undefined
          return (!value || value instanceof Object) ? "" : value;
        }

        const propValue = props[placeholder.trim()];
        return propValue !== undefined ? propValue : "";
      });
  };
}

/** Siki layout */
export function layout(config: LayoutConfig) {
  return function (
    templates: TemplateStringsArray,
    ...values: SimpleType[] | PropsHandle[]
  ): Layout {
    const renderTemplate = createRenderTemplate(templates, values);

    return {
      ...config,
      setupHandle: (handleNext) => {
        return async (request) => {
          const defaultProps = createDefaultHookProps(request);

          // Call internal Handle if defined
          if (config.handle) {
            return await config.handle(request, async (props) => {
              let childTemplate = "";

              // Run nested handle if any
              if (handleNext) {
                const handleResult = await handleNext(request);

                // Return if result is response
                if (handleResult instanceof Response) return handleResult;

                // Set child render
                childTemplate = handleResult;
              }

              // Render Layout
              return renderTemplate({
                ...defaultProps,
                child: childTemplate,
                ...props,
              });
            });
          }

          let childTemplate = "";

          // Run nested handle if any
          if (handleNext) {
            const handleResult = await handleNext(request);

            // Return if result is response
            if (handleResult instanceof Response) return handleResult;

            // Set child render
            childTemplate = handleResult;
          }

          // Render Layout
          return renderTemplate({ ...defaultProps, child: childTemplate });
        };
      },
    };
  };
}

/** Siki page */
export function page(config: PageConfig) {
  return function (
    templates: TemplateStringsArray,
    ...values: SimpleType[] | PropsHandle[]
  ): Page {
    const renderTemplate = createRenderTemplate(templates, values);

    return {
      ...config,
      type: "page",
      handle: async (request) => {
        const defaultProps = createDefaultHookProps(request);
        if (config.handle) {
          return await config.handle(
            request,
            (props) => renderTemplate({ ...defaultProps, ...props }),
          );
        }
        return renderTemplate(createDefaultHookProps(request));
      },
    };
  };
}

/** Siki raw */
export function raw(config: RawHookConfig): RawHook {
  return { ...config, type: "raw" };
}

/** Read static file */
export async function getFile(path: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(path);
  } catch (_error) {
    return null;
  }
}

/* Helpers */

/* Type definitions */
interface RawHookConfig {
  path: string;
  handle: RawHookHandle;
}

export interface PageConfig {
  path: string;
  title?: string;
  layouts?: string[];
  handle?: Handle;
}

interface LayoutConfig {
  id: string;
  handle?: Handle;
}

interface Layout extends LayoutConfig {
  setupHandle: SetupHookHandle;
}

interface SetupHookHandle {
  (handleNext?: HookHandle): HookHandle;
}

interface Page {
  type: "page";
  path: string;
  handle: HookHandle;
  layouts?: string[];
}

interface RawHook {
  type: "raw";
  path: string;
  handle: RawHookHandle;
}

interface RawHookHandle {
  (request: Request): Promise<Response> | Response;
}

interface HookHandle {
  (request: Request): Promise<Response | string> | Response | string;
}

interface Handle {
  (request: Request, render: Render): HookResult;
}

interface Render {
  (props: Record<string, any>): HookResult;
}

type HookResult = Promise<ResponseOrResult> | ResponseOrResult;
type ResponseOrResult = Response | string;
