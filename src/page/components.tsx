import { Tooltips } from "@components/base/others";
import { Icon } from "@components/icons";

import { useSignOut } from "@services/index";
import { useClient } from "@services/client";

import { useLocation, useNavigate } from "react-router";

export function VerticalNavigationBar() {
  const signOut = useSignOut();
  const { account } = useClient();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { origin } = window.location;

  const size = "size-13";

  const bttClass = (path: string) => {
    const q = size + " btn btn-circle btn-secondary btn-outline";

    const c = {
      className: q,
      onClick: () => navigate(path),
    };

    if (pathname === path) {
      c.className = q + " btn-active";
    }

    return c;
  };

  const imgUrl = account?.profile_image_url || origin + "/avatar.jpg";

  return (
    <div className="mx-12 h-full flex coll spbtw">
      <div className="bg-primary flex coll p-2.5 gap-2.5 rounded-b-full">
        <div
          className={"w-full aspect-square " + size}
          style={{ backgroundImage: `url('${origin + "/logo.svg"}')` }}
        ></div>
        <Tooltips text="Dashboard" className="tooltip-right">
          <button {...bttClass("/")}>
            <Icon name="dashboard" />
          </button>
        </Tooltips>
        {account?.roles.includes("customer") ? (
          <>
            <Tooltips text="Test results" className="tooltip-right">
              <button {...bttClass("/tests")}>
                <Icon name="syringe" />
              </button>
            </Tooltips>
            <Tooltips text="Medicine" className="tooltip-right">
              <button {...bttClass("/medicine")}>
                <Icon name="pill" />
              </button>
            </Tooltips>
          </>
        ) : (
          <>
            <Tooltips text="Tickets" className="tooltip-right">
              <button {...bttClass("/tickets")}>
                <Icon name="confirmation_number" />
              </button>
            </Tooltips>
            <Tooltips text="Schedule" className="tooltip-right">
              <button {...bttClass("/schedule")}>
                <Icon name="event" />
              </button>
            </Tooltips>
            <Tooltips text="Medication" className="tooltip-right">
              <button {...bttClass("/medication")}>
                <Icon name="medication" size="1.625rem" />
              </button>
            </Tooltips>
          </>
        )}
      </div>
      <div className="bg-primary flex coll p-2.5 gap-2.5 rounded-t-full">
        <Tooltips text="Profile" className="tooltip-right">
          <button
            className={"btn btn-circle btn-ghost w-full " + size}
            style={{
              backgroundImage: `url('${imgUrl}')`,
              backgroundSize: "cover",
            }}
          ></button>
        </Tooltips>
        <Tooltips text="Log out" className="tooltip-right">
          <button className={bttClass("").className}>
            <Icon name="logout" onClick={signOut[1]} />
          </button>
        </Tooltips>
      </div>
    </div>
  );
}
