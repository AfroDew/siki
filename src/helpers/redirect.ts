export function htmxRedirect(url: string | URL, init?: ResponseInit) {
  const headers = new Headers(init?.headers);

  headers.set("HX-Redirect", url instanceof URL ? url.toString() : url);

  return new Response(null, {
    status: 202,
    ...(init ?? {}),
    headers,
  });
}

export function redirect(url: string | URL, init?: ResponseInit) {
  const headers = new Headers(init?.headers);

  headers.set("Location", url instanceof URL ? url.toString() : url);

  return new Response(null, {
    ...(init ?? {}),
    status: 302,
    headers,
  });
}
