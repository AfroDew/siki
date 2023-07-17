import { raw } from "siki";

export default raw({
  path: "/books",
  handle: (_req) => {
    return new Response(JSON.stringify([{ name: "Siki App" }]), {
      status: 200,
      headers: new Headers({ "Content-Type": "application/json" }),
    });
  },
});
