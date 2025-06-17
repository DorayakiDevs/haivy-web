import { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";

import { SidePanelWrapper } from "@context/ui/sidepanel";

import { getMedicines } from "@services/rpc/medicine";

import { FullscreenLoading } from "@pages/others/loading";

import { getTextFromBrackets } from "@utils/parser";

import { MedicationDetailsPanel } from "./details";
import { MedicationListPanel } from "./list";

export type Medicine = {
  commercialName: string;
  supplNames: string[];
} & Haivy.Medicine;

type T_MedPageCtx = {
  medicines: Medicine[];
  curMedId: string;
};

const MedicinePageContext = createContext<T_MedPageCtx | null>(null);

export function usePageContext() {
  const d = useContext(MedicinePageContext);
  if (!d) {
    return { medicines: [], curMedId: "" };
  }

  return d;
}

export default function MedicationPanel() {
  const [params] = useSearchParams();
  const curMedId = params.get("id") || "";

  const queryState = useState("");
  const medicines = getMedicines(queryState[0]);

  if (medicines.status !== "success") {
    return <FullscreenLoading />;
  }

  const value = {
    medicines: medicines.data.map((med) => {
      return {
        ...med,
        commercialName: med.name.split("(")[0] || med.name,
        supplNames: getTextFromBrackets(med.name)
          .split("/")
          .map((q) => q.trim()),
      };
    }),
    curMedId,
  };

  return (
    <MedicinePageContext.Provider value={value}>
      <Helmet>
        <title>Haivy | Medicine</title>
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
