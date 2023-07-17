import { RenderPropsHandle, SimpleType } from "./shared.ts";
import { createRenderTemplate } from "./shared.ts";

/** Siki component */
export function component(
  templates: TemplateStringsArray,
  ...values: SimpleType[] | RenderPropsHandle[]
) {
  return createRenderTemplate(templates, values);
}
