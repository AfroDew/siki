import {
  createDefaultRenderProps,
  createRenderTemplate,
  Handle,
  PageHead,
  RenderPropsHandle,
  RequestHandle,
  SimpleType,
} from "./shared/mod.ts";

/** Siki page */
export function page(config?: PageConfig) {
  return function (
    templates: TemplateStringsArray,
    ...values: SimpleType[] | RenderPropsHandle[]
  ): Page {
    const renderTemplate = createRenderTemplate(templates, values);

    return {
      ...(config && {}),
      type: "page",
      layouts: !config || !config.layout
        ? []
        : config.layout.trim().split("<-").map((x) => x.trim()),
      handle: async (request, route) => {
        const defaultProps = createDefaultRenderProps(request, route);

        if (config && config.handle) {
          return await config.handle(
            request,
            defaultProps,
            (props) =>
              renderTemplate({
                ...defaultProps,
                ...(props ?? {}),
              }),
          );
        }

        return renderTemplate(defaultProps);
      },
    };
  };
}

export interface PageConfig {
  head?: PageHead;
  /** Layout to wrap page
   *
   * Definition: global<-sub1<-sub2<-...<-subn
   */
  layout?: string;
  handle?: Handle;
}

export interface Page {
  type: "page";
  handle: RequestHandle;
  layouts: string[];
  head?: PageHead;
}
