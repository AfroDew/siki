import { layout } from "./layout.ts";
import { RenderProps } from "./shared/interface.ts";

export const RootLayout = layout({ id: "$root" }) /*html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>${attachTitle}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${attachMeta}
        <link rel="stylesheet" href="/styles/css/global.css" />
        <script src="https://unpkg.com/htmx.org@1.9.2" integrity="sha384-L6OqL9pRWyyFU3+/bjdSri+iIphTN/bvYyM37tICVyOJkWZLpP2vGn6VUEXgzg6h" crossorigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        ${attachRaw}
    </head>
    <body>
        {{$child}}
    </body>
    </html>
`;

function attachTitle({ $head }: RenderProps) {
  return $head?.title ?? "Siki App";
}

function attachMeta({ $head }: RenderProps) {
  return ($head?.meta ?? [])?.reduce((acc, cur) => {
    return acc + /*html*/ `<meta 
        ${cur.name ? `name='${cur.name}'` : ""} 
        ${cur.charset ? `charset='${cur.charset}'` : ""} 
        ${cur.content ? `content='${cur.content}'` : ""} 
        ${cur["http-equiv"] ? `http-equiv='${cur["http-equiv"]}'` : ""} 
    >`;
  }, "");
}

function attachRaw({ $head }: RenderProps) {
  return $head?.raw ?? "";
}
