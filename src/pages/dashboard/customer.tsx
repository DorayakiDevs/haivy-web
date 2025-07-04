import { useServices } from "@services/index";

export default function CustomerDashboard() {
  const { auth } = useServices();

  if (!auth.user) return <></>;
  const user = auth.user;

  return <div className="content-wrapper">Welcome back, {user.email}</div>;
}
