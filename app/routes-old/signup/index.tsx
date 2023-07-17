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

export default function SignUp({ url, data }: PageProps) {
  return (
    <>
      <Head>
        <title>Sign up | Academy</title>
        <meta name="decription" content="Sign up for access to Academy" />
      </Head>

      <section className="signup__area p-relative z-index-1 pt-100 pb-145">
        <SignShape />
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 offset-xxl-2 col-xl-8 offset-xl-2">
              <div className="section__title-wrapper text-center mb-55">
                <h2 className="section__title">Create an Account</h2>
                <p>Be part of our Academy</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div className="sign__wrapper white-bg">
                <div className="sign__form">
                  <form>
                    <div className="sign__input-wrapper mb-25">
                      <h5>Full Name</h5>
                      <div className="sign__input">
                        <input
                          name="name"
                          type="text"
                          placeholder="Full name"
                          autoFocus
                          value="Godstime Israel"
                        />
                        <i className="fal fa-user"></i>
                      </div>
                    </div>
                    <div className="sign__input-wrapper mb-25">
                      <h5>Phone Number</h5>
                      <div className="sign__input">
                        <input
                          name="phoneNumber"
                          value="+2349167151966"
                          type="tel"
                          placeholder="Phone Number"
                        />
                        <i className="fal fa-phone"></i>
                      </div>
                    </div>
                    <div className="sign__action d-flex justify-content-between mb-30">
                      <div className="sign__agree d-flex align-items-center">
                        <input
                          checked
                          name="agreed"
                          className="m-check-input"
                          type="checkbox"
                          id="m-agree"
                        />
                        <label className="m-check-label" htmlFor="m-agree">
                          I agree to the <a href="#">Terms & Conditions</a>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="tp-btn w-100"
                    >
                      Sign Up
                    </button>
                    <div className="sign__new text-center mt-20">
                      <p>
                        Already in Academy ?<a href="/signin">Sign In</a>
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
