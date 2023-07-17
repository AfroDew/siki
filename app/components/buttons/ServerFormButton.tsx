// "use client";

// import { experimental_useFormStatus as useFormStatus } from "react-dom";
// import React, { HTMLAttributes, ReactNode } from "react";

// interface Props extends HTMLAttributes<HTMLButtonElement> {
//   children: ReactNode | ReactNode[];
//   loadingElement?: ReactNode;
// }

// export default function ServerFormButton({
//   children,
//   loadingElement,
//   ...otherProps
// }: Props) {
//   const { pending } = useFormStatus();

//   return (
//     <button disabled={pending} type="submit" {...otherProps}>
//       {pending ? (loadingElement ? loadingElement : "Loading...") : children}
//     </button>
//   );
// }
