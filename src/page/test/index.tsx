import { getStaffInfo } from "@services/sql/user";

export default function TestPanel() {
  const accounts = getStaffInfo("d98e4545-90d4-41ff-a90b-e2fa2871ed44ss");

  if (accounts.status === "loading") {
    return <div>Loading . . . </div>;
  }

  if (accounts.status === "error") {
    return <div>Error: {JSON.stringify(accounts.results)}</div>;
  }

  return (
    <div className="text-white font-mono whitespace-pre-wrap overflow-auto h-[90vh]">
      {JSON.stringify(accounts.results, null, 2)}
    </div>
  );
}
