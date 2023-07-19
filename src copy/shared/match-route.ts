export function matchRoute<T>(
  routes: Map<string, T>,
  route: string,
): MatchedRoute<T> | null {
  for (const [pattern, content] of routes) {
    const regexPattern = pattern.replace(
      /\[(.*?)\]/g,
      (_, placeholder) => `(?<${placeholder}>[^/]+)`,
    );
    const regex = new RegExp(`^${regexPattern}/?$`);
    const match = route.match(regex);

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

export interface MatchedRoute<T> {
  pattern: string;
  content: T;
  params: Record<string, string>;
}
