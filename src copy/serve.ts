import { Layout } from "./layout.ts";
import { Page } from "./page.ts";
import { Raw } from "./raw.ts";
import { matchRoute, RequestHandle } from "siki/shared";
import { RootLayout } from "./root-layout.ts";

const PUBLIC_DIR = "./app/+static";
const PORT = 8000;

interface ServeConfig {
  routes: Record<string, Page | Raw>;
  layouts?: Record<string, Layout>;
  deno?: {
    serve: Deno.ServeInit & (Deno.ServeOptions | Deno.ServeTlsOptions);
  };
}

interface AppConfig {
  routes: Map<string, Page | Raw>;
  layouts: Map<string, Layout>;
}

/** Serve Siki app */
export function serveSikiApp(config: ServeConfig) {
  // Create app config
  const appConfig: AppConfig = {
    routes: new Map(Object.entries(config.routes)),
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
  const route = matchRoute(config.routes, url.pathname);

  // Handle request for raw routes
  if (route && route.content.type === "raw") {
    return await route.content.handle(request);
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
  const notFoundRoute = matchRoute(config.routes, url.pathname);

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
  // Create default handle wrapped with root layout
  const handleWithRoot = RootLayout.setupHandle(page.handle);

  // Get page's layout if specified and build
  return (page.layouts ?? []).reverse().reduce((acc, layoutId) => {
    const layout = config.layouts.get(layoutId);
    return (layout) ? layout.setupHandle(acc) : acc;
  }, handleWithRoot);
}

/** Read static file */
export async function getFile(path: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(path);
  } catch (_error) {
    return null;
  }
}
