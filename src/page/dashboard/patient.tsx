import CustomTable from "@components/table";
import { Tooltips } from "@components/base/others";

import { useClient } from "@services/client";

export function PatientDashboard() {
  const { session, account } = useClient();

  if (!account || !session) return null;

  const displayName = account.full_name.trim();
  const authAccount = session?.user.email || "+" + session?.user.phone;

  return (
    <div className="h-full py-4 key-fade-in">
      <div className="py-6 flex aictr spbtw">
        <div>
          <div>Welcome back</div>
          <div className="text-4xl font-bold">
            {displayName.includes("null") ? "Have a great day" : displayName}
          </div>
          <div>Signed in as: {authAccount}</div>
        </div>
      </div>

      <div className="flex column-something-something gap-12">
        <div className="h-full flex-1">
          <div className="text-2xl font-bold my-3">Medicine information</div>

          <CustomTable
            cols={[
              {
                header: (
                  <div className="flex aictr gap-2">
                    <div className="text-2xl">💊</div>
                    <div className="text-sm">
                      <div>Medicine</div>
                      <div>
                        From:{" "}
                        <a className="link link-hover font-bold">
                          Regular monthly checkup 6
                        </a>
                      </div>
                    </div>
                  </div>
                ),
                render: (a) => (
                  <div>
                    <div>{a.name}</div>
                    <sub>{a.note}</sub>
                  </div>
                ),
                width: "calc(100% - 300px)",
              },

              {
                header: <Tooltips text="Morning">☀️</Tooltips>,
                width: 80,
                className: "flex coll aictr",
                render: () => <div className="checkbox"></div>,
              },
              {
                header: <Tooltips text="Noon">🌤️</Tooltips>,
                width: 80,
                className: "flex coll aictr",
                render: () => <div className="checkbox"></div>,
              },
              {
                header: <Tooltips text="Afternoon">🌇</Tooltips>,
                width: 80,
                className: "flex coll aictr",
                render: () => <div className="checkbox"></div>,
              },
              {
                header: <Tooltips text="Evening">🌙</Tooltips>,
                width: 80,
                className: "flex coll aictr",
                render: () => <div className="checkbox"></div>,
              },
            ]}
            arr={[
              {
                name: "Paracetamol",
                dosage: "500mg",
                time: "morning",
                note: "Take after breakfast",
              },
              {
                name: "Atorvastatin",
                dosage: "10mg",
                time: "noon",
                note: "Helps lower cholesterol",
              },
              {
                name: "Metformin",
                dosage: "850mg",
                time: "afternoon",
                note: "Take with a light snack",
              },
              {
                name: "Amlodipine",
                dosage: "5mg",
                time: "evening",
                note: "For blood pressure",
              },
            ]}
            rowClassName={() => "text-sm"}
          />
        </div>

        <div className="h-full">
          <div className="text-2xl font-bold my-3">Your appointments</div>

          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="h-60">{/* <AppointmentCard /> */}</div>
            <div className="h-60">{/* <AppointmentCard /> */}</div>
            <div className="h-60">{/* <AppointmentCard /> */}</div>
            <div className="h-60">{/* <AppointmentCard /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
