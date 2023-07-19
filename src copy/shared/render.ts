import { Page } from "../page.ts";
import { Raw } from "../raw.ts";
import type {
  RenderProps,
  RenderPropsHandle,
  SimpleType,
} from "./interface.ts";
import { MatchedRoute } from "./match-route.ts";

export function createDefaultRenderProps(
  request: Request,
  route: MatchedRoute<Page | Raw>,
): RenderProps {
  const url = new URL(request.url);

  return {
    $request: request,
    $route: route,
    $url: url,
    $param: route.params,
  };
}

export function createRenderTemplate(
  templates: TemplateStringsArray,
  values: SimpleType[] | RenderPropsHandle[],
) {
  return (props: RenderProps) => {
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
