import { createContext } from "react";

import StaffTickets from "./staff";
import { Helmet } from "react-helmet-async";

export const TicketPanelContext = createContext<{
  tickets: Haivy.Ticket[];
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
