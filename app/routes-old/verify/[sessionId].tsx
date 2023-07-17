// import Link from "next/link";
// import SignShape from "../../components/SignShape.tsx";
// import { Metadata } from "next";
// import Alert from "./Alert";
// import { redirect } from "next/navigation";
// import { signIn } from "../../../services/authentication/api";
// import ServerFormButton from "./ServerFormButton";
import { PageProps } from "$fresh/server.ts";
import { SignShape } from "$components";
import { Head } from "$fresh/runtime.ts";

export default function Verify({ params }: PageProps) {
  return (
    <>
      <Head>
        <title>Sign up | Academy</title>
        <meta name="decription" content="Sign up for access to Academy" />
      </Head>

      <section className="signup__area p-relative z-index-1 pt-100 pb-145">
        <SignShape man="1" />
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 offset-xxl-2 col-xl-8 offset-xl-2">
              <div className="section__title-wrapper text-center mb-55">
                <h2 className="section__title">Verify Sign</h2>
                <p>Please provide the verification code sent to you via SMS.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div className="sign__wrapper white-bg">
                <div className="sign__form">
                  <form method="post">
                    <div className="sign__input-wrapper mb-25">
                      <h5>Verification Code</h5>
                      <input name="sessionId" hidden value={params.sessionId} />
                      <div className="sign__input">
                        <input
                          name="code"
                          type="text"
                          placeholder="Provide code here"
                          autoFocus
                        />
                        <i className="fal fa-message"></i>
                      </div>
                    </div>
                    <button type="submit" className="tp-btn w-100">
                      Verify
                    </button>
                    <div className="sign__new text-center mt-20">
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

        {/* Alert */}
        {/* <Alert /> */}
      </section>
    </>
  );
}
