import { useEffect, useState } from "react";

import { InputText } from "@components/base/input";
import { TabSelector } from "@components/base/tabs";
import { ImageCard } from "@components/base/card";
import { Table } from "@components/table";
import { Icon } from "@components/icons";

import { useUIContext } from "@context/ui";

import { usePageContext, type Medicine } from ".";

const l = (s: string | null) => s?.toLowerCase() || "";

export function MedicationListPanel() {
  const defViewMode = localStorage.getItem("medication-list-mode") || "grid";

  const { medicines } = usePageContext();
  const [query, setQuery] = useState("");

  const displayState = useState(defViewMode);
  const currentView = displayState[0];
  useEffect(() => {
    localStorage.setItem("medication-list-mode", currentView);
  }, [currentView]);

  const count = medicines.length;

  const filteredList = medicines.filter((med) => {
    const { description, name, consumption_note } = med;

    const _q = l(query);

    return (
      l(description).includes(_q) ||
      l(name).includes(_q) ||
      l(consumption_note).includes(_q)
    );
  });

  return (
    <div className="flex-1 flex coll h-full">
      <div className="pt-8">
        <div className="mb-4 flex aictr gap-3">
          <Icon name="medication" size="3.5em" />
          <div>
            <h2 className="text-2xl font-semibold">System's Medication</h2>
            <div>{count} medicines available</div>
          </div>
        </div>
        <div className="pb-4 flex aictr gap-4 aiend">
          <InputText
            className="flex-1"
            placeholder="Ex: Sertraline, Fluconazole, etc."
            state={[query, setQuery]}
            label={`Showing ${filteredList.length} out of ${medicines.length} items`}
          />
          <TabSelector
            list={[
              { name: "Grid", icon: "grid_view", value: "grid" },
              { name: "Table", icon: "view_list", value: "table" },
            ]}
            state={displayState}
          />
        </div>
      </div>

      {currentView === "grid" ? (
        <GridView meds={filteredList} />
      ) : (
        <TableView meds={filteredList} />
      )}
    </div>
  );
}

function GridView({ meds }: { meds: Medicine[] }) {
  const { sidepanel } = useUIContext();
  const { curMedId } = usePageContext();

  const list = meds.sort((a, b) => (a.name > b.name ? 1 : -1));

  function handleViewMedDetails(id: string) {
    return () => sidepanel.open("medication_details", { id });
  }

  return (
    <div
      className="cards-grid overflow-y-auto overflow-x-hidden py-8"
      style={{ "--w": "210px" } as any}
    >
      {list.map((med) => {
        return (
          <ImageCard
            key={med.id}
            url={med.image_url || Constant.IMG_PLACEHOLDER_URL}
            title={med.commercialName}
            content={med.supplNames.join(", ")}
            size="sm"
            onClick={handleViewMedDetails(med.id)}
            className="clickable"
            active={med.id === curMedId}
          />
        );
      })}

      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

function TableView({ meds }: { meds: Medicine[] }) {
  const { sidepanel } = useUIContext();
  const { curMedId } = usePageContext();

  function handleViewMedDetails(med: Medicine) {
    sidepanel.open("medication_details", { id: med.id });
  }

  const list = meds.sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <Table
      list={list}
      columns={[
        {
          header: "",
          width: 140,
          render(data) {
            return (
              <img
                src={data.image_url || Constant.IMG_PLACEHOLDER_URL}
                style={{ height: 80, width: 120, objectFit: "cover" }}
                className="rounded-lg"
              />
            );
          },
        },

        {
          header: "",
          render(data) {
            return (
              <div className="max-w-0">
                <div className="font-bold">{data.name.split("(")[0]}</div>
                <div className="overflow-ellipsis w-full">
                  {data.supplNames.join(", ")}
                </div>
              </div>
            );
          },
        },
      ]}
      tableProps={{
        className: "overflow-y-auto text-sm",
      }}
      rowsProps={(item) => ({
        style:
          item.id === curMedId
            ? {
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-content)",
              }
            : {},
      })}
      onRowClick={handleViewMedDetails}
      hideHeader
    />
  );
}
