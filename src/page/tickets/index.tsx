import { createContext } from "react";
import { Helmet } from "react-helmet-async";

import { useClient } from "@services/client";

import { FullscreenLoading } from "@pages/others/loading";
import { NotFoundPage } from "@pages/others/notfound";

import StaffTickets from "./staff";

export const TicketPanelContext = createContext<{
  tickets: Haivy.Ticket[];
  currentId: string;
  setCurrentId(id: string): void;
  reload: () => void;
}>({
  tickets: [],
  currentId: "",
  setCurrentId() {},
  reload() {},
});

export default function TicketsPage() {
  const { account } = useClient();
  if (!account) return <FullscreenLoading />;

  if (!account.roles.includes("staff")) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Helmet>
        <title>Haivy | Tickets</title>
      </Helmet>
      <StaffTickets />
    </>
  );
}
