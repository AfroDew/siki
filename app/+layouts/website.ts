import { layout } from "siki";
import { Footer, Header } from "$components";

export const WebsiteLayout = layout({ id: "website" }) /*html*/`
    ${Header}
    {child}
    ${Footer}
`;
