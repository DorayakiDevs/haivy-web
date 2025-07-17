import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";

import { SidePanelWrapper } from "@components/modals/sidepanel";

import { MedicationDetailsPanel } from "./details";
import { MedicationListPanel } from "./list";
import { extractTextInBrackets } from "@utils/parser";
import { useServices } from "@services/index";
import { useMedicinesRealtime } from "./realtime";

export type Medicine = {
  commercialName: string;
  supplNames: string[];
} & Haivy.Medicine;

type T_MedPageCtx = {
  medicines: Medicine[];
  curMedId: string;
  curMed: Medicine | null;
};

const MedicinePageContext = createContext<T_MedPageCtx | null>(null);

export function usePageContext() {
  const d = useContext(MedicinePageContext);
  if (!d) {
    return { medicines: [], curMedId: "", curMed: null };
  }

  return d;
}

export default function MedicationPages() {
  const { client } = useServices();

  const [params] = useSearchParams();
  const curMedId = params.get("id") || "";

  const queryState = useState("");
  const [_loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Haivy.Medicine[]>([]);

  const query = queryState[0];

  useMedicinesRealtime((newMed) => {
    setMedicines((meds) => {
      return meds.map((med) => (med.id === newMed.id ? newMed : med));
    });
  });

  useEffect(() => {
    const c = new AbortController();

    setLoading(true);
    client
      .rpc("query_medicines", { query })
      .abortSignal(c.signal)
      .then(({ error, data }) => {
        if (c.signal.aborted) return;
        if (error) return;

        setMedicines(data as any);
      });

    return () => {
      return c.abort();
    };
  }, [query]);

  const adjusted = medicines.map((med) => {
    return {
      ...med,
      commercialName: med.name.split("(")[0] || med.name,
      supplNames: extractTextInBrackets(med.name)
        .split("/")
        .map((q) => q.trim()),
    };
  });

  const value = {
    curMedId,
    medicines: adjusted,
    curMed: adjusted.find((med) => med.id === curMedId) ?? null,
  };

  return (
    <MedicinePageContext.Provider value={value}>
      <Helmet>
        <title>Haivy | Medication</title>
      </Helmet>
      <div className="content-wrapper flex aictr">
        <MedicationListPanel />
        <SidePanelWrapper
          id="medication_details"
          onClose={(e) => e.clearParams()}
        >
          <MedicationDetailsPanel />
        </SidePanelWrapper>
      </div>
    </MedicinePageContext.Provider>
  );
}
