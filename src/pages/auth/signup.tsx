import { Link } from "react-router";

import { InputTextErrorable } from "@components/shared/text";

import { useValidatableState } from "@hooks/useValidatableState";

import { validateEmail, validatePassword } from "@utils/validator";

import { formCardProps, FormHeader } from "./components";

import { useToaster } from "@components/feedbacks/toaster/context";

import { Button } from "@components/shared/buttons";

export default function FormRegister() {
  const toaster = useToaster();

  const email = useValidatableState("", validateEmail);
  const password = useValidatableState("", validatePassword);
  const repassword = useValidatableState("");

  // function giveRandomName() {
  //   fullname.setValue(getRandomName());
  // }

  async function submitInformation() {
    toaster.open({ content: "Hi this is a toaster!", color: "info" });
  }

  return (
    <div {...formCardProps}>
      <FormHeader title="Hello there!" type="Register" />

      <div className="my-[2rem] flex coll gap-[8px]">
        <InputTextErrorable
          label="Email address"
          placeholder="abrahamlincoln@kennedy.com"
          width="w-full"
          icon="email"
          state={email.state}
          error={email.error}
        />

        <InputTextErrorable
          label="Password"
          placeholder="Enter a secure password"
          width="w-full"
          icon="password"
          type="password"
          state={password.state}
          error={password.error}
        />

        <InputTextErrorable
          placeholder="Re-enter your password"
          width="w-full"
          type="password"
          state={repassword.state}
          error={repassword.error}
          label="Retype your password"
          icon="password"
        />

        <Button
          children="Create account"
          onClick={submitInformation}
          loading={false}
          className="mt-2"
        />
      </div>

      <Link className="link tactr text-sm" to="/login">
        Already have an account? Log in instead
      </Link>
    </div>
  );
}
