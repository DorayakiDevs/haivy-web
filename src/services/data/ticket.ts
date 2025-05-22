import type { DatabaseColType } from "@services/global";

import { useRPC } from "./base";

type Ticket = DatabaseColType<"ticket">;
type History = DatabaseColType<"ticket_interaction_history">;

export function useTicketData(ticketId: string) {
  const ticket = useRPC<{ ticket: Ticket; history: History[] }>(
    "get_ticket_details",
    { tid: ticketId },
    !ticketId
  );

  return ticket;
}
