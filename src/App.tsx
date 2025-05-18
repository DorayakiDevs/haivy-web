import { useEffect, useState } from "react";

import { type User } from "@supabase/supabase-js";

import { useClient } from "@auth/client";

import AuthenticationPage from "@pages/auth";
import { DashboardPage } from "@pages/dashboard";

export default function App() {
  const client = useClient();

  const [user, setUser] = useState<User | null>(null);

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

  if (!user) {
    return <AuthenticationPage />;
  } else {
    return <DashboardPage />;
  }
}
