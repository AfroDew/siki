import { Layout } from "./layout.ts";
import { Page } from "./page.ts";
import { matchRoute, RequestHandle } from "siki/shared";
import { RootLayout } from "./root-layout.ts";
import { Module, ModuleMap } from "./module.ts";

const PUBLIC_DIR = "./app/+static";
const PORT = 8000;

interface ServeConfig {
  modules: Module[];
  layouts?: Record<string, Layout>;
  deno?: {
    serve: Deno.ServeInit & (Deno.ServeOptions | Deno.ServeTlsOptions);
  };
}

interface AppConfig {
  routes: ModuleMap;
  layouts: Map<string, Layout>;
}

/** Serve Siki app */
export function serveSikiApp(config: ServeConfig) {
  const combinedModules = config.modules.reduce((a, c) => ({ ...a, ...c }), {});

  // Create app config
  const appConfig: AppConfig = {
    layouts: new Map(Object.entries(config.layouts ?? {})),
    routes: new Map(Object.entries(combinedModules)),
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
  const route = matchRoute(config.routes, request);

  // Handle request for raw routes
  if (route && route.content.type === "raw") {
    return await route.content.handle(request);
  }

  // Handle request for block routes
  if (route && route.content.type === "block") {
    const handleResult = await route.content.handle(
      request,
      route,
    );

    if (handleResult instanceof Response) return handleResult;

    return new Response(handleResult, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Handle request for page routes
  if (route && route.content.type === "page") {
    const handleResult = await setupHandle(config, route.content)(
      request,
      route,
    );
    if (handleResult instanceof Response) return handleResult;

    return new Response(handleResult, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Handle static files
  const filePath = PUBLIC_DIR + url.pathname;
  const fileContent = await getFile(filePath);
  if (fileContent) return new Response(fileContent, { status: 200 });

  // Handle not found
  const notFoundRoute = matchRoute(config.routes, request);

  if (notFoundRoute && notFoundRoute.content.type === "page") {
    const handleResult = await setupHandle(config, notFoundRoute.content)(
      request,
      notFoundRoute,
    );

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
  const wrappedHandle = (page.layouts ?? []).reverse().reduce(
    (acc, layoutId) => {
      const layout = config.layouts.get(layoutId);
      return (layout) ? layout.setupHandle(acc) : acc;
    },
    page.handle,
  );

  // Create default handle wrapped with root layout
  return RootLayout.setupHandle(
    wrappedHandle,
    { $head: page.head },
  );
}

/** Read static file */
export async function getFile(path: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(path);
  } catch (_error) {
    return null;
  }
}
