import { Database } from "./db.types";

type DBCol<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

type DBFuncs = keyof Database["public"]["Functions"];

type DBRpcFunc<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T];

type DBEnum<T extends Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

declare global {
  namespace Haivy {
    type User = DBCol<"user_details">;
    type Appointment = DBCol<"appointment">;
    type Ticket = DBCol<"ticket">;
    type TicketInteractions = DBCol<"ticket_interaction_history">;
    type Medicine = DBCol<"medicines">;

    type RPCArgs<T extends DBFuncs> = DBRpcFunc<T>["Args"];
    type RPCReturns<T extends DBFuncs> = DBRpcFunc<T>["Returns"];

    type RPCFunc<T> = DBRpcFunc<T>;
    type RPCFuncRet<T> = DBRpcFunc<T>["Returns"];
    type RPCFuncs = keyof Database["public"]["Functions"];
    type Enum<T> = DBEnum<T>;
  }

  namespace React {
    type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];
    type JSXProps<T extends keyof React.JSX.IntrinsicElements> =
      React.JSX.IntrinsicElements[T];
  }

  interface Stringifiable {
    toString(): string;
  }

  const Constant = {
    IMG_PLACEHOLDER_URL: "https://placehold.co/600x400?text=No+preview+image",
  };
}
