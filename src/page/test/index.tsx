import { Table } from "@components/table";
import { Users } from "./data";

export default function TestPanel() {
  return (
    <div className="app-wrapper p-8">
      <Table
        list={Users}
        columns={[
          { render: (a) => a.first_name, width: "20%", header: "First name" },
          { render: (a) => a.last_name, width: "30%", header: "Last name" },
          { render: (a) => a.profile_picture, header: "Profile image" },
        ]}
        tableProps={{
          className: "h-full overflow-y-auto",
        }}
      />
    </div>
  );
}
