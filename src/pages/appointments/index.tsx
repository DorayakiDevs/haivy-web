import { useServices } from "@services/index";
import DoctorAppointmentsPages from "./doctor";
import FullscreenLoading from "@pages/others/loading";
import PatientAppointmentPages from "./patient";

export default function AppointmentPages() {
  const { auth } = useServices();
  const roles = auth.userDetails?.roles || null;

  if (!roles) {
    return <FullscreenLoading />;
  }

  if (roles.includes("doctor")) {
    return <DoctorAppointmentsPages />;
  }

  return <PatientAppointmentPages />;
}
