import { RenderPropsHandle, SimpleType } from "siki/shared";
import { createRenderTemplate } from "siki/shared";

/** Siki component */
export function component(
  templates: TemplateStringsArray,
  ...values: SimpleType[] | RenderPropsHandle[]
) {
  return createRenderTemplate(templates, values);
}
