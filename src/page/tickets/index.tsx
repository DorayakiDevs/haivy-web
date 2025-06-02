import { createContext } from "react";

import type { DatabaseColType } from "@services/global";

import StaffTickets from "./staff";
import { Helmet } from "react-helmet-async";

type Ticket = DatabaseColType<"ticket">;

export const TicketPanelContext = createContext<{
  tickets: Ticket[];
  currentId: string;
  setCurrentId(id: string): void;
}>({
  tickets: [],
  currentId: "",
  setCurrentId() {},
});

export default function TicketsPage() {
  return (
    <>
      <Helmet>
        UNSAFE_componentWillMount
        <title>Haivy | Tickets</title>
      </Helmet>
      <StaffTickets />
    </>
  );
}
