import { RenderPropsHandle, SimpleType, createRenderTemplate } from "./shared/mod.ts";

/** Siki component */
export function component(
  templates: TemplateStringsArray,
  ...values: SimpleType[] | RenderPropsHandle[]
) {
  return createRenderTemplate(templates, values);
}
