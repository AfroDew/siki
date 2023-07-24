export function htmxRedirect(url: string | URL, init?: ResponseInit) {
  return new Response(null, {
    status: 202,
    ...(init ?? {}),
    headers: {
      "HX-Redirect": url instanceof URL ? url.toString() : url,
      ...(init?.headers ?? {}),
    },
  });
}

export function redirect(url: string | URL, init?: ResponseInit) {
  return new Response(null, {
    ...(init ?? {}),
    status: 302,
    headers: {
      "Location": url instanceof URL ? url.toString() : url,
      ...(init?.headers ?? {}),
    },
  });
}
