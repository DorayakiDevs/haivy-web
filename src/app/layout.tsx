import { useEffect, useState } from "react";
import "./index.css";

import { useServices } from "@services/index";

import { AuthenticationPages, AuthenticatedPage } from "@pages";
import FullscreenLoading from "@pages/others/loading";

export default function ApplicationLayout() {
  const { auth, client } = useServices();
  const [loading, setLoading] = useState(true);

  function handleAuthChange() {
    setLoading(false);
  }

  useEffect(() => {
    const s = client.auth.onAuthStateChange(handleAuthChange);

    return () => {
      s.data.subscription.unsubscribe();
    };
  }, [client]);

  if (loading) {
    return <FullscreenLoading showLogo showPlaceholder />;
  }

  if (!auth.user) {
    return <AuthenticationPages />;
  }

  return <AuthenticatedPage />;
}
