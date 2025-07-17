import { useEffect, useState } from "react";

import { InputText } from "@components/shared/text";
import { TabSelector } from "@components/shared/tabs";
import { ImageCard } from "@components/shared/card";
import { Table } from "@components/tables";
import { Icon } from "@components/icons/google";

import useUI from "@hooks/useUI";

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
    <div className="flex-1 flex coll w-full h-full">
      <div className="pt-8 flex">
        <div className="mb-4 flex flex-1 aictr gap-3">
          <Icon name="medication" size="3.5em" />
          <div>
            <h2 className="text-2xl font-semibold">System's Medication</h2>
            <div>{count} medicines available</div>
          </div>
        </div>
      </div>

      <div className="pb-4 flex gap-4 aiend">
        <div className="w-full">
          <InputText
            className="flex-1"
            placeholder="Ex: Sertraline, Fluconazole, etc."
            state={[query, setQuery]}
            label={`Showing ${filteredList.length} out of ${medicines.length} items`}
          />
        </div>
        <TabSelector
          tabs={[
            { name: "Grid", icon: "grid_view", value: "grid" },
            { name: "Table", icon: "view_list", value: "table" },
          ]}
          state={displayState}
        />
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
  const { sidePanel } = useUI();
  const { curMedId } = usePageContext();

  const list = meds.sort((a, b) => (a.name > b.name ? 1 : -1));

  function handleViewMedDetails(id: string) {
    return () => sidePanel.open("medication_details", { id });
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
            url={med.image_url || ""}
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
  const { sidePanel } = useUI();
  const { curMedId } = usePageContext();

  function handleViewMedDetails(med: Medicine) {
    sidePanel.open("medication_details", { id: med.id });
  }

  const list = meds.sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <Table
      list={list}
      columns={[
        {
          header: "",
          width: 100,
          render(data) {
            return (
              <div
                style={{
                  backgroundImage: `url('${data.image_url}'), url('${Constant.IMG_PLACEHOLDER}')`,
                }}
                className="rounded-lg bg-cover bg-center h-15"
              ></div>
            );
          },
        },

        {
          header: "",
          render(data) {
            return (
              <div className="flex aictr pr-4">
                <div className="flex-1">
                  <div className="font-bold">{data.name.split("(")[0]}</div>
                  <div className="overflow-ellipsis w-full">
                    {data.supplNames.join(", ")}
                  </div>
                </div>

                <div className="badge badge-primary">
                  {data.dosage || "-"} {data.unit}
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
        className: "h-18",
      })}
      onRowClick={handleViewMedDetails}
      hideHeader
    />
  );
}
