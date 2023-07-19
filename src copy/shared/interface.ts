import { Page } from "../page.ts";
import { Raw } from "../raw.ts";
import { MatchedRoute } from "./match-route.ts";

/* Type definitions */
export interface RenderProps extends Record<string, any> {
  $request: Request;
  $url: URL;
  $param: Record<string, string>;
}

export interface RenderPropsHandle {
  (props: RenderProps): string;
}

export interface RequestHandle {
  (
    request: Request,
    route: MatchedRoute<Page | Raw>,
  ): Promise<Response | string> | Response | string;
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
