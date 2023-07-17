import type { ComponentChildren } from "preact";
import { Header } from "./Header.tsx";
import { Footer } from "./Footer.tsx";

interface Props {
  pathname: string;
  children: ComponentChildren;
}

export function WebsiteLayout({ children, pathname }: Props) {
  return (
    <>
      <Header pathname={pathname} />
      {children}
      <Footer />
    </>
  );
}
