import { createContext, useContext, useEffect, useState } from "react";

import Badge from "@components/base/badge";
import CustomTable from "@components/table";
import { ActionCard } from "@components/base/card";
import { Icon } from "@components/icons";

import type { Database } from "db.types";

import { formatDate } from "@utils/converter";
import { useClient } from "services/client";
import { Tooltips } from "@components/base/others";
import { useTicketData } from "@services/data/ticket";

type Ticket = Database["public"]["Tables"]["ticket"]["Row"];

type T_TicketContext = {
  tickets: Ticket[];
  currentId: string;
  setCurrentId: React.Dispatch<React.SetStateAction<string>>;
};

const TicketContext = createContext<T_TicketContext>({
  tickets: [],
  currentId: "",
  setCurrentId: () => {},
});

export default function StaffTickets() {
  const { supabase: client } = useClient();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentId, setCurrentId] = useState("");

  const [gridView, setGirdView] = useState(false);

  useEffect(() => {
    const request = { valid: true };

    async function fetch() {
      const tickets = await client
        .from("ticket")
        .select()
        .overrideTypes<Ticket[]>();
      if (!request.valid || !tickets.data) return;

      setTickets(tickets.data);
    }

    fetch();

    return () => {
      request.valid = false;
    };
  }, [client]);

  return (
    <TicketContext.Provider value={{ tickets, currentId, setCurrentId }}>
      <div className="h-full flex coll key-fade-in">
        <div className="pb-4 pt-8 flex aictr gap-3">
          <Icon name="article" size="3em" />
          <div>
            <div className="text-4xl font-bold">Tickets</div>
            <div className="">{tickets.length} tickets</div>
          </div>

          <div className="control flex-1 flex jcend">
            <div className="flex aictr gap-2">
              <Tooltips text="Grid View">
                <button
                  className={
                    "btn-primary btn btn-square btn-lg " +
                    (gridView ? "" : "btn-outline")
                  }
                  onClick={() => setGirdView(true)}
                >
                  <Icon name="grid_view" size="1.5em" />
                </button>
              </Tooltips>
              <Tooltips text="Table View">
                <button
                  className={
                    "btn-primary btn btn-square btn-lg " +
                    (gridView ? "btn-outline" : "")
                  }
                  onClick={() => setGirdView(false)}
                >
                  <Icon name="view_list" size="1.5em" />
                </button>
              </Tooltips>
            </div>
          </div>
        </div>

        {tickets.length ? (
          gridView ? (
            <GridList />
          ) : (
            <TableList />
          )
        ) : (
          <AllCaughtUp />
        )}

        <TicketDetailsPanel />
      </div>
    </TicketContext.Provider>
  );
}

