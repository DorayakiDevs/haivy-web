import "./index.css";

import { useServices } from "@services/index";

import { AuthenticationPages, AuthenticatedPage } from "@pages";
import FullscreenLoading from "@pages/others/loading";

export default function ApplicationLayout() {
  const { auth } = useServices();

  if (!auth.userDetails) {
    return <FullscreenLoading showLogo showPlaceholder />;
  }

  if (!auth.user) {
    return <AuthenticationPages />;
  }

  return <AuthenticatedPage />;
}
