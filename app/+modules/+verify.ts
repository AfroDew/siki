import { component, module, page, PageConfig, Render, RenderProps } from "siki";
import { SignShape } from "$components";
import { block } from "../../src/block.ts";

const ErrorAlert = component /*html*/`
<script> Swal.fire("{title}", "{body}", 'error')</script>
`;

const layout = "website";
const head = { title: "Verification" };

export default module({
  path: "/verify",

  routes: {
    "[sessionId]::GET": page({ layout, head }) /*html*/`
      <section class="signup__area p-relative z-index-1 pt-100 pb-145">
        ${SignShape("1")}
        <div class="container">
          <div class="row">
            <div class="col-xxl-8 offset-xxl-2 col-xl-8 offset-xl-2">
              <div class="section__title-wrapper text-center mb-55">
              <h2 class="section__title">Verify Sign</h2>
              <p>Please provide the verification code sent to you via SMS.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div class="sign__wrapper white-bg">
                <div class="sign__form">
                  <form  hx-post="/verify" hx-trigger="submit" hx-swap="beforeend" >
                    <div class="sign__input-wrapper mb-25">
                      <input name="sessionId" hidden value="{$param.sessionId}" />
                      <h5>Verification Code</h5>
                      <div class="sign__input">
                        <input
                          name="code"
                          placeholder="Provide code here"
                          autoFocus
                        />
                        <i class="fal fa-message"></i>
                      </div>
                    </div>
                    <button type="submit" class="tp-btn w-100">
                      Verify
                    </button>
                    <div class="sign__new text-center mt-20">
                      <p>
                        Did not receive an code? <a href="/signin">Resend</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,

    "$::POST": block({ handle: handleVerify }) /*html*/`${ErrorAlert}`,
  },
});

/*====================== Handlers =====================*/

async function handleVerify(
  request: Request,
  _props: RenderProps,
  render: Render,
) {
  const formData = await request.formData();
  const sessionId = formData.get("sessionId");
  const code = formData.get("code");

  // Handle session id
  if (!sessionId || !code) {
    return render({
      title: "Invalid Verification",
      body: "Error verifying your code, please try sign in again.",
    });
  }

  // TODO: SET COOKIES

  // Handle Success
  return new Response(null, {
    status: 302,
    headers: { "HX-Redirect": "/app" },
  });
}