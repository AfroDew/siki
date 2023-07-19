import { layout } from "siki";
import { Footer, Header } from "$components";

export default layout({ id: "website" }) /*html*/`
    ${Header}
    {child}
    ${Footer}
`;
