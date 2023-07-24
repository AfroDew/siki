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
  for (const { name, value, ...others } of cookies) {
    const cookieString = Object.entries(others).reduce((acc, [key, value]) => {
      return acc + `; ${cookieKeyMap[key]}:${value}`;
    }, `${name}=${value}`);

    headers.set("Set-Cookie", cookieString);
  }

  return headers;
}

const cookieKeyMap: any = {
  expires: "Expires",
  maxAge: "MaxAge",
  domain: "Domain",
  path: "Path",
  secure: "Secure",
  httpOnly: "HttpOnly",
  sameSite: "SameSite",
};

export interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}
