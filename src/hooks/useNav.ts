import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

export default function useNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function customNav(path: string | number) {
    if (typeof path === "number") {
      navigate(path);
      return;
    }

    if (!path.startsWith("/")) {
      throw new Error("String path must starts with '/'");
    }

    if (pathname === path) {
      return;
    }

    navigate(path);
  }

  return useMemo(() => customNav, [pathname, navigate]);
}
