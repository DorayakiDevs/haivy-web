import { useEffect, useState } from "react";

import { Frame } from "@pages/appointments/component";

import { useAptDetails } from "../details";
import { useServices } from "@services/index";
import { Loading } from "@components/icons/loading";
import { Icon } from "@components/icons/google";

type T_Data = Haivy.DBRow<"prescriptions">;

export function PatientTestOrderFrame() {
  const { client } = useServices();
  const { apt_id, details } = useAptDetails();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T_Data | null>(null);

  const { patient_id } = details;

  useEffect(() => {
    if (!apt_id || !patient_id) return;
    const c = new AbortController();

    setLoading(true);
    client
      .from("prescriptions")
      .select("*")
      .eq("patient_id", patient_id)
      .eq("status", "completed")
      .order("meeting_date", { ascending: false })
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

  return (
    <Frame className="flex-1">
      <div>Test</div>

      {loading ? (
        <Loading size="xl" className="m-auto" />
      ) : data ? (
        <div className="pt-4"></div>
      ) : (
        <div className="content-ctr flex-1 flex coll gap-4">
          <Icon name="science_off" size="4rem" />
          No test
        </div>
      )}
    </Frame>
  );
}
