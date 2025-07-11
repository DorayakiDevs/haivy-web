import { Button } from "@components/shared/buttons";
import { Frame } from "@pages/appointments/component";

export function PatientMedicalInfoFrame() {
  return (
    <Frame className="flex-1">
      <div>Medical information</div>

      <div className="flex-1 content-ctr flex coll gap-3">
        <h3>Patient doesn't have any recorded info</h3>
        <Button className="btn-outline btn-primary">Create record</Button>
      </div>
    </Frame>
  );
}
