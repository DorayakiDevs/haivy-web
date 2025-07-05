import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { Tooltip } from "@components/shared/tooltip";
import { Loading } from "@components/icons/loading";
import { Icon } from "@components/icons/google";

import { getUserAvatar } from "@utils/parser";

import logo from "@assets/logo.svg";

const BASE_CLSS = "border-1 text-secondary rounded-full w-full aspect-square";
const BTT_CLSS =
  BASE_CLSS +
  " hover:bg-secondary hover:text-secondary-content transition-all cursor-pointer";

type T_RouteButton = {
  name: string;
  path: string;
  icon: string;

  exact?: boolean;
};

function buildNavBar(roles: Haivy.Enum<"user_role">[] = []): T_RouteButton[] {
  const list = [];

  list.push({ name: "Dashboard", icon: "dashboard", path: "/", exact: true });
  list.push({ name: "Schedule", icon: "event", path: "/schedule" });

  if (roles.includes("staff")) {
    list.push({
      name: "Tickets",
      icon: "confirmation_number",
      path: "/tickets",
    });
  }

  list.push({ name: "Medicine", icon: "medication", path: "/medication" });

  return list;
}

export function NavigationBar() {
  //   const { client } = useServices();

  const routes = buildNavBar(["guest"]);

  return (
    <div className="mx-6 h-full flex coll spbtw relative z-2 w-20">
      <div className="bg-primary flex coll p-1.5 gap-1.5 rounded-b-full">
        <img src={logo} className="w-full" />

        {routes.map((route) => (
          <NavBarButton {...route} />
        ))}
      </div>

      <div className="bg-primary flex coll p-1.5 gap-1.5 rounded-t-full">
        <AccountSettings />
        <LogOutButton />
      </div>
    </div>
  );
}

function NavBarButton({ name, path, icon, exact }: T_RouteButton) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function getButtonProps(path: string) {
    const c = {
      className: BTT_CLSS,
      onClick: () => navigate(path),
    };

    if (pathname === path || (!exact && pathname.startsWith(path))) {
      c.className += " bg-secondary text-secondary-content";
    }

    return c;
  }

  return (
    <Tooltip title={name} dir="right">
      <button {...getButtonProps(path)}>
        <Icon name={icon} size="1.6em" />
      </button>
    </Tooltip>
  );
}

function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const logOutModal = useRef<HTMLDialogElement | null>(null);

  function handleModalClick() {
    logOutModal.current?.showModal();
  }

  function handleLogOut(e: React.MouseEvent) {
    e.stopPropagation();
    // signOut();
  }

  const className = BTT_CLSS;

  return (
    <>
      <Tooltip title="Log out" className="tooltip-right">
        <button className={className} onClick={handleModalClick}>
          <Icon name="logout" />
        </button>
      </Tooltip>

      <dialog className="modal" ref={logOutModal}>
        {loading ? (
          <div className="modal-box">
            <div className="h-40 flex aictr jcctr coll gap-4">
              <Loading type="spinner" size="xl" />
              <p>Hang on tight, logging you out!</p>
            </div>
          </div>
        ) : (
          <div className="modal-box">
            <h3 className="font-bold text-lg">Logout confirmation</h3>
            <p className="py-4">Are you sure you want to logout?</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn ghost">Cancel</button>
              </form>
              <button className="btn btn-error" onClick={handleLogOut}>
                Log out
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function AccountSettings() {
  const nav = useNavigate();
  //   const { account } = useClient();
  const account = null;

  if (!account) {
    return (
      <div className="w-full aspect-square bg-secondary rounded-full content-ctr">
        <Loading color="primary" />
      </div>
    );
  }

  const imgUrl = getUserAvatar(account);

  function navigate() {
    if (location.pathname === "/settings") {
      return;
    }

    nav("/settings");
  }

  return (
    <Tooltip title="Profile" className="tooltip-right">
      <button
        className="btn btn-circle btn-ghost w-full"
        style={{
          backgroundImage: imgUrl,
          backgroundSize: "cover",
        }}
        onClick={navigate}
      ></button>
    </Tooltip>
  );
}
