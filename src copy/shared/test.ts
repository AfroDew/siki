import { assertEquals } from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { matchRoute } from "./match-route.ts";

/*================= Test for matching route  =================*/
const ROUTES = new Map(Object.entries({
  "/jobs": "Route for /jobs",
  "/jobs/[id]": "Route for /jobs/[id]",
  "/jobs/[id]/create": "Route for /jobs/[id]/create",
  "/jobs/[id]/branchs/[branchId]": "Route for /jobs/[id]/branchs/[branchId]",
}));

Deno.test("Matching route with /jobs", () => {
  const expected = {
    pattern: "/jobs",
    value: "Route for /jobs",
    idValues: {},
  };
  const result = matchRoute(ROUTES, "/jobs");

  assertEquals(result, expected);
});

Deno.test("Matching route with /[id]", () => {
  const expected = {
    pattern: "/jobs/[id]",
    value: "Route for /jobs/[id]",
    idValues: { id: "2333" },
  };
  const result = matchRoute(ROUTES, "/jobs/2333");

  assertEquals(result, expected);
});

Deno.test("Matching route with /[id]/", () => {
  const expected = {
    pattern: "/jobs/[id]",
    value: "Route for /jobs/[id]",
    idValues: { id: "xwdw" },
  };
  const result = matchRoute(ROUTES, "/jobs/xwdw/");

  assertEquals(result, expected);
});

Deno.test("Matching route with /[id]/branchs/[branchId]", () => {
  const expected = {
    pattern: "/jobs/[id]/branchs/[branchId]",
    value: "Route for /jobs/[id]/branchs/[branchId]",
    idValues: { id: "123", branchId: "456" },
  };
  const result = matchRoute(ROUTES, "/jobs/123/branchs/456");

  assertEquals(result, expected);
});

Deno.test("Matching route that are not /[id]/", () => {
  const expected = null;
  const result = matchRoute(ROUTES, "/jobs/333/3se");

  assertEquals(result, expected);
});
