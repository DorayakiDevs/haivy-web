import { useEffect, useState } from "react";

import { Frame } from "@pages/appointments/component";

import { useAptDetails } from "../hooks/useAppointmentDetails";
import { useServices } from "@services/index";
import { Loading } from "@components/icons/loading";
import { Icon } from "@components/icons/google";
import { Button } from "@components/shared/buttons";
import { Link } from "react-router";

type T_Data = {
  appointment_id: string;
  created_at: string;
  prescription_id: number;
  related_regimen: string | null;
  medicines: {
    daily_dosage_schedule: any;
    consumption_note: string | null;
    description: string | null;
    dosage: number;
    id: string;
    image_url: string | null;
    is_available: boolean;
    name: string;
    unit: string | null;
  }[];
};

export function PatientPrescriptionFrame() {
  const { client, auth } = useServices();
  const { apt_id, details } = useAptDetails();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T_Data | null>(null);

  const { patient_id } = details!;

  useEffect(() => {
    if (!apt_id || !patient_id) return;
    const c = new AbortController();

    setLoading(true);
    client
      .from("prescriptions")
      .select(
        "*, medicines:prescription_details(daily_dosage_schedule, ...medicines(*))"
      )
      .eq("appointment_id", apt_id)
      .order("created_at", { ascending: false })
      .abortSignal(c.signal)
      .then(({ data, error }) => {
        if (error) {
          setData(null);
        } else {
          setData(data[0]);
        }

        setLoading(false);
      });

    return () => {
      c.abort();
    };
  }, [apt_id, patient_id]);

  const roles = auth.userDetails?.roles || [];
  const isDoctor = roles.includes("doctor");

  return (
    <Frame className="flex-1">
      <div className="flex spbtw">
        Prescription
        <div>{data?.medicines.length || 0} prescribed</div>
      </div>

      {loading ? (
        <Loading size="xl" className="m-auto" />
      ) : data ? (
        <div className="pt-4 overflow-y-auto">
          {data.medicines.map((med) => {
            return (
              <div className="py-2">
                <div className="font-medium">{med.name}</div>
                <div className="capitalize text-sm">
                  {getString(med.daily_dosage_schedule)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="content-ctr coll gap-8 m-auto">
          <Icon name="pill_off" size="3rem" />
          Not prescribed
          {!isDoctor || (
            <Link to={`/appointments/${apt_id}/prescribe`}>
              <Button color="primary">Add prescription</Button>
            </Link>
          )}
        </div>
      )}
    </Frame>
  );
}

const getString = (sche: any) => {
  return Object.keys(sche)
    .map((b) => {
      return `${b}: ${sche[b]}`;
    })
    .join(", ");
};
