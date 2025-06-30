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
      <div className="flex aictr jcctr h-120 gap-4">
        <div className="p-8 text-[8rem]">🚧</div>

        <div className="text-lg mt-8" style={{ lineHeight: 1.75 }}>
          <div className="text-2xl font-bold mb-4">Page Under Construction</div>
          <div>We're working hard to bring you this feature.</div>
          <div>Please check back soon!</div>
        </div>
      </div>
    </div>
  );
}
