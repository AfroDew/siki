import { websiteMenu } from "$data";
import { TopHeader } from "./TopHeader.ts";
import { component, RenderProps } from "siki";

const SearchBar = component /*html*/`

`;

const Menu = component /*html*/`
<div class="main-menu">
  <nav id="mobile-menu">
    <ul>
      ${(props) => {
  return websiteMenu.reduce((acc, link) => {
    const submenu = (link?.submenu?.map((sub_menu) => {
      return /*html*/ `<li class="${setActiveLink(sub_menu.url, props)}">
        <a href="${sub_menu.url}">${sub_menu.name}</a>
      </li>`;
    })) ?? "";

    const formated = /*html*/ `<li class="${
      link.submenu ? "has-dropdown" : ""
    } ${setActiveLink(link.url, props)}">
          <a href=${link.url}>${link.name}</a>
          <ul class="${link.submenu ? `submenu` : ""}">${submenu}</ul>
    </li>`;

    return acc + formated;
  }, "");
}}
    </ul>
  </nav>
</div>
`;

export const Header = component /*html*/`
<header>
      <div class="header__area">
        ${TopHeader}
        <div class="header__bottom ${setHeaderStick}" id="header-sticky">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-xxl-1 col-xl-1 col-lg-1 col-md-6 col-6">
                <div class="logo" style="width: 62px;">
                  <a href="/">
                    <img
                      style="width: 100%; objectFit: contain"
                      src="/assets/img/logo/logo.png"
                      alt="logo"
                    />
                  </a>
                </div>
              </div>
              <div class="col-xxl-8 col-xl-8 col-lg-8 d-none d-lg-block">
                ${Menu}
              </div>
              <div class="col-xxl-3 col-xl-3 col-lg-2 col-md-6 col-6">
                <div class="header__bottom-right d-flex justify-content-end align-items-center pl-30">
                  ${SearchBar}
                  <div class="header__hamburger ml-50 d-xl-none">
                    <button type="button" class="hamurger-btn">
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
`;

function setActiveLink(linkUrl: string, props: RenderProps) {
  return props.$url.pathname === linkUrl ? "is-active" : "";
}

function setHeaderStick(props: RenderProps) {
  return props.headerSticky ? "header__sticky" : "";
}

// const SearchBar = () => {
//   const [searchValue, setSearchValue] = useState(""); // searchValue
//   // const dispatch = useDispatch(); // dispatch
//   const router = useRouter(); // router

//   // handleSubmit
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!searchValue) {
//     } else {
//       // dispatch(searchText(searchValue));
//       router.push("/search-courses");
//     }
//   };
//   return (
//     <div class="header__search w-100 d-none d-xl-block">
//       <form onSubmit={handleSubmit}>
//         <div class="header__search-input">
//           <input
//             onChange={(e) => setSearchValue(e.target.value)}
//             type="text"
//             placeholder="Search..."
//           />
//           <button class="header__search-btn">
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 18 18"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M8.11117 15.2222C12.0385 15.2222 15.2223 12.0385 15.2223 8.11111C15.2223 4.18375 12.0385 1 8.11117 1C4.18381 1 1.00006 4.18375 1.00006 8.11111C1.00006 12.0385 4.18381 15.2222 8.11117 15.2222Z"
//                 stroke="#031220"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M17 17L13.1334 13.1333"
//                 stroke="#031220"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
