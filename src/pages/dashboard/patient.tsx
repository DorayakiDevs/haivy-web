import { isSameDay } from "date-fns";
import { useState } from "react";

import { MedicineRow } from "@components/features/medicine";
import { SelectOptions } from "@components/shared/select";
import { DatePicker } from "@components/shared/date";
import { Icon } from "@components/icons/google";

import FullscreenLoading from "@pages/others/loading";
import ErrorHandlerPage from "@pages/others/error";

import { useServices } from "@services";

import { useRPC } from "@hooks/useRPC";
import { capitalize } from "@utils/converter";

export function PatientDashboard() {
  const { auth } = useServices();
  const { userDetails: account, session } = auth;

  if (!account || !session) return null;

  const displayName = account.full_name.trim();
  const authAccount = session?.user.email || "+" + session?.user.phone;

  return (
    <div className="content-wrapper flex coll py-4 key-fade-in">
      <div className="py-6 flex aictr spbtw">
        <div>
          <div>Welcome back</div>
          <div className="text-4xl font-bold">
            {displayName.includes("null") ? "Have a great day" : displayName}
          </div>
          <div>Signed in as: {authAccount}</div>
        </div>
      </div>

      <div className="flex w-full gap-8 flex-1">
        <MedicinePanel />
      </div>
    </div>
  );
}

function MedicinePanel() {
  const timeOfDay = useState("morning");
  const curDate = useState(new Date());

  const fetcher = useRPC("get_medication_schedule_for_authenticated_user");

  if (fetcher.status === "loading" || fetcher.status === "idle") {
    return <FullscreenLoading />;
  }

  if (fetcher.status === "error") {
    return <ErrorHandlerPage error={fetcher.error} />;
  }

  const { data } = fetcher;

  const meds = data.filter((med) => {
    return isSameDay(med.date, curDate[0]);
  });

  const timeOfDayMeds = meds.filter(
    (med) => timeOfDay[0] === "all" || med.take_at === timeOfDay[0]
  );

  return (
    <div className="w-4/7 h-full flex coll rounded-box p-4 pr-2 bg-black/1 shadow-md">
      <div className="flex aictr spbtw py-4">
        <div className="flex aictr gap-2">
          <div className="text-3xl">💊</div>
          <div>
            <div className="text-lg font-semibold">Medicine to take</div>
            <div className="text-sm">
              Showing {timeOfDayMeds.length} out of {meds.length} medicines
            </div>
          </div>
        </div>
        <div className="flex aictr gap-2">
          <DatePicker dateOnly hideFormatHint state={curDate} />

          <SelectOptions
            options={getMedCount(meds).map((k) => {
              return {
                text: `${capitalize(k.name)}`,
                value: k.name,
                sub: `${k.list.length} medicines`,
              };
            })}
            direction="bottom right"
            closeOnClick
            state={timeOfDay}
          />
        </div>
      </div>
      {timeOfDayMeds.length ? (
        <div
          className="flex-1 overflow-y-auto fade-in"
          key={timeOfDay[0] + curDate[0].toISOString()}
        >
          {timeOfDayMeds.map((d) => (
            <MedicineRow data={d} />
          ))}
        </div>
      ) : (
        <div
          className="flex-1 flex coll aictr jcctr gap-16"
          key={timeOfDay[0] + curDate[0].toISOString()}
        >
          <div className="mt-8"></div>
          <Icon name="celebration" size="4rem" />
          You have no medicines to take at {timeOfDay[0]}
        </div>
      )}
    </div>
  );
}

type T_List = { take_at: any }[];

function getMedCount(list: T_List) {
  const obj: Record<string, { list: T_List; name: string }> = {
    all: { list: list, name: "all" },
    morning: { list: [], name: "morning" },
    noon: { list: [], name: "noon" },
    afternoon: { list: [], name: "afternoon" },
    evening: { list: [], name: "evening" },
    night: { list: [], name: "night" },
  };

  for (const med of list) {
    obj[med.take_at].list.push(med);
  }

  return Object.values(obj);
}
