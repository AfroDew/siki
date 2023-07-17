import { PageProps } from "$fresh/server.ts";
import { Button } from "../components/buttons/Button.tsx";

export default function Greet(props: PageProps) {
  return (
    <>
      <div>Hello {props.params.name}</div>
      <Button>Hey</Button>
    </>
  );
}
