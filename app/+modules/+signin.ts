import { block, module, page, Render, RenderProps } from "siki";
import { SignShape } from "$components";

const head = { title: "Sign In" };
const layout = "website";

export default module({
  path: "/signin",
  routes: {
    // Handle Sign in page
    "$::GET": page({ head, layout }) /*html*/`
      <section class="signup__area p-relative z-index-1 pt-100 pb-145">
        ${SignShape("1")}
        <div class="container">
          <div class="row">
            <div class="col-xxl-8 offset-xxl-2 col-xl-8 offset-xl-2">
              <div class="section__title-wrapper text-center mb-55">
                <h2 class="section__title">
                  Sign in to <br /> your account
                </h2>
                <p>
                  it you dont have an account you can{" "}
                  <a href="#">Register here!</a>
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div class="sign__wrapper white-bg">
                <div class="sign__form">
                  <form  hx-post="/signin" hx-trigger="submit" hx-swap="beforeend" >
                    <div class="sign__input-wrapper mb-25">
                      <h5>Phone Number</h5>
                      <div class="sign__input">
                        <input
                          type="tel"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          autoFocus
                          value="+2341234567890"
                        />
                        <i class="fal fa-phone"></i>
                      </div>
                    </div>
                    <div class="sign__new text-left mb-20">
                      <p>
                        You will receive a verification code right a you sign
                        in.
                      </p>
                    </div>
                    <button type="submit" class="tp-btn w-100">
                      Sign In <img id="indicator" class="htmx-indicator" src="/loading.svg"/>
                    </button>
                    <div class="sign__new text-center mt-20">
                      <p>
                        New to Academy ? <a href="/signup">Sign Up</a>
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

    // Handle form submission
    "$::POST": block({ handle: handleSignAction }) /*html*/`
      <script>
        Swal.fire('Invalid Phone number', 'Provide a valid phone number', 'error')
      </script>
    `,
  },
});

/*====================== Handlers =====================*/

async function handleSignAction(
  request: Request,
  _props: RenderProps,
  render: Render,
) {
  const phoneNumber = (await request.formData()).get("phoneNumber");

  // Handle invalid number
  if (!phoneNumber) return render();

  console.log({ phoneNumber });

  // Handle Success
  return new Response(null, {
    status: 302,
    headers: { "HX-Redirect": "/verify/xxxxx" },
  });
}