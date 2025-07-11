import { createContext, useContext, useEffect, useState } from "react";

import { MedicineQueryInput } from "@components/features/medicine";
import { Button, IconButton } from "@components/shared/buttons";
import { RegimenCard } from "@components/features/regimen";
import { Loading } from "@components/icons/loading";
import { InputText } from "@components/shared/text";
import { Table } from "@components/tables";

import { useServices } from "@services/index";

import { PatientMedicalInfoFrame } from "./frames/patient_medical_info";
import useUI from "@hooks/useUI";
import { errorToString } from "@utils/converter";
import { useParams } from "react-router";
import { useAptDetails } from "./details";
import useNav from "@hooks/useNav";

const steps = [
  "Start with a regimen (optional)",
  "Modify Medicine List",
  "Confirm Prescription",
];
const BTT_CLSS = "w-40 btn-primary btn-outline ml-4 mb-2";
const BOX_CLSS = "h-full w-full inline-block align-top";

type T_PrescribeMedicine = {
  daily_dosage_schedule: Record<string, number>;
  medicine_id: string;
  name: string;
  consumption_note: string | null;
  unit: string | null;
  dosage: number;
};

type T_Context = {
  medicines: T_PrescribeMedicine[];
  setMedicines: React.State<T_PrescribeMedicine[]>[1];
};

type T_Regimen = Haivy.Regimen & { medicines: T_PrescribeMedicine[] };

const PanelContext = createContext<T_Context | null>(null);

function usePanel() {
  const data = useContext(PanelContext);
  if (!data) {
    throw new Error("Panel context data (Prescription) missing!");
  }

  return data;
}

export default function PrescribeMedicinePanel() {
  const [curStep, setCurStep] = useState(0);
  const [medicines, setMedicines] = useState<T_PrescribeMedicine[]>([]);

  function prev() {
    setCurStep((a) => a - 1);
  }

  function next() {
    setCurStep((a) => a + 1);
  }

  const value = {
    medicines,
    setMedicines,
  };

  return (
    <PanelContext.Provider value={value}>
      <div className="content-wrapper overflow-hidden px-8 flex coll gap-2">
        <div className="py-4 mt-4 flex aiend spbtw">
          <div>
            <div className="text-lg mb-2">Add a prescription</div>
            <div className="text-3xl font-medium">{steps[curStep]}</div>
          </div>
          <ul className="steps w-1/2">
            {steps.map((_, i) => {
              let clss = "step";
              if (curStep >= i) clss += " step-primary";

              return <li className={clss} key={i}></li>;
            })}
          </ul>
        </div>
        <div
          className="flex-1 whitespace-nowrap"
          style={{
            transform: `translateX(-${100 * curStep}%)`,
            transition: "transform 0.2s",
          }}
        >
          {[<StepRegimen />, <StepModify />, <StepConfirm />].map((c, i) => (
            <div
              className={BOX_CLSS}
              style={{
                opacity: i === curStep ? 1 : 0,
                transition: "opacity 0.3s",
              }}
              key={i}
            >
              {c}
            </div>
          ))}
        </div>
        <div className="flex jcend my-2">
          {curStep < 1 || (
            <Button className={BTT_CLSS} onClick={prev}>
              Previous
            </Button>
          )}
          {curStep > 1 || (
            <Button className={BTT_CLSS} onClick={next}>
              Next
            </Button>
          )}
        </div>
      </div>
    </PanelContext.Provider>
  );
}

