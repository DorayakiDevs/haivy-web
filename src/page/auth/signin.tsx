import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { InputTextErrorable, InputToggle } from "@components/base/input";
import { SubmitWithLoading } from "@components/base/button";
import { FormHeader } from ".";

import { useValidatableState, validatePhoneNumber } from "@hooks/validator";

import { useUIContext } from "@context/ui";

import { usePasswordSignIn } from "services/index";
import { useOTPSignIn } from "services/index";

import { validateBasicPassword, validateEmail } from "@utils/validator";

const formCardProps = {
  className: "card bg-base-100 p-8 pt-16 rounded-3xl w-full key-fade-in",
  style: {
    boxShadow: "#0003 0px 3px 18px",
    maxWidth: 1200,
    transition: "height 0.2s",
    overflow: "hidden",
  },
};

export function FormLogin() {
  const CardContent = useRef<HTMLDivElement | null>(null);

  const { alert } = useUIContext();

  const [loginState, login] = usePasswordSignIn();
  const [otpState, sendOTP, verifyOTP, resetOTP] = useOTPSignIn();

  const email = useValidatableState("", validateEmail);
  const password = useValidatableState("", validateBasicPassword);
  const phoneNumber = useValidatableState("", validatePhoneNumber);

  const [useEmailLogin, setEmailLogin] = useState(true);

  const confirmationOTP = useState("");
  const willSaveLoginInfo = useState(false);

  const [height, setHeight] = useState<string | number>("fit-content");

  const loading = loginState.fetching || otpState.fetching;
  const OTPPassedStageOne = !!otpState.phoneNumber;

  useEffect(() => {
    if (useEmailLogin) {
      confirmationOTP[1]("");
      resetOTP();
    }
  }, [useEmailLogin]);

  useEffect(() => {
    const { clientHeight = -1 } = CardContent.current || {};
    const c = clientHeight + 120;

    const newH = clientHeight > 0 ? c : "fit-content";
    setHeight(newH);
  });

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
    <div {...formCardProps} style={{ ...formCardProps.style, height: height }}>
      <div ref={CardContent}>
        <FormHeader title="Welcome back" type="Login" />

        <div className="mt-4 mb-3">
          {useEmailLogin ? (
            <div className="flex gap-1 mx-auto jcctr">
              <button className="btn btn-primary">Login with email</button>
              <button className="btn" onClick={tabSwitch(false)}>
                Login with OTP
              </button>
            </div>
          ) : (
            <div className="flex gap-1 mx-auto jcctr">
              <button className="btn" onClick={tabSwitch(true)}>
                Login with email
              </button>
              <button className="btn btn-primary">Login with OTP</button>
            </div>
          )}
        </div>

        {useEmailLogin ? (
          <div className="my-[2rem] flex coll gap-[8px]">
            <InputTextErrorable
              label="Email Address"
              placeholder="myemail@email.com"
              inputClass="w-full"
              icon="email"
              type="email"
              error={email.error}
              state={email.state}
            />

            <InputTextErrorable
              label="Password"
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
            <InputTextErrorable
              label="Phone number"
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
            </InputTextErrorable>
            {!OTPPassedStageOne || (
              <>
                <InputTextErrorable
                  label="Confirm OTP (6 digits)"
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

        <div className="tactr text-sm">
          <Link className="link" to="/register">
            Don't have an account? Register instead
          </Link>
        </div>
      </div>
    </div>
  );
}
