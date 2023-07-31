export function getCookies(request: Request) {
  // Get the "cookie" header from the request.
  const cookieHeader = request.headers.get("cookie");
  const cookieMap = new Map<string, string>();

  if (cookieHeader) {
    cookieHeader
      // Split the "cookie" header by semicolon to get individual cookies.
      .split(";")
      .map((cookie) => cookie.trim())
      .forEach((cookie) => {
        const [key, value] = cookie.split("=");

        // Parse each cookie into a key-value map.
        cookieMap.set(key, value);
      });
  }

  return cookieMap;
}

/** Delete cookies from response headers  */
export function deleteCookies(headers: Headers, names: string[]) {
  for (const name of names) {
    // Set the cookie with an expiration date in the past
    const pastDate = new Date(0); // A date in the past
    headers.set(
      "Set-Cookie",
      `${name}=; Expires=${pastDate.toUTCString()}; Path=/`,
    );
  }
  return headers;
}

/** Set cookies for response headers   */
export function setCookies(headers: Headers, cookies: Cookie[]) {
  for (const cookie of cookies) {
    let cookieString = `${encodeURIComponent(cookie.name)}=${
      encodeURIComponent(cookie.value)
    }`;

    if (cookie.expires) {
      cookieString += `; Expires=${
        cookie.expires instanceof Date
          ? cookie.expires.toUTCString()
          : cookie.expires
      }`;
    }

    if (cookie.maxAge !== undefined) {
      cookieString += `; Max-Age=${cookie.maxAge}`;
    }

    if (cookie.domain) {
      cookieString += `; Domain=${cookie.domain}`;
    }

    if (cookie.path) {
      cookieString += `; Path=${cookie.path}`;
    }

    if (cookie.secure) {
      cookieString += `; Secure`;
    }

    if (cookie.httpOnly) {
      cookieString += `; HttpOnly`;
    }

    if (cookie.partitioned) {
      cookieString += `; Partitioned`;
    }

    if (cookie.sameSite) {
      cookieString += `; SameSite=${cookie.sameSite}`;
    }

    headers.set("Set-Cookie", cookieString);
  }

  return headers;
}

export interface Cookie {
  name: string;
  value: string;
  expires?: Date | string;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  partitioned?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}
