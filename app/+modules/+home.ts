import { block, component, module, page } from "siki";

const Button = component /*html*/`
    <button hx-post="/clicked" hx-trigger="click" hx-target="#parent-div">
        {user.name} please Click Me! - {title} ☺
    </button>
`;

export default module({
  path: "/",
  routes: {
    "$": page({ layout: "base<-website", head: { title: "Welcome" } }) /*html*/`
        ${Button}
        <button hx-trigger="click" hx-target="#parent-div" hx-get="/clicked">
            Click me 2
        </button>
        <div>You are on the {title} page & your name is {user.name}</div>
        <div id="parent-div"></div>
    `,

    clicked: block() /*html*/`
        <div>
            <p>You've clicked ☺ </p>
        </div>
    `,
  },
});
