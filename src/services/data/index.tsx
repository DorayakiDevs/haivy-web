import { createContext } from "react";

import { HaivyTickets } from "./tickets";
import { SuperClient } from "@services/init";

const tickets = new HaivyTickets(SuperClient);

type T_Provider = {
  tickets: HaivyTickets;
};
export const DataContext = createContext<T_Provider | null>(null);

export function DataProvider(props: React.PropsWithChildren) {
  const value = {
    tickets,
  };

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
}
