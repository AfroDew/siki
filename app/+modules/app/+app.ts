import { block, component, module, page } from "siki";

const Button = component /*html*/`
    <button hx-post="/clicked" hx-trigger="click" hx-target="#parent-div">
        {user.name} please Click Me! - {$head.title} ☺
        ${(props) => {
  // console.log({ props });
  return "";
}}
    </button>
`;

export default module({
  path: "/app",
  routes: {
    "$::GET": page({ head: { title: "App" } }) /*html*/`
        <h2>App</h2>
        ${Button}
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
