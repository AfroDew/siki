// import Link from "next/link";
// import SignShape from "../../components/SignShape.tsx";
// import { Metadata } from "next";
// import Alert from "./Alert";
// import { redirect } from "next/navigation";
// import { signIn } from "../../../services/authentication/api";
// import ServerFormButton from "./ServerFormButton";
import { PageProps } from "$fresh/server.ts";
import { SignShape } from "$components";
import Alert from "../../islands/Alert.tsx";
import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { auth } from "$services";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const phoneNumber = form.get("phoneNumber");
    const headers = new Headers();

    // Report invalid phone number
    if (!phoneNumber) {
      headers.set(
        "location",
        "/signin?alert=error&title=Invalid Phone Number&msg=Please provide you phone number.",
      );

      return new Response(null, {
        status: 303,
        headers,
      });
    }

    try {
      // Sign in
      const result = await auth.api.signIn({
        phoneNumber: phoneNumber.toString(),
      });

      console.log({ result });
      // Redirect to verify
      headers.set("location", "/verify/" + result.sessionId);

      return new Response(null, { status: 303, headers });
    } catch (error) {
      console.log({ err: { ...error } });
      headers.set(
        "location",
        "/signin?alert=error&title=Failed to Sign In&msg=" + error.message,
      );

      return new Response(null, {
        status: 303,
        headers,
      });
    }
  },
};

export default function SignIn({ url }: PageProps) {
  let errorAlert = {
    icon: url.searchParams.get("alert") as any,
    title: url.searchParams.get("title"),
    text: url.searchParams.get("msg"),
  };

  console.log({ errorAlert });

  return (
    <>
      <Head>
        <title>Sign in | Academy</title>
        <meta name="decription" content="Sign in for access to Academy" />
      </Head>

      <section className="signup__area p-relative z-index-1 pt-100 pb-145">
        <SignShape man="1" />
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 offset-xxl-2 col-xl-8 offset-xl-2">
              <div className="section__title-wrapper text-center mb-55">
                <h2 className="section__title">
                  Sign in to <br /> your account
                </h2>
                <p>
                  it you dont have an account you can{" "}
                  <a href="#">Register here!</a>
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div className="sign__wrapper white-bg">
                <div className="sign__form">
                  <form method="post">
                    <div className="sign__input-wrapper mb-25">
                      <h5>Phone Number</h5>
                      <div className="sign__input">
                        <input
                          // required
                          type="tel"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          autoFocus
                          value={"+2349167151966"}
                        />
                        <i className="fal fa-phone"></i>
                      </div>
                    </div>
                    <div className="sign__new text-left mb-20">
                      <p>
                        You will receive a verification code right a you sign
                        in.
                      </p>
                    </div>
                    <button type="submit" className="tp-btn w-100">
                      Sign In
                    </button>
                    {
                      /* <ServerFormButton
                      className="tp-btn w-100"
                      loadingElement="Signing in..."
                    >
                      Sign In
                    </ServerFormButton> */
                    }
                    <div className="sign__new text-center mt-20">
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

        {/* Alert */}
        <Alert alert={errorAlert} />
      </section>
    </>
  );
}
