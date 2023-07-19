import { ModuleContent, ModuleMap } from "../module.ts";

const PARAMS_REGX = /\[(.*?)\]/g;

export function matchRoute(
  routes: ModuleMap,
  request: Request,
): MatchedRoute | null {
  const { pathname } = new URL(request.url);

  for (const [routePath, content] of routes) {
    // Split pathname and method from route pattern
    const [pattern, method] = routePath.split("::");

    // Check method
    if (method && !method.includes(request.method)) {
      continue;
    }

    const regexPattern = pattern.replace(PARAMS_REGX, (_, placeholder) => {
      return `(?<${placeholder}>[^/]+)`;
    });
    const regex = new RegExp(`^${regexPattern}/?$`);
    const match = pathname.match(regex);

    if (match) {
      const params: Record<string, string> = {};
      const groups = match.groups ?? {};

      for (const placeholder of Object.keys(groups)) {
        params[placeholder] = groups[placeholder];
      }

      return { pattern, content, params };
    }
  }

  return null; // No match found
}

export interface MatchedRoute {
  pattern: string;
  content: ModuleContent;
  params: Record<string, string>;
}