function TicketDetailsPanel() {
  const { currentId, tickets, setCurrentId } = useContext(TicketContext);
  const data = useTicketData(currentId);

  const ticket = tickets.filter((a) => a.ticket_id === currentId)[0];

  if (!ticket) {
    return (
      <div
        className="fixed h-full w-full z-7 top-0 right-0 key-fade-out"
        style={{ backgroundColor: "#0004", pointerEvents: "none" }}
      ></div>
    );
  }

  const history = [];

  if (data.status === "success") {
    history.push(...data.data.history);
  }

  const { title, content, created_by, date_created } = ticket;

  return (
    <div
      className="fixed h-full w-full z-7 top-0 right-0 flex jcend key-fade-in"
      style={{ backgroundColor: "#0004" }}
      onClick={() => setCurrentId("")}
    >
      <div
        className="w-1/2 h-full bg-base-100 rounded-md p-4 pt-16 text-sm key-slide-right-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="my-8">
          <div>Resolve tickets</div>
          <div className="text-4xl font-bold">{title}</div>
        </div>
        <div className="content border-1 rounded-lg overflow-hidden">
          <div className="bg-primary px-4 py-3 text-primary-content flex aictr spbtw">
            <div className="flex aictr gap-1">
              <Icon name="terminal" size="1.5em" />
              {created_by || "System"}
            </div>
            <div>{date_created}</div>
          </div>
          <div className="p-4 whitespace-pre-line">{content}</div>
        </div>
        {history.map((h) => {
          return (
            <>
              <div className="border-l-3 h-8 mx-8"></div>

              <div className="content border-1 rounded-lg overflow-hidden">
                <div className="bg-primary px-4 py-3 text-primary-content flex aictr spbtw">
                  <div className="flex aictr gap-1">
                    <Icon name="terminal" size="1.5em" />
                    {"Update"}
                  </div>
                  <div>{date_created}</div>
                </div>
                <div className="p-4 whitespace-pre-line">{h.note}</div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

function GridList() {
  const { tickets, setCurrentId } = useContext(TicketContext);

  return (
    <div className="grid grid-cols-4 overflow-y-auto gap-4 place-items-center pb-8">
      {tickets.map((ticket, i) => {
        return (
          <ActionCard
            key={i}
            subtitle={formatDate(ticket.date_created)}
            subIcon="confirmation_number"
            tag={
              <Badge className="capitalize badge-primary">
                {ticket.ticket_type}
              </Badge>
            }
            content={ticket.content || ""}
            title={ticket.title || "No title"}
            actions={[
              {
                title: "Resolve",
                onClick: () => setCurrentId(ticket.ticket_id),
              },
              { title: "Dissmiss" },
            ]}
            className="no-animated h-full key-fade-in"
            style={{ animationDuration: 0.2 * i + "s" }}
            onDoubleClick={() => setCurrentId(ticket.ticket_id)}
          />
        );
      })}
    </div>
  );
}

function TableList() {
  const { tickets, setCurrentId } = useContext(TicketContext);

  return (
    <CustomTable
      cols={[
        {
          className: "jcctr",
          header: <div className="pr-2">#</div>,
          render(_, i) {
            return <div className="pr-2">{i + 1}</div>;
          },
          width: 60,
        },
        {
          header: "Request",
          width: "calc(60%)",
          render(a) {
            return (
              <div>
                <div className="font-bold">{a.title}</div>
                <div>┗ {a.content} </div>
              </div>
            );
          },
        },

        {
          header: "Type",
          width: "calc(40% - 300px)",
          render(a) {
            return (
              <Badge className="badge-secondary capitalize">
                {a.ticket_type}
              </Badge>
            );
          },
        },

        {
          header: "",
          width: 200,
          render(a) {
            return <div>{formatDate(a.date_created)}</div>;
          },
        },

        {
          render(a) {
            return (
              <button
                className="btn"
                onClick={() => {
                  setCurrentId(a.ticket_id);
                }}
              >
                Resolve
              </button>
            );
          },

          header: "Action",
          className: "jcctr",
          width: 100,
        },
      ]}
      arr={tickets}
      rowClassName={() => "text-sm key-fade-in"}
      rowStyle={(_, i) => ({ animationDuration: i * 0.2 + "s" })}
      top={0}
      rowHeight={70}
      className="h-full overscroll-y-auto"
      children={<div className="text-sm tactr mt-4">End of the list</div>}
      onRowDoubleClick={(ticket) => setCurrentId(ticket.ticket_id)}
    />
  );
}

function AllCaughtUp() {
  return (
    <div className="flex aictr jcctr h-full coll gap-8">
      <div className="flex aictr jcctr gap-8">
        <Icon name="celebration" size="8rem" />
        <div className="h-8 border-1"></div>
        <div>
          <h1 className="text-4xl font-bold">
            Nice job! You are all caught up
          </h1>
          <div>Go grab a coffee or some snacks... cause you deserve it</div>
        </div>
      </div>
      <div className="mb-22">
        <button className="btn bg-gradient-to-r from-pink-200 to-secondary btn-lg via-yellow-100">
          Celebrate!
        </button>
      </div>
    </div>
  );
}
