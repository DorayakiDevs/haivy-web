import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { SlideOverlayPanel } from "@components/overlay/slidepanel";

import CustomTable from "@components/table";
import { Icon } from "@components/icons";

import Badge from "@components/base/badge";
import { ActionCard } from "@components/base/card";
import { Tooltips } from "@components/base/others";

import { useTickets } from "@services/data/ticket";

import { FullscreenLoading } from "@pages/others/loading";

import { formatDate } from "@utils/converter";

import { TicketDetailsPanel } from "./details";
import { TicketPanelContext } from ".";

export default function StaffTickets() {
  const { id: currentId = "" } = useParams();
  const navigate = useNavigate();

  const ticketList = useTickets();

  const [gridView, setGridView] = useState(false);

  if (ticketList.status === "loading" || ticketList.status === "idle") {
    return <FullscreenLoading />;
  }

  if (ticketList.status !== "success") {
    return "Failed to load data";
  }

  const { tickets = [] } = ticketList.data || {};

  function setCurrentId(id: string) {
    if (!id) return navigate("/tickets");
    navigate(`/tickets/${id}`);
  }

  return (
    <TicketPanelContext.Provider value={{ tickets, currentId, setCurrentId }}>
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
                  onClick={() => setGridView(true)}
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
                  onClick={() => setGridView(false)}
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

        <SlideOverlayPanel close={() => setCurrentId("")} isOpen={!!currentId}>
          <TicketDetailsPanel />
        </SlideOverlayPanel>
      </div>
    </TicketPanelContext.Provider>
  );
}

function GridList() {
  const { tickets, setCurrentId } = useContext(TicketPanelContext);

  return (
    <div className="grid grid-cols-4 overflow-y-auto gap-4 place-items-center pb-8">
      {tickets.map((ticket, i) => {
        return (
          <ActionCard
            key={ticket.ticket_id}
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
  const { tickets, setCurrentId } = useContext(TicketPanelContext);

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
