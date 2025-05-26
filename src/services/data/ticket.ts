import type { DatabaseColType } from "@services/global";

import { useRPC } from "./base";

type Ticket = DatabaseColType<"ticket">;
type UserInfo = DatabaseColType<"accountdetails">;
type History = Omit<DatabaseColType<"ticket_interaction_history">, "by"> & {
  by: UserInfo | null;
};
type Appointment = DatabaseColType<"appointment">;

/**
 * Get tickets details + interaction history
 * @param ticketId The ticket id
 * @returns Ticket details
 */
export function useTicketData(ticketId: string) {
  const ticket = useRPC<{
    ticket: Omit<Ticket, "created_by"> & { created_by: null | UserInfo };
    interactions: History[];
    appointments: Appointment[];
  }>("get_ticket_details", { tid: ticketId }, !ticketId);

  return ticket;
}

export function useTickets() {
  const tickets = useRPC<{ tickets: Ticket[] }>("get_all_tickets");
  return tickets;
}
