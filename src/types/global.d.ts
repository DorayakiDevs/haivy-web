import { Database } from "./db.types";

type DBCol<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

declare global {
  namespace Haivy {
    type User = DBCol<"user_details">;
    type Appointment = DBCol<"appointment">;
    type Ticket = DBCol<"ticket">;
    type TicketInteractions = DBCol<"ticket_interaction_history">;
  }

  namespace React {
    type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
  }
}
