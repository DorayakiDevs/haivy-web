import { createContext } from "react";

import type { DatabaseColType } from "@services/global";

import StaffTickets from "./staff";

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
  return <StaffTickets />;
}
