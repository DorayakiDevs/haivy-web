import { Route, Routes } from "react-router";

import { FormRegister } from "./signup";
import { FormLogin } from "./signin";

export default function AuthenticationPage() {
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
    <div className="app-wrapper auth-page flex aictr">
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

export function FormHeader({ title, type }: { title: string; type: string }) {
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
