import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { InputTextErrorable } from "@components/shared/text";
import { Button } from "@components/shared/buttons";

import { useValidatableState } from "@hooks/useValidatableState";

import { validateBasicPassword, validateEmail } from "@utils/validator";

import { formCardProps, FormHeader } from "./components";

export default function FormLogin() {
  const CardContent = useRef<HTMLDivElement | null>(null);

  const [height, setHeight] = useState<string | number>("fit-content");
  const [usePwdLogin, setPwdLogin] = useState(true);

  const email = useValidatableState("", validateEmail);
  const password = useValidatableState("", validateBasicPassword);

  const willSaveLoginInfo = useState(false);
  const confirmationOTP = useState("");

  const loading = false;

  useEffect(() => {
    const { clientHeight = -1 } = CardContent.current || {};
    const c = clientHeight + 120;

    const newH = clientHeight > 0 ? c : "fit-content";
    setHeight(newH);
  });

  function submitInformation() {
    email.validate();
    password.validate();
  }

  function submitOTPEmail() {
    email.validate();
  }

  function tabSwitch(c = false) {
    return () => setPwdLogin(c);
  }

  return (
    <div {...formCardProps} style={{ ...formCardProps.style, height: height }}>
      <div ref={CardContent}>
        <FormHeader title="Welcome back" type="Login" />

        <div className="p-1 bg-[#eee] w-fit mx-auto mt-6 rounded-field">
          {usePwdLogin ? (
            <div className="flex gap-1 mx-auto jcctr">
              <Button color="primary">Login with email</Button>
              <Button onClick={tabSwitch(false)}>Login with OTP</Button>
            </div>
          ) : (
            <div className="flex gap-1 mx-auto jcctr">
              <Button onClick={tabSwitch(true)}>Login with email</Button>
              <Button color="primary">Login with OTP</Button>
            </div>
          )}
        </div>

        <div className="fade-in" key={usePwdLogin ? "pwd" : "otp"}>
          {usePwdLogin ? (
            <div className="my-[2rem] flex coll gap-[8px]">
              <InputTextErrorable
                label="Email Address"
                placeholder="myemail@email.com"
                icon="email"
                type="email"
                error={email.error}
                state={email.state}
              />

              <InputTextErrorable
                label="Password"
                placeholder="Enter your password"
                icon="key"
                type="password"
                error={password.error}
                state={password.state}
              />

              {/* <InputToggle
              title="Keep me signed in for 30-days"
              state={willSaveLoginInfo}
            /> */}

              <Button
                children="Submit"
                onClick={submitInformation}
                loading={loading}
                color="primary"
              />
            </div>
          ) : (
            <div className="my-10">
              <InputTextErrorable
                label="Email address"
                placeholder="Enter your email address"
                className="w-full"
                icon="email"
                error={email.error}
                state={email.state}
              />

              <Button
                children={"Send me OTP code"}
                onClick={submitOTPEmail}
                loading={loading}
                width="w-full"
                color="primary"
                className="mt-2"
              />
            </div>
          )}
        </div>
        <div className="tactr text-sm">
          <Link className="link" to="/register">
            Don't have an account? Register instead
          </Link>
        </div>
      </div>
    </div>
  );
}
