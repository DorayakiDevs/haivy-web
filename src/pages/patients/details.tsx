import { useState } from "react";

import { Icon } from "@components/icons/google";
import { TabSelector } from "@components/shared/tabs";

import { BasicInfo } from "./panels";
import { useParams } from "react-router";

export function CustomerMedicalDetailsPanel() {
  const { id } = useParams();

  const currentTab = useState("o");

  if (!id) {
    return <NotSelected />;
  }

  return (
    <div className="h-full border-2 border-l-8 border-primary rounded-box flex coll p-4 pr-0 gap-2">
      <TabSelector
        type="text"
        tabs={[
          { name: "Overview", icon: "person", value: "o" },
          // { name: "Test results", icon: "experiment", value: "t" },
        ]}
        state={currentTab}
      />

      <div className="flex-1 rounded-box bg-base-100">
        <BasicInfo />

        {/* <div style={{ display: currentTab[0] === "t" ? "" : "none" }}>
          <TestRecord />
        </div> */}
      </div>
    </div>
  );
}

function NotSelected() {
  return (
    <div className="h-full border-1 border-dashed rounded-box content-ctr coll gap-8">
      <Icon name="folder_shared" size="4rem" />
      <div className="font-medium">Select a customer to view their records</div>
    </div>
  );
}
