import { Layout } from "./layout.ts";
import { Page } from "./page.ts";
import { Raw } from "./raw.ts";
import { RequestHandle } from "./shared.ts";

const PUBLIC_DIR = "./app/+static";
const PORT = 8000;

interface ServeConfig {
  hooks: Record<string, Page | Raw>;
  layouts?: Record<string, Layout>;
  deno?: {
    serve: Deno.ServeInit & (Deno.ServeOptions | Deno.ServeTlsOptions);
  };
}

interface AppConfig {
  hooks: Map<string, Page | Raw>;
  layouts: Map<string, Layout>;
}

/** Serve Siki app */
export function serveSikiApp(config: ServeConfig) {
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

function setupHandle(config: AppConfig, page: Page): RequestHandle {
  // Get page's layout if specified and build
  return (page.layouts ?? []).reverse().reduce((acc, layoutId) => {
    const layout = config.layouts.get(layoutId);
    return (layout) ? layout.setupHandle(acc) : acc;
  }, page.handle);
}

/** Read static file */
export async function getFile(path: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(path);
  } catch (_error) {
    return null;
  }
}
