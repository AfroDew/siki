import { page, serveSikiApp } from "siki";
import { RootLayout } from "./+layouts/root.ts";
import { WebsiteLayout } from "./+layouts/website.ts";
import pages from "+pages";

serveSikiApp({
  layouts: {
    [RootLayout.id]: RootLayout,
    [WebsiteLayout.id]: WebsiteLayout,
  },
  hooks: {
    ...pages,
    "/clicked": page({ path: "/clicked" }) /*html*/`<div>You have click</div>`,
  },
});
