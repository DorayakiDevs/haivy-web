import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export function Navigate({
  path,
  replace,
}: {
  path: string;
  replace?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  useEffect(() => {
    if (path === pathname) {
      return;
    }

    navigate(path, { replace });
  }, [pathname, path, replace]);

  return null;
}
