import { createContext, useContext, useEffect, useState } from "react";

import { SelectOptions } from "@components/shared/select";
import { TabSelector } from "@components/shared/tabs";
import { Button } from "@components/shared/buttons";
import { Icon } from "@components/icons/google";

import { useServices } from "@services/index";

import useUI from "@hooks/useUI";
import useNav from "@hooks/useNav";

import { StatusColor } from "@utils/data";

import { GridDisplay, KanbanDisplay, TableDisplay } from "./layouts";
import { TicketCreationPanel } from "./create";
import { Helmet } from "react-helmet-async";
import { InputText } from "@components/shared/text";

export type T_Ticket = Haivy.Table<"ticket">["Row"];

type T_PanelContext = {
  tickets: T_Ticket[];
  filtered: T_Ticket[];
  loading: boolean;
  openDetails(ticket: T_Ticket): void;
  closeDetails(): void;
};

const TicketPanelContext = createContext<T_PanelContext | null>(null);

export function useTicketPanel() {
  const data = useContext(TicketPanelContext);
  if (!data) throw new Error("Ticket context missing");

  return data;
}

export default function StaffTickets() {
  const nav = useNav();
  const { sidePanel } = useUI();
  const { data } = useServices();

  const [tickets, setTickets] = useState<T_Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const query = useState("");

  const [reloadSig, toggleReload] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);

      const tickets = data.tickets.getTickets(controller.signal);

      try {
        const data = (await tickets).data;
        setTickets(data || []);
      } catch {
        setTickets([]);
      }

      setLoading(false);
    }

    load();

    return () => {
      controller.abort();
      setLoading(false);
    };
  }, [reloadSig]);

  const statusFilter = useState("p");
  const viewType = useState("t");

  function toggleCreatePanel() {
    sidePanel.open("create_ticket");
  }

  function openDetails(ticket: T_Ticket) {
    nav(`/tickets/${ticket.ticket_id}`);
  }

  function closeDetails() {
    nav("/tickets");
  }

  function reload() {
    toggleReload({});
  }

  const filtered = tickets.filter((ticket) => {
    const q = query[0].toLowerCase();
    const s = [ticket.content || "No description provided", ticket.title]
      .join(" ")
      .toLowerCase();

    return s.includes(q) && ticket.status.startsWith(statusFilter[0]);
  });

  const value = {
    tickets,
    filtered,
    loading,
    openDetails,
    closeDetails,
  };

  return (
    <TicketPanelContext.Provider value={value}>
      <Helmet>
        <title>Haivy | Tickets</title>
      </Helmet>
      <div className="content-wrapper flex">
        <div className="pr-8 flex coll flex-1">
          <div className="py-4 mt-4 flex aictr gap-4">
            <Icon name="confirmation_number" size="3rem" />
            <div>
              <div className="head-text">System's tickets</div>
              {viewType[0] === "k" ? (
                <div>Showing {tickets.length} tickets</div>
              ) : (
                <div>
                  Showing {filtered.length} out of {tickets.length} tickets
                </div>
              )}
            </div>

            <div className="flex-1"></div>

            <InputText placeholder="Search for tickets . . ." state={query} />

            {viewType[0] === "k" || (
              <SelectOptions
                options={[
                  {
                    text: (
                      <div className="flex aictr gap-2">
                        <Icon name="list" />
                        All tickets
                      </div>
                    ),
                    value: "",
                  },
                  {
                    text: (
                      <div className="flex aictr gap-2">
                        <Icon name="pending" />
                        Pending
                      </div>
                    ),
                    value: "p",
                  },
                  {
                    text: (
                      <div className="flex aictr gap-2">
                        <Icon
                          name="check_circle"
                          color={StatusColor["approved"]}
                        />
                        Approved
                      </div>
                    ),
                    value: "a",
                  },
                  {
                    text: (
                      <div className="flex aictr gap-2">
                        <Icon name="cancel" color={StatusColor["cancelled"]} />
                        Cancelled
                      </div>
                    ),
                    value: "c",
                  },
                ]}
                state={statusFilter}
                direction="bottom right"
                closeOnClick
              />
            )}
            <TabSelector
              tabs={[
                { name: "Grid view", value: "g", icon: "view_module" },
                { name: "Table view", value: "t", icon: "splitscreen" },
                { name: "Kanban view", value: "k", icon: "view_kanban" },
              ]}
              state={viewType}
            />

            <Button onClick={reload} color="primary" className="btn-outline">
              <Icon name="replay" />
            </Button>

            <Button
              color="primary"
              className="btn-outline"
              onClick={toggleCreatePanel}
            >
              <Icon name="add" />
              Create
            </Button>
          </div>

          <div key={viewType[0] + statusFilter[0]} className="w-full flex-1">
            {(() => {
              switch (viewType[0]) {
                case "g":
                  return <GridDisplay />;

                case "k":
                  return <KanbanDisplay />;

                default:
                case "t":
                  return <TableDisplay />;
              }
            })()}
          </div>
        </div>

        <TicketCreationPanel />
      </div>
    </TicketPanelContext.Provider>
  );
}
