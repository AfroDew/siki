import { component, page, PageConfig, RenderPropsHandle } from "siki";

const CONFIG: PageConfig = {
  path: "/",
  layouts: ["root", "website"],
  handle(request, render) {
    console.log("Visited: ", request.url);
    return render({ title: "Home", user: { name: "Siki" } });
  },
};

const renderTitle: RenderPropsHandle = (props) => {
  return ["☺", "️☺️"].reduce((acc, x) => acc + ` ${props.title + x}`, "");
};

const Button = component /*html*/`
    <button hx-post="/clicked"
    hx-trigger="click"
    hx-target="#parent-div"
    hx-confirm="Are you sure you wish to delete your account?"
    >{user.name} please Click Me! - ${renderTitle}</button>
`;

export default page(CONFIG) /*html*/`
    ${Button}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <button hx-trigger="click" hx-target="#parent-div" hx-get="/clicked" _="on click
            call Swal.fire({title: 'Confirm', text:'Do you want to continue?'})
            if result.isConfirmed trigger confirmed">
      Click me 2
    </button>
    <div>You are on the {title} page & your name is {user.name}</div>
    <div id="parent-div"></div>
`;
