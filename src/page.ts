import {
  createDefaultRenderProps,
  createRenderTemplate,
  Handle,
  RenderPropsHandle,
  RequestHandle,
  SimpleType,
} from "./shared.ts";

/** Siki page */
export function page(config: PageConfig) {
  return function (
    templates: TemplateStringsArray,
    ...values: SimpleType[] | RenderPropsHandle[]
  ): Page {
    const renderTemplate = createRenderTemplate(templates, values);

    return {
      ...config,
      type: "page",
      handle: async (request) => {
        const defaultProps = createDefaultRenderProps(request);

        if (config.handle) {
          return await config.handle(
            request,
            (props) => renderTemplate({ ...defaultProps, ...props }),
          );
        }

        return renderTemplate(createDefaultRenderProps(request));
      },
    };
  };
}

export interface PageConfig {
  path: string;
  title?: string;
  layouts?: string[];
  handle?: Handle;
}

export interface Page {
  type: "page";
  path: string;
  handle: RequestHandle;
  layouts?: string[];
}
