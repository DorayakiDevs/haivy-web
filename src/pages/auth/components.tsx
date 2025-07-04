import logo from "@assets/logo.svg";

export function LogoLeftSidePreset(props: React.ChildrenProps) {
  return (
    <div className="app-wrapper auth-page flex aictr">
      <div className="flex-1 flex jcctr">
        <div className="flex coll gap-16">
          <div className="flex coll gap-[64px]" style={{ color: "#f1ffc4" }}>
            <div
              className="w-[156px] h-[156px] rounded-[16px]"
              style={{ boxShadow: "0px 0px 60px #f1ffc4a3" }}
            >
              <img src={logo} />
            </div>
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

export const formCardProps = {
  className: "card bg-base-100 p-8 pt-16 rounded-3xl w-full fade-in",
  style: {
    boxShadow: "#0003 0px 3px 18px",
    maxWidth: 1200,
    transition: "height 0.2s",
    overflow: "hidden",
  },
};
