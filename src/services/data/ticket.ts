import type { DatabaseColType } from "@services/global";

import { useRPC } from "./base";

type Ticket = DatabaseColType<"ticket">;
type History = DatabaseColType<"ticket_interaction_history">;

/**
 * Get tickets details + interaction history
 * @param ticketId The ticket id
 * @returns Ticket details
 */
export function useTicketData(ticketId: string) {
  const ticket = useRPC<{ ticket: Ticket; history: History[] }>(
    "get_ticket_details",
    { tid: ticketId },
    !ticketId
  );

  return ticket;
}

export function useTickets() {
  const tickets = useRPC<{ tickets: Ticket[] }>("get_all_tickets");
  return tickets;
}
