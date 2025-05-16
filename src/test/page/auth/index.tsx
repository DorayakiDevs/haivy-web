import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router";

import { ErrorableTextInput, InputToggle } from "@components/base/input";
import { LTRLoadingBar, Tooltips } from "@components/base/others";

import { getRandomName } from "utils/generator";
import {
  validateBasicPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from "utils/validator";
import { wait } from "utils/timing";

type Validator = (cur: string) => string;

function useFieldState(initialValue = "", validator?: Validator) {
  const state = useState(initialValue);
  const [error, setError] = useState("");
  const [value, setValue] = state;

  useEffect(() => {
    setError("");
  }, [value]);

  /**
   * Validate current state
   * @param __validator Override validator
   * @returns
   */
  function validate(__validator?: Validator) {
    const vad = __validator || validator;
    if (!vad) return "";

    const err = vad(value);
    setError(err);

    return !err;
  }

  return { state, current: value, setValue, error, validate };
}

const formCardProps = {
  className:
    "card bg-base-100 max-w-[1200px] p-[2rem] pt-[2rem] rounded-3xl w-full key-fade-in",
  style: {
    boxShadow: "#0003 0px 3px 18px",
  },
};

export function AuthenticationPage() {
  return (
    <LogoLeftSidePreset>
      <Routes>
        <Route path="/register" element={<FormRegister />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/*" element={<FormLogin />} />
      </Routes>
    </LogoLeftSidePreset>
  );
}

function LogoLeftSidePreset(props: any) {
  return (
    <div className="app-wrapper flex aictr">
      <div className="flex-1 flex jcctr">
        <div className="flex coll gap-16">
          <div className="flex coll gap-[64px]" style={{ color: "#f1ffc4" }}>
            <div
              className="w-[156px] h-[156px] bg-no-repeat bg-cover rounded-[16px] logo-glow"
              style={{
                backgroundImage: `url('${window.location.origin}/logo.svg')`,
                backgroundColor: "var(--color-primary)",
              }}
            ></div>
            <div>
              <h1 className="text-[3.25rem] font-bold">Haivy</h1>
              <p className="my-2 text-[1.2rem]">
                Your trusted companion on the journey to an HIV-free life.
              </p>
            </div>
          </div>

          <div className="text-sm text-white">
            <div className="opacity-80">Copyright © 2025 DorayakiDevs Ltd.</div>
            <div className="py-1 gap-2 flex aictr">
              <a href="" className="link link-hover">
                About Us
              </a>
              <span>•</span>
              <a href="" className="link link-hover">
                Services
              </a>
              <span>•</span>
              <a href="" className="link link-hover">
                Contact Us
              </a>
              <span>•</span>
              <a href="" className="link link-hover">
                Acknowledgement
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-1 h-[200px] border-primary opacity-20"></div>

      <div className="px-[4rem] w-[45%]">{props.children}</div>
    </div>
  );
}

function FormHeader({ title, type }: { title: string; type: string }) {
  return (
    <div className="flex">
      <div className="flex-1">
        <div>{type}</div>
        <div className="text-4xl font-bold text-primary">{title}</div>
      </div>

      <img
        src={window.location.origin + `/icons/waving.svg`}
        width={50}
        className="key-waving"
      />
    </div>
  );
}

function FormRegister() {
  const email = useFieldState("", validateEmail);
  const fullname = useFieldState("", validateFullName);
  const password = useFieldState("", validatePassword);
  const repassword = useFieldState("");

  const [loading, setLoading] = useState(false);

  function giveRandomName() {
    fullname.setValue(getRandomName());
  }

  function submitInformation() {
    const a = email.validate();
    const b = fullname.validate();
    const c = password.validate();
    const d = repassword.validate((cur) => {
      if (!c) return "";

      if (cur !== password.current) {
        return "Password don't match";
      }

      return "";
    });

    if (!a || !b || !c || !d) return;

    const inputEmail = email.current;
    const inputFullname = fullname.current;
    const inputPassword = password.current;
    const inputRepassword = repassword.current;

    setLoading(true);

    // Send stuff to server here.
    wait(2000, () => {
      setLoading(false);

      console.log(inputEmail, inputFullname, inputPassword, inputRepassword);
    });
  }

  return (
    <div {...formCardProps}>
      <FormHeader title="Hello there!" type="Register" />

      <div className="my-[2rem] flex coll gap-[8px]">
        <ErrorableTextInput
          title="Email address"
          placeholder="thomasjeffison@gmail.com"
          inputClass="w-full"
          icon="email"
          state={email.state}
          error={email.error}
        />

        <ErrorableTextInput
          title="Full name"
          placeholder="Thomas Jeffeson"
          inputClass="w-full"
          icon="person"
          state={fullname.state}
          error={fullname.error}
        >
          <button className="btn btn-neutral" onClick={giveRandomName}>
            Surprise me!
          </button>
        </ErrorableTextInput>

        <ErrorableTextInput
          title="Password"
          placeholder="Enter a secure password"
          inputClass="w-full"
          icon="password"
          type="password"
          state={password.state}
          error={password.error}
        />

        <ErrorableTextInput
          placeholder="Re-enter your password"
          inputClass="w-full"
          type="password"
          state={repassword.state}
          error={repassword.error}
          title="Retype your password"
          icon="password"
        />

        {loading ? (
          <LTRLoadingBar />
        ) : (
          <div className="btn btn-primary" onClick={submitInformation}>
            Create my account
          </div>
        )}
      </div>

      <Link className="link tactr text-sm" to="/login">
        Already have an account? Log in instead
      </Link>
    </div>
  );
}

function FormLogin() {
  const email = useFieldState("", validateEmail);
  const password = useFieldState("", validateBasicPassword);
  const willSaveLoginInfo = useState(false);

  const [loading, setLoading] = useState(false);

  function submitInformation() {
    const a = email.validate();
    const b = password.validate();

    if (!a || !b) return;

    const inputEmail = email.current;
    const inputPassword = password.current;

    setLoading(true);

    // Send stuff to server here
    wait(2000, () => {
      setLoading(false);

      console.log(
        inputEmail,
        inputPassword,
        willSaveLoginInfo[0] ? "Cache 30 days" : "No cache"
      );
    });
  }

  return (
    <div {...formCardProps}>
      <FormHeader title="Welcome back" type="Login" />

      <div className="my-[2rem] flex coll gap-[8px]">
        <ErrorableTextInput
          title="Email Address"
          placeholder="thomasjeffison@gmail.com"
          inputClass="w-full"
          icon="email"
          type="email"
          error={email.error}
          state={email.state}
        />

        <ErrorableTextInput
          title="Password"
          placeholder="The secret of the void"
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

        {loading ? (
          <LTRLoadingBar />
        ) : (
          <div className="btn btn-primary" onClick={submitInformation}>
            Submit
          </div>
        )}

        <div className="divider text-[0.75rem]">or login using</div>

        <div className="flex jcctr gap-8">
          <Tooltips text="Login using Apple ID" className="flex aictr">
            <a className="flex aictr link">
              <img
                src={window.location.origin + "/icons/apple.png"}
                width={40}
              />
            </a>
          </Tooltips>
          <Tooltips text="Login using Facebook" className="flex aictr">
            <a className="flex aictr link">
              <img
                src={window.location.origin + "/icons/facebook.png"}
                width={36}
              />
            </a>
          </Tooltips>
          <Tooltips text="Login using Google" className="flex aictr">
            <a className="flex aictr link">
              <img
                src={window.location.origin + "/icons/google.png"}
                width={36}
              />
            </a>
          </Tooltips>
        </div>
      </div>

      <Link className="link tactr text-sm" to="/register">
        Don't have an account? Register instead
      </Link>
    </div>
  );
}
