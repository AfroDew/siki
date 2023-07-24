import {
  createDefaultRenderProps,
  createRenderTemplate,
  Handle,
  RenderPropsHandle,
  RequestHandle,
  SimpleType,
} from "./shared/mod.ts";

/** Block are server Component */
export function block(config?: BlockConfig) {
  return function (
    templates: TemplateStringsArray,
    ...values: SimpleType[] | RenderPropsHandle[]
  ): Block {
    const renderTemplate = createRenderTemplate(templates, values);

    return {
      ...(config && {}),
      type: "block",
      handle: async (request, route) => {
        const defaultProps = createDefaultRenderProps(request, route);

        if (config && config.handle) {
          return await config.handle(
            request,
            defaultProps,
            (props) => renderTemplate({ ...defaultProps, ...(props ?? {}) }),
          );
        }

        return renderTemplate(defaultProps);
      },
    };
  };
}

export interface BlockConfig {
  handle?: Handle;
}

export interface Block {
  type: "block";
  handle: RequestHandle;
}
