import { useServices } from "@services/index";

export default function DoctorDashboard() {
  const { auth } = useServices();
  if (!auth.userDetails) return <></>;
  const user = auth.userDetails;

  return (
    <div className="content-wrapper">
      <div className="py-4 mt-8">
        <div>Welcome back</div>
        <div className="text-2xl font-bold">{user.full_name}</div>
      </div>
    </div>
  );
}
