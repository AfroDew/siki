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
  (request: Request, props: RenderProps, render: Render): HookResult;
}

interface Render {
  (props: Record<string, any>): HookResult;
}

type ResponseOrResult = Response | string;
export type SimpleType = string | number | boolean | SimpleType[];
export type HookResult = Promise<ResponseOrResult> | ResponseOrResult;
