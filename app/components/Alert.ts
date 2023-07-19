import { component, RenderProps } from "siki";

export const Alert = component /*html*/`
    <script> Swal.fire("{title}", "{body}", "${setError}")</script>
`;

function setError(props: RenderProps) {
  return props.icon ?? "success";
}
