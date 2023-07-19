import { serveSikiApp } from "siki";
import { WebsiteLayout } from "./+layouts/website.ts";
import pages from "+pages";

serveSikiApp({
  layouts: {
    [WebsiteLayout.id]: WebsiteLayout,
  },
  modules: [...pages],
});
