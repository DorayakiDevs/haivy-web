import { useRPC } from "./base";

type Ticket = Haivy.Ticket;
type UserInfo = Haivy.User;
type InteractionHistory = Omit<Haivy.TicketInteractions, "by"> &
  {
    by: UserInfo | null;
  }[];

/**
 * Get tickets details + interaction history
 * @param ticketId The ticket id
 * @returns Ticket details
 */
export function useTicketData(ticketId: string) {
  const ticket = useRPC<{
    ticket: Omit<Haivy.Ticket, "created_by"> & { created_by: null | UserInfo };
    interactions: InteractionHistory;
    appointments: Haivy.Appointment[];
  }>("get_ticket_details", { tid: ticketId }, !ticketId);

  return ticket;
}

export function useTickets() {
  const tickets = useRPC<Ticket[]>("get_all_tickets");
  return tickets;
}
