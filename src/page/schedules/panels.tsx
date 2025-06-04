import { InputTextErrorable } from "@components/base/input";
import { TextArea } from "@components/base/textarea";
import { ExternalPanelWrapper } from "@context/ui/extpanel";

export function CreateAppointmentExternalPanel() {
  return (
    <ExternalPanelWrapper id="appt_create_panel">
      <div className="p-4">
        <div className="text-2xl font-semibold mt-8 mb-2">
          Create an appointment
        </div>
        <div className="h-4 border-t-1"></div>

        <InputTextErrorable label="Title" />
        <div className="h-4"></div>

        <TextArea label="Appointment's details" />
        <div className="h-4"></div>

        <InputTextErrorable label="Patient" />
        <InputTextErrorable label="Doctor" />
      </div>
    </ExternalPanelWrapper>
  );
}
