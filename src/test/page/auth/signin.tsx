import { useEffect, useState } from "react";
import { Link } from "react-router";

import { ErrorableTextInput, InputToggle } from "@components/base/input";
import { SubmitWithLoading } from "@components/base/button";
import { FormHeader } from ".";

import { useValidatableState, validatePhoneNumber } from "@hooks/validator";

import { useUIContext } from "@context/ui";

import { usePasswordSignIn } from "@auth/index";
import { useOTPSignIn } from "@auth/index";

import { validateBasicPassword, validateEmail } from "@utils/validator";
import { wait } from "@utils/timing";

const formCardProps = {
  className: "card bg-base-100 p-8 pt-16 rounded-3xl w-full key-fade-in",
  style: { boxShadow: "#0003 0px 3px 18px", maxWidth: 1200 },
};

export function FormLogin() {
  const { alert } = useUIContext();

  const [loginState, login] = usePasswordSignIn();
  const [otpState, sendOTP, verifyOTP, resetOTP] = useOTPSignIn();

  const email = useValidatableState("", validateEmail);
  const password = useValidatableState("", validateBasicPassword);
  const phoneNumber = useValidatableState("", validatePhoneNumber);

  const [useEmailLogin, setEmailLogin] = useState(true);

  const confirmationOTP = useState("");
  const willSaveLoginInfo = useState(false);

  const loading = loginState.fetching || otpState.fetching;
  const OTPPassedStageOne = !!otpState.phoneNumber;

  useEffect(() => {
    if (useEmailLogin) {
      confirmationOTP[1]("");
      resetOTP();
    }
  }, [useEmailLogin]);

  async function submitInformation() {
    if (loading) {
      return;
    }

    if (loginState.user) {
      return;
    }

    const a = email.validate();
    const b = password.validate();

    if (!a || !b) return;

    const inputEmail = email.current;
    const inputPassword = password.current;

    const { data, error } = await login(inputEmail, inputPassword);

    if (error) {
      alert.toggle({
        text: `[${error.status}] Error: ${error.message}`,
        type: "error",
        icon: "close",
      });
      return;
    } else {
      alert.toggle({
        text: `You have sucessfully log-in as: ${data.user.email}`,
        type: "success",
      });

      //! Temporary fix pending for signal implementation
      await wait(1000);
      window.location.pathname = "/";

      return;
    }
  }

  async function submitPhoneNumber() {
    if (OTPPassedStageOne) {
      const inputOTP = confirmationOTP[0];

      const OTPStageTwo = await verifyOTP(inputOTP);

      if (OTPStageTwo.error) {
        const error = OTPStageTwo.error;

        alert.toggle({
          text: `[${error.status}] Error: ${error.message}`,
          type: "warning",
        });
        return;
      }

      const data = OTPStageTwo.data;
      alert.toggle({
        text: `You have sucessfully log-in as: ${data.user?.phone}`,
        type: "success",
      });

      //! Temporary fix pending for signal implementation
      await wait(1000);
      window.location.pathname = "/dashboard";

      return;
    }

    const a = phoneNumber.validate();
    if (!a) return;

    let inputNumber = phoneNumber.current;
    if (inputNumber.startsWith("0")) {
      inputNumber = "+84" + inputNumber.slice(1);
    }

    const OTPStageOne = await sendOTP(inputNumber);

    if (OTPStageOne.error) {
      const error = OTPStageOne.error;

      alert.toggle({
        text: `[${error.status}] Error: ${error.message}`,
        type: "warning",
      });
      return;
    }
  }

  const tabSwitch =
    (c = false) =>
    () =>
      setEmailLogin(c);

  return (
    <div {...formCardProps}>
      <FormHeader title="Welcome back" type="Login" />

      {useEmailLogin ? (
        <div className="flex gap-1 mx-auto mt-8">
          <button className="btn btn-primary">Login with email</button>
          <button className="btn" onClick={tabSwitch(false)}>
            Login with OTP
          </button>
        </div>
      ) : (
        <div className="flex gap-1 mx-auto mt-8">
          <button className="btn" onClick={tabSwitch(true)}>
            Login with email
          </button>
          <button className="btn btn-primary">Login with OTP</button>
        </div>
      )}

      {useEmailLogin ? (
        <div className="my-[2rem] flex coll gap-[8px]">
          <ErrorableTextInput
            title="Email Address"
            placeholder="myemail@email.com"
            inputClass="w-full"
            icon="email"
            type="email"
            error={email.error}
            state={email.state}
          />

          <ErrorableTextInput
            title="Password"
            placeholder="Enter your password"
            inputClass="w-full"
            icon="key"
            type="password"
            error={password.error}
            state={password.state}
          />

          <InputToggle
            title="Keep me signed in for 30-days"
            state={willSaveLoginInfo}
          />

          <SubmitWithLoading
            text="Submit"
            onClick={submitInformation}
            loading={loading}
          />
        </div>
      ) : (
        <div className="my-10">
          <ErrorableTextInput
            title="Phone number"
            placeholder="Enter your mobile phone number"
            inputClass="w-full"
            icon="phone"
            type="tel"
            error={phoneNumber.error}
            state={phoneNumber.state}
          >
            <select
              defaultValue="Pick a color"
              className="select w-[12em]"
              disabled
            >
              <option>Vietnam (+84)</option>
            </select>
          </ErrorableTextInput>
          {!OTPPassedStageOne || (
            <>
              <ErrorableTextInput
                title="Confirm OTP (6 digits)"
                placeholder="Please confirm your OTP (Expires in 60 seconds)"
                inputClass="w-full"
                icon="password"
                maxLength={6}
                state={confirmationOTP}
              />
              <InputToggle
                title="Keep me signed in for 30-days"
                state={willSaveLoginInfo}
              />
            </>
          )}

          <SubmitWithLoading
            text={OTPPassedStageOne ? "Confirm OTP" : "Send me OTP code"}
            onClick={submitPhoneNumber}
            loading={loading}
          />
        </div>
      )}

      <Link className="link tactr text-sm" to="/register">
        Don't have an account? Register instead
      </Link>
    </div>
  );
}
