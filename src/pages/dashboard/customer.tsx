// import { useState } from "react";

// import { MedicineRow } from "@components/features/medicine";
// import { SelectOptions } from "@components/shared/select";
// import { Button } from "@components/shared/buttons";
// import { Icon } from "@components/icons/google";

import { useServices } from "@services/index";

export default function CustomerDashboard() {
  const { auth } = useServices();
  if (!auth.userDetails) return <></>;
  const user = auth.userDetails;

  return (
    <div className="content-wrapper flex coll px-4">
      <div className="py-4 mt-8">
        <div>Welcome back</div>
        <div className="text-2xl font-bold">{user.full_name}</div>
      </div>

      {/* <div className="content flex coll flex-1 gap-4">
        <div className="flex gap-8 h-64">
          <NextAppointment />
          <PreviousAppointment />
        </div>
        <div className="flex-1 flex gap-8 pb-4">
          <MedicinePanel />
          <NotificationPanel />
        </div>
      </div> */}
    </div>
  );
}

// function NextAppointment() {
//   return (
//     <div>
//       <div className="flex aictr spbtw">
//         <div className="subhead-text">Upcoming appointments</div>
//         <Button color="primary" size="sm">
//           View all
//         </Button>
//       </div>
//       <div className="flex gap-4">
//         {/* <AppointmentCard />
//         <AppointmentCard /> */}
//       </div>
//     </div>
//   );
// }

// function PreviousAppointment() {
//   return (
//     <div>
//       <div className="flex aictr spbtw">
//         <div className="subhead-text">Past appointments</div>
//         <Button color="primary" size="sm">
//           View all
//         </Button>
//       </div>

//       <div className="flex gap-4">
//         {/* <AppointmentCard />
//         <AppointmentCard /> */}
//       </div>
//     </div>
//   );
// }

// function MedicinePanel() {
//   const timeOfDay = useState("m");

//   return (
//     <div className="flex flex-1 coll gap-4">
//       <div className="flex aictr spbtw">
//         <div className="flex aictr gap-2">
//           <div className="text-4xl">💊</div>
//           <div className="text-xl font-semibold">Today's medicine</div>
//         </div>
//         <SelectOptions
//           options={[
//             { text: "Morning", sub: "7:00 AM", value: "m" },
//             { text: "Afternoon", sub: "1:00 PM", value: "a" },
//             { text: "Evening", sub: "6:00 PM", value: "e" },
//             { text: "Night", sub: "10:00 PM", value: "n" },
//           ]}
//           direction="bottom right"
//           closeOnClick
//           state={timeOfDay}
//         />
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         <MedicineRow />
//         <MedicineRow />
//         <MedicineRow />
//         <MedicineRow />
//         <MedicineRow />
//         <MedicineRow />
//       </div>
//     </div>
//   );
// }

// function NotificationPanel() {
//   return (
//     <div className="flex flex-1 coll">
//       <div className="flex aictr gap-2">
//         <div className="text-3xl">🔔</div>
//         <div className="subhead-text">Notification (0)</div>
//       </div>
//       <Nothing text="You have no new notifcation" />
//     </div>
//   );
// }

// function Nothing({ text }: { text: string }) {
//   return (
//     <div className="card bg-base-200 w-full flex-1">
//       <div className="m-auto flex coll aictr jcctr gap-8">
//         <Icon name="celebration" size="4rem" />
//         <div>{text}</div>
//       </div>
//     </div>
//   );
// }
