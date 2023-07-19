import {
  createDefaultRenderProps,
  createRenderTemplate,
  Handle,
  RenderPropsHandle,
  RequestHandle,
  SimpleType,
} from "siki/shared";

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
      handle: async (request, route) => {
        const defaultProps = createDefaultRenderProps(request, route);

        if (config.handle) {
          return await config.handle(
            request,
            defaultProps,
            (props) => renderTemplate({ ...defaultProps, ...props }),
          );
        }

        return renderTemplate(defaultProps);
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