function StepRegimen() {
  const { setMedicines } = usePanel();
  const { client } = useServices();

  const [activeRegiID, setActiveRegiID] = useState("");
  const query = useState("");

  const [data, setData] = useState<T_Regimen[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    client
      .from("regimens")
      .select("*, medicines:regimen_details(*, ...medicines(*))")
      .abortSignal(controller.signal)
      .then(({ data }) => {
        if (data) {
          setData(data as any);
        }

        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  function handleSetRegi(r: T_Regimen | null) {
    return () => {
      setActiveRegiID(r?.regimen_id ?? "");
      setMedicines(JSON.parse(JSON.stringify(r?.medicines || [])));
    };
  }

  const selected = data.find((r) => r.regimen_id === activeRegiID);

  return (
    <div className="h-full w-full inline-flex fade-in gap-4">
      <div className="flex-4 flex coll">
        {selected ? (
          <>
            <div className="relative">
              <IconButton
                icon="close"
                className="absolute bottom-6 right-4"
                onClick={handleSetRegi(null)}
              />
              <RegimenCard
                medsCount={selected.medicines.length}
                style={{ zoom: 0.85 }}
                data={selected}
              />
            </div>
            <Table
              tableProps={{ className: "flex-1" }}
              list={selected.medicines}
              columns={[
                {
                  header: "#",
                  width: 60,
                  className: "tactr",
                  render: (_, i) => i + 1,
                },
                {
                  header: "Medicine",
                  render: (t) => (
                    <div className="w-full overflow-hidden overflow-ellipsis">
                      <div>{t.name}</div>
                      <div className="text-xs">{t.consumption_note}</div>
                    </div>
                  ),
                },
              ]}
            />
          </>
        ) : (
          <p className="content-ctr h-full border-dashed border-1 rounded-box">
            Select a regiman to view it's medicine
          </p>
        )}
      </div>
      <div className="flex-3 h-full overflow-y-auto">
        <div className="sticky top-0 px-1 mb-2 z-2">
          <InputText
            state={query}
            icon="search"
            placeholder="Search for regimens . . "
          />
        </div>
        {loading ? (
          <div className="w-full h-full content-ctr">
            <Loading size="xl" />
          </div>
        ) : (
          <div>
            {data.map((r) => {
              return (
                <RegimenCard
                  data={r}
                  medsCount={r.medicines.length}
                  key={r.regimen_id}
                  active={r.regimen_id === activeRegiID}
                  onClick={handleSetRegi(r)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StepModify() {
  const { toaster } = useUI();
  const { medicines, setMedicines } = usePanel();

  const [addition, setAddition] = useState<Haivy.Medicine | null>(null);

  function add() {
    if (!addition) {
      toaster.error("Please select a medicine first");
      return;
    }

    const list = medicines.map((q) => q.medicine_id);
    const index = list.indexOf(addition.id);

    if (index >= 0) {
      toaster.error(`Medicine already in the list (At #${index + 1})`);
      return;
    }

    setMedicines((l) => {
      const list = [...l];

      list.push({
        ...addition,
        medicine_id: addition.id,
        daily_dosage_schedule: { morning: 1, afternoon: 1 },
      });

      setAddition(null);

      return list;
    });
  }

  return (
    <div className="w-full h-full flex coll gap-4">
      <div className="flex gap-4 aiend z-2">
        <div className="flex-1">
          <MedicineQueryInput state={[addition, setAddition]} />
        </div>
        <Button color="primary" onClick={add}>
          Add medicine
        </Button>
      </div>
      <MedicationTable medicines={medicines} />
    </div>
  );
}

function StepConfirm() {
  const nav = useNav();
  const { client } = useServices();
  const { medicines } = usePanel();
  const { toaster } = useUI();
  const { id: appointment_id } = useParams();
  const { reload } = useAptDetails();

  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!appointment_id) return;

    setLoading(true);

    const { error: create_err, data } = await client
      .from("prescriptions")
      .insert({ appointment_id })
      .select();

    if (create_err) {
      toaster.error(errorToString(create_err));
      setLoading(false);
      return;
    }

    const prescription_id = data[0]?.prescription_id;

    if (!prescription_id) {
      toaster.error("Failed to create prescription, please contact a staff!");
      setLoading(false);

      return;
    }

    const list = medicines.map(({ medicine_id, daily_dosage_schedule }) => {
      return {
        medicine_id,
        daily_dosage_schedule,
        total_day: 5,
        prescription_id: prescription_id,
      };
    });

    const { error: insert_err } = await client
      .from("prescription_details")
      .insert(list);

    if (insert_err) {
      toaster.error(errorToString(insert_err));
      setLoading(false);

      return;
    }

    toaster.success("Prescription assigned!");
    setLoading(false);

    reload();
    nav("/appointments/" + appointment_id);
  }

  return (
    <div className="w-full h-full flex aictr gap-4">
      <div className="flex flex-4 h-full">
        <PatientMedicalInfoFrame />
      </div>
      <div className="flex-7 h-full flex coll">
        <MedicationTable medicines={medicines} readonly />
        <div className="flex jcend">
          <Button
            className={"btn btn-success w-40"}
            loading={loading}
            onClick={confirm}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

function MedicationTable({
  medicines,
  readonly,
}: {
  medicines: T_PrescribeMedicine[];
  readonly?: boolean;
}) {
  return (
    <Table
      tableProps={{ className: "flex-1 overflow-scroll-y h-full" }}
      list={medicines}
      columns={[
        {
          header: "#",
          width: 50,
          className: "tactr",
          render: (_, i) => i + 1,
        },
        {
          header: "Medicine",
          render: (m) => {
            const placeholder = m.consumption_note || "";
            const id = "note-" + m.medicine_id;

            return (
              <div className="w-full overflow-hidden overflow-ellipsis">
                <div className="text-md">{m.name}</div>
                <div className="py-2">
                  {readonly ? (
                    <div className=" whitespace-pre-line text-sm text-gray-600">
                      Note: {placeholder}
                    </div>
                  ) : (
                    <input
                      placeholder={"Consumption note . . ."}
                      list={id}
                      defaultValue={placeholder}
                      className="input w-full input-sm"
                      onInput={(e: any) =>
                        (m.consumption_note = e.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            );
          },
        },

        {
          className: "tactr",
          width: 300,
          header: "Amount per day",
          render: (m) => {
            return (
              <AmountScheduleEditor
                schedule={m.daily_dosage_schedule}
                readonly={readonly}
              />
            );
          },
        },

        {
          width: 120,
          className: "tactr",
          header: "Total",
          render: ({ daily_dosage_schedule: schedule }) => {
            const total = Object.values(schedule).reduce((s, a) => s + a, 0);
            return total;
          },
        },
      ]}
    />
  );
}

function AmountScheduleEditor({
  schedule,
  readonly,
}: {
  schedule: Record<string, number>;
  readonly?: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  // const TOD_BADGE_CLSS = "rounded-md badge-primary p-3 capitalize";

  function enableEdit() {
    if (readonly) return;
    setEditMode(true);
  }

  function save() {
    setEditMode(false);

    for (const t in schedule) {
      if (schedule[t] < 1) delete schedule[t];
    }
  }

  const validTime = ["morning", "noon", "afternoon", "evening", "night"];

  if (!editMode || readonly) {
    return (
      <button
        className="capitalize tactr w-full btn btn-ghost py-8 whitespace-pre-line"
        style={{ pointerEvents: readonly ? "none" : "auto" }}
        onClick={enableEdit}
      >
        {Object.keys(schedule)
          .map((b) => {
            return `${b}: ${schedule[b]}`;
          })
          .join(", ")}
      </button>
    );
  }

  return (
    <div className="px-10 flex coll gap-2">
      {validTime.map((t) => {
        const v = schedule[t] || 0;

        return (
          <div
            className="flex aictr spbtw focus-within:opacity-100! hover:opacity-100!"
            style={{ opacity: v > 0 ? 1 : 0.3 }}
          >
            <div className="capitalize">{t}</div>
            <input
              className="input input-sm w-16"
              type="number"
              defaultValue={v}
              min={0}
              max={32}
              onInput={(e: any) => (schedule[t] = Math.max(0, e.target.value))}
            />
          </div>
        );
      })}
      <Button className="btn-outline btn-primary btn-sm" onClick={save}>
        Close
      </Button>
    </div>
  );
}
