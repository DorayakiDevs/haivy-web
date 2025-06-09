import { useClient } from "@services/client";

import AuthenticationRouter from "@pages/auth";
import AuthorizedRouter from "@pages";

import { AppWrapperLoading } from "@pages/others/loading";

export default function RoutedApplication() {
  const { session, loading } = useClient();

  if (loading) {
    return <AppWrapperLoading />;
  }

  if (!session?.user) {
    return <AuthenticationRouter />;
  } else {
    return <AuthorizedRouter />;
  }
}
