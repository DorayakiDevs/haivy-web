import { Link } from "react-router";

import { InputTextErrorable } from "@components/base/input";
import { SubmitWithLoading } from "@components/base/button";
import { FormHeader } from ".";

import { useValidatableState } from "@hooks/validator";

import { useUIContext } from "@context/ui";

import { useSignUp } from "services/index";

import { validateEmail, validatePassword } from "@utils/validator";

const formCardProps = {
  className: "card bg-base-100 p-8 pt-16 rounded-3xl w-full key-fade-in",
  style: { boxShadow: "#0003 0px 3px 18px", maxWidth: 1200 },
};

export function FormRegister() {
  const [signUpState, signUp] = useSignUp();
  const { alert } = useUIContext();

  const email = useValidatableState("", validateEmail);
  // const fullname = useValidatableState("", validateFullName);
  const password = useValidatableState("", validatePassword);
  const repassword = useValidatableState("");

  const loading = signUpState.fetching;

  // function giveRandomName() {
  //   fullname.setValue(getRandomName());
  // }

  async function submitInformation() {
    const a = email.validate();
    // const b = fullname.validate();
    const c = password.validate();
    const d = repassword.validate((cur) => {
      if (!c) return "";

      if (cur !== password.current) {
        return "Password don't match";
      }

      return "";
    });

    if (!a || /*!b || */ !c || !d) return;

    const inputEmail = email.current;
    const inputPassword = password.current;

    const { data, error } = await signUp(inputEmail, inputPassword);

    if (error) {
      alert.toggle({
        text: `[${error.status}] Error: ${error.message}`,
        type: "error",
        icon: "close",
      });
      return;
    } else {
      alert.toggle({
        text: `You have signed up with: ${data.user?.email}`,
        type: "success",
      });

      return;
    }
  }

  return (
    <div {...formCardProps}>
      <FormHeader title="Hello there!" type="Register" />

      <div className="my-[2rem] flex coll gap-[8px]">
        <InputTextErrorable
          label="Email address"
          placeholder="abrahamlincoln@kennedy.com"
          inputClass="w-full"
          icon="email"
          state={email.state}
          error={email.error}
        />

        {/* <ErrorableTextInput
          title="Full name"
          placeholder="appon"
          inputClass="w-full"
          icon="person"
          state={fullname.state}
          error={fullname.error}
        >
          <button className="btn btn-neutral" onClick={giveRandomName}>
            Surprise me!
          </button>
        </ErrorableTextInput> */}

        <InputTextErrorable
          label="Password"
          placeholder="Enter a secure password"
          inputClass="w-full"
          icon="password"
          type="password"
          state={password.state}
          error={password.error}
        />

        <InputTextErrorable
          placeholder="Re-enter your password"
          inputClass="w-full"
          type="password"
          state={repassword.state}
          error={repassword.error}
          label="Retype your password"
          icon="password"
        />

        <SubmitWithLoading
          text="Create account"
          onClick={submitInformation}
          loading={loading}
        />
      </div>

      <Link className="link tactr text-sm" to="/login">
        Already have an account? Log in instead
      </Link>
    </div>
  );
}
