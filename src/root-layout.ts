import { Layout, layout } from "./layout.ts";
import { RenderProps } from "./mod.ts";
import { Page } from "./page.ts";
import { RequestHandle } from "./shared/interface.ts";

const RootLayout = layout({ id: "$root" }) /*html*/`
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{title}}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/htmx.org@1.9.2" integrity="sha384-L6OqL9pRWyyFU3+/bjdSri+iIphTN/bvYyM37tICVyOJkWZLpP2vGn6VUEXgzg6h" crossorigin="anonymous"></script>
    ${(props) => props.renderRaw(props)}
</head>
<body>
    {{$child}}
</body>
</html>
`;

/** Create default handle wrapped with root layout */
export function wrapRootLayout(
  wrappedHandle: RequestHandle,
  page: Page,
  layouts: Layout[],
) {
  return RootLayout.setupHandle(wrappedHandle, {
    renderRaw: (props: RenderProps) =>
      layouts.reduce((acc, layout) => {
        if (!layout.head || !layout.head.raw) return "";

        return acc + layout.head.raw(props);
      }, "") + (page?.head?.raw ? page.head.raw(props) : ""),
  });
}
