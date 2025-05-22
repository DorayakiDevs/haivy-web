import { Icon } from "@components/icons";
import { useSignOut } from "services";
import { useClient } from "services/client";

export function StaffDashboard() {
  const [_, signOut] = useSignOut();
  const { session, account } = useClient();

  const { first_name = "", last_name = "", account_type = "" } = account || {};
  const displayName = `${first_name} ${last_name}`.trim() || "Unnamed idiot";

  const authAccount = session?.user.email || "+" + session?.user.phone;

  return (
    <div className="h-full key-fade-in flex coll">
      <div className="py-6 flex aictr spbtw">
        <div className="">
          <div>Welcome back</div>
          <div className="text-4xl font-bold">{displayName}</div>
          <div className="text-sm">
            [<span className="capitalize">{account_type}</span>] Signed in with:{" "}
            {authAccount}
          </div>
        </div>
        <button className="btn btn-primary" onClick={signOut}>
          <Icon name="logout" />
          Sign out
        </button>
      </div>

      <div className="flex coll flex-1">
        <div className=""></div>
        <div className=""></div>
      </div>
    </div>
  );
}
