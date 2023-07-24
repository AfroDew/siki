import { MatchedRoute } from "./match-route.ts";

/* Type definitions */
export interface RenderProps extends Record<string, any> {
  $request: Request;
  $url: URL;
  $param: Record<string, string>;
  /** This represents the head for a page.
   * It can be used to set properties for the page head tag
   */
  $head?: PageHead;
}

export interface PageHead {
  title?: string;
  /** Can be used to add more elements to head */
  raw?: RenderPropsHandle;
}

// export interface PageHead {
//   title?: string;
//   meta?: MetaTagAttribute[];
//   /** Can be used to add more elements to head */
//   raw?: string;
// }

// interface MetaTagAttribute {
//   name?: string;
//   content?: string;
//   "http-equiv"?: string;
//   charset?: string;
// }

export interface RenderPropsHandle {
  (props: RenderProps): string;
}

export interface RequestHandle {
  (
    request: Request,
    route: MatchedRoute,
  ): Promise<Response | string> | Response | string;
}

export interface Handle {
  (request: Request, props: RenderProps, render: Render): HookResult;
}

export interface Render {
  (props?: Record<string, any>): HookResult;
}

type ResponseOrResult = Response | string;
export type SimpleType = string | number | boolean | SimpleType[];
export type HookResult = Promise<ResponseOrResult> | ResponseOrResult;
