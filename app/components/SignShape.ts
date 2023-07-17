import { component } from "siki";

export function SignShape(man?: string) {
  return component /*html*/`
  <div class="sign__shape">
    <img
      class="man-1"
      src="/assets/img/icon/sign/man-${man || "3"}.png"
      alt=""
    />
    <img
      class="man-2 man-22"
      src="/assets/img/icon/sign/man-2.png"
      alt=""
    />
    <img class="circle" src="/assets/img/icon/sign/circle.png" alt="" />
    <img class="zigzag" src="/assets/img/icon/sign/zigzag.png" alt="" />
    <img class="dot" src="/assets/img/icon/sign/dot.png" alt="" />
    <img class="bg" src="/assets/img/icon/sign/sign-up.png" alt="" />
    <img class="flower" src="/assets/img/icon/sign/flower.png" alt="" />
  </div>
  `;
}
