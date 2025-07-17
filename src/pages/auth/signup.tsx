import { useState } from "react";
import { Link } from "react-router";

import { InputTextErrorable } from "@components/shared/text";
import { Button } from "@components/shared/buttons";

import { useServices } from "@services/index";

import useValidatableState from "@hooks/useValidatableState";
import useUI from "@hooks/useUI";

import { validateEmail, validatePassword } from "@utils/validator";

import { formCardProps, FormHeader } from "./components";
import { parseError } from "@utils/parser";

export default function FormRegister() {
  const { client } = useServices();
  const { toaster } = useUI();

  const [loading, setLoading] = useState(false);

  const sEmail = useValidatableState("", validateEmail);
  const sPassword = useValidatableState("", validatePassword);
  const sRepassword = useValidatableState("");

  // function giveRandomName() {
  //   fullname.setValue(getRandomName());
  // }

  async function submitInformation() {
    const a = sEmail.validate();
    const b = sPassword.validate();
    if (!a || !b) return;

    const email = sEmail.current;
    const password = sPassword.current;

    const c = sRepassword.validate((cur) => {
      if (cur !== password) {
        return "Password must match!";
      }
    });

    if (!c) return;

    setLoading(true);

    const { error, data } = await client.auth.signUp({ email, password });

    if (error) {
      toaster.error(parseError(error));
    } else {
      toaster.success("Account registered: " + data.user?.email);
    }

    setLoading(false);
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
          state={sEmail.state}
          error={sEmail.error}
        />

        <InputTextErrorable
          label="Password"
          placeholder="Enter a secure password"
          width="w-full"
          icon="password"
          type="password"
          state={sPassword.state}
          error={sPassword.error}
        />

        <InputTextErrorable
          placeholder="Re-enter your password"
          width="w-full"
          type="password"
          state={sRepassword.state}
          error={sRepassword.error}
          label="Retype your password"
          icon="password"
        />

        <Button
          children="Create account"
          onClick={submitInformation}
          loading={loading}
          className="mt-2"
        />
      </div>

      <Link className="link tactr text-sm" to="/login">
        Already have an account? Log in instead
      </Link>
    </div>
  );
}
