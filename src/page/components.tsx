import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import { LoadingIcon } from "@components/icons/others";
import { Tooltips } from "@components/base/others";
import { Icon } from "@components/icons";

import { useSignOut } from "@services/index";
import { useClient } from "@services/client";
import { Parser } from "@utils/parser";

const BTT_SIZE = "size-13";

type T_RouteButton = {
  name: string;
  path: string;
  icon: string;

  exact?: boolean;
};

function buildNavBar(roles: Haivy.Enum<"role">[] = []): T_RouteButton[] {
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

export function VerticalNavigationBar() {
  const { account } = useClient();

  const roles = account?.roles ?? [];

  const routes = buildNavBar(roles);

  return (
    <div className="mx-12 h-full flex coll spbtw relative z-2">
      <div className="bg-primary flex coll p-2.5 gap-2.5 rounded-b-full">
        <div
          className={"w-full aspect-square " + BTT_SIZE}
          style={{ backgroundImage: `url('${origin + "/logo.svg"}')` }}
        ></div>

        {routes.map((route) => (
          <NavBarButton {...route} />
        ))}
      </div>

      <div className="bg-primary flex coll p-2.5 gap-2.5 rounded-t-full">
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
    const q = BTT_SIZE + " btn btn-circle btn-secondary btn-outline";

    const c = {
      className: q,
      onClick: () => navigate(path),
    };

    if (pathname === path || (!exact && pathname.startsWith(path))) {
      c.className = q + " btn-active";
    }

    return c;
  }

  return (
    <Tooltips text={name} dir="right">
      <button {...getButtonProps(path)}>
        <Icon name={icon} />
      </button>
    </Tooltips>
  );
}

function LogOutButton() {
  const logOutModal = useRef<HTMLDialogElement | null>(null);
  const [signOutState, signOut] = useSignOut();

  function handleModalClick() {
    logOutModal.current?.showModal();
  }

  function handleLogOut(e: React.MouseEvent) {
    e.stopPropagation();
    signOut();
  }

  const className = BTT_SIZE + " btn btn-circle btn-secondary btn-outline";

  return (
    <>
      <Tooltips text="Log out" className="tooltip-right">
        <button className={className} onClick={handleModalClick}>
          <Icon name="logout" />
        </button>
      </Tooltips>

      <dialog className="modal" ref={logOutModal}>
        {signOutState.fetching ? (
          <div className="modal-box">
            <div className="h-40 flex aictr jcctr coll gap-4">
              <LoadingIcon />
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
  const { account } = useClient();

  if (!account) {
    return <LoadingIcon />;
  }

  const imgUrl = Parser.getUserAvatar(account);

  function navigate() {
    if (location.pathname === "/settings") {
      return;
    }

    nav("/settings");
  }

  return (
    <Tooltips text="Profile" className="tooltip-right">
      <button
        className={"btn btn-circle btn-ghost w-full " + BTT_SIZE}
        style={{
          backgroundImage: imgUrl,
          backgroundSize: "cover",
        }}
        onClick={navigate}
      ></button>
    </Tooltips>
  );
}
