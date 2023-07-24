import { assertStrictEquals } from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Cookie, getCookies } from "../mod.ts";

function createMockRequestWithCookies() {
  const headers = new Headers();
  const expires = new Date(Date.now() + 3600000).toUTCString();

  headers.set("cookie", `xes=12345; Expires=${expires}; HttpOnly`);
  //   headers.set("set-cookie", `xes=stone; HttpOnly`);

  return new Request("http://localhost:3000", { headers });
}

Deno.test("Get cookies test", () => {
  const expected: Map<string, Cookie> = new Map(
    Object.entries({ "xes": { name: "xes", value: "12345", httpOnly: true } }),
  );

  const result = getCookies(createMockRequestWithCookies());

  assertStrictEquals(result, expected);
});
