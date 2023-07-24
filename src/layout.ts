import {
  createDefaultRenderProps,
  createRenderTemplate,
  Handle,
  // PageHead,
  RenderPropsHandle,
  RequestHandle,
  SimpleType,
} from "./shared/mod.ts";

/** Siki layout */
export function layout(config: LayoutConfig) {
  return function (
    templates: TemplateStringsArray,
    ...values: SimpleType[] | RenderPropsHandle[]
  ): Layout {
    const renderTemplate = createRenderTemplate(templates, values);

    return {
      ...config,
      setupHandle: (handleNext, initProps) => {
        return async (request, route) => {
          const defaultProps = {
            ...createDefaultRenderProps(request, route),
            ...(initProps ?? {}),
          };

          // Call internal Handle if defined
          if (config.handle) {
            return await config.handle(request, defaultProps, async (props) => {
              let childTemplate = "";

              // Run nested handle if any
              if (handleNext) {
                const handleResult = await handleNext(request, route);

                // Return if result is response
                if (handleResult instanceof Response) return handleResult;

                // Set child render
                childTemplate = handleResult;
              }

              // Render Layout
              return renderTemplate({
                ...defaultProps,
                child: childTemplate,
                ...(props ?? {}),
              });
            });
          }

          let childTemplate = "";

          // Run nested handle if any
          if (handleNext) {
            const handleResult = await handleNext(request, route);

            // Return if result is response
            if (handleResult instanceof Response) return handleResult;

            // Set child render
            childTemplate = handleResult;
          }

          // Render Layout
          return renderTemplate({ ...defaultProps, child: childTemplate });
        };
      },
    };
  };
}

interface LayoutConfig {
  id: string;
  // head?: PageHead;
  handle?: Handle;
}

export interface Layout extends LayoutConfig {
  setupHandle: SetupHookHandle;
}

interface SetupHookHandle {
  (handleNext?: RequestHandle, initProps?: Record<string, any>): RequestHandle;
}
