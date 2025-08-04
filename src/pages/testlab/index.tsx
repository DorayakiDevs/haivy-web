import { useServices } from "@services/index";
import StaffTestLabPage from "./staff";
import PatientTestLabPages from "./patient";

export default function TestLabPages() {
  const { auth } = useServices();

  const roles = auth.userDetails?.roles || [];

  if (roles.includes("staff") || roles.includes("doctor")) {
    return <StaffTestLabPage />;
  }

  return <PatientTestLabPages />;
}
