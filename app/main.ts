import { serveSikiApp } from "siki";
import { WebsiteLayout } from "./+layouts/website.ts";
import pages from "+modules";

serveSikiApp({
  layouts: {
    [WebsiteLayout.id]: WebsiteLayout,
  },
  modules: [...pages],
});
