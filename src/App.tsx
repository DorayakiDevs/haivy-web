import { useClient } from "@services/client";

import AuthenticationPage from "@pages/auth";
import AuthorizedPage from "@pages/index";

import { AppWrapperLoading } from "@pages/others/loading";

export default function App() {
  const { session, loading } = useClient();

  if (loading) {
    return <AppWrapperLoading />;
  }

  if (!session?.user) {
    return <AuthenticationPage />;
  } else {
    return <AuthorizedPage />;
  }
}
