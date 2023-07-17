export function createDefaultRenderProps(request: Request): RenderProps {
  const url = new URL(request.url);

  return {
    $request: request,
    $url: url,
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

/* Type definitions */
export interface RenderProps extends Record<string, any> {
  $request: Request;
  $url: URL;
}

export interface RenderPropsHandle {
  (props: RenderProps): string;
}

export interface RequestHandle {
  (request: Request): Promise<Response | string> | Response | string;
}

export interface Handle {
  (request: Request, render: Render): HookResult;
}

interface Render {
  (props: Record<string, any>): HookResult;
}

type ResponseOrResult = Response | string;
export type SimpleType = string | number | boolean | SimpleType[];
export type HookResult = Promise<ResponseOrResult> | ResponseOrResult;
