import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

import type { User } from "@supabase/supabase-js";

import { NotFoundPage } from "../others/notfound";

import { useSignOut } from "@auth/index";
import { useClient } from "@auth/client";

import { wait } from "@utils/timing";

export function DashboardPage() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/dashboard" element={<ProfileDashboardPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function ProfileDashboardPage() {
  const client = useClient();

  const [user, setUser] = useState<User | null>(null);

  const [_, signOut] = useSignOut({ scope: "global" });

  useEffect(() => {
    const request = { valid: true };

    async function fetch() {
      const { data } = await client.auth.getUser();
      if (!request.valid) return;

      setUser(data.user);
    }

    fetch();

    return () => {
      request.valid = false;
    };
  }, [client]);

  async function handleSignOut() {
    await signOut();

    //! Temporary fix pending for signal implementation
    await wait(1000);
    window.location.pathname = "/dashboard";
  }

  return (
    <div className="h-full flex aictr jcctr coll gap-8">
      <div className="py-4 flex aictr gap-8">
        <img src={window.location.origin + "/logo.svg"} width={156} />
        <div>
          <div className="text-[5rem] font-semibold">Haivy</div>
          <div>Welcome to the dashboard... it will be here soon</div>
        </div>
      </div>
      <div className="card p-4 px-8 bg-primary text-primary-content">
        You are signed in as: {user?.email}
      </div>
      <button className="btn btn-primary btn-outline" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
