import { createContext, useContext, useState } from "react";

import CustomTable from "@components/table";
import MDEditor from "@components/mdeditor";
import Badge from "@components/base/badge";

import { SlideOverlayPanel } from "@components/overlay/slidepanel";
import { ActionCard } from "@components/base/card";
import { Tooltips } from "@components/base/others";
import { Icon } from "@components/icons";

import { useTicketData, useTickets } from "@services/data/ticket";
import type { DatabaseColType } from "@services/global";

import {
  FullscreenLoading,
  LoadingSkeletonParagraph,
} from "@pages/others/loading";

import { useUIContext } from "@context/ui";

import { copyTextToClipboard } from "@utils/clipboard";
import { formatDate } from "@utils/converter";
import { repeat } from "@utils/generator";

type Ticket = DatabaseColType<"ticket">;

const TicketPanelContext = createContext<{
  tickets: Ticket[];
  currentId: string;
  setCurrentId(id: string): void;
}>({
  tickets: [],
  currentId: "",
  setCurrentId() {},
});

export default function StaffTickets() {
  const ticketList = useTickets();

  const [currentId, setCurrentId] = useState("");
  const [gridView, setGirdView] = useState(false);

  if (ticketList.status === "loading" || ticketList.status === "idle") {
    return <FullscreenLoading />;
  }

  if (ticketList.status !== "success") {
    return "Failed to load data";
  }

  const { tickets = [] } = ticketList.data || {};

  return (
    <TicketPanelContext.Provider value={{ tickets, setCurrentId, currentId }}>
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

        <SlideOverlayPanel isOpen={!!currentId} close={() => setCurrentId("")}>
          <TicketDetailsPanel />
        </SlideOverlayPanel>
      </div>
    </TicketPanelContext.Provider>
  );
}

function TicketDetailsPanel() {
  const { alert } = useUIContext();
  const { currentId } = useContext(TicketPanelContext);
  const res = useTicketData(currentId);

  if (res.status === "loading" || res.status === "idle")
    return repeat(<LoadingSkeletonParagraph />, 3);

  if (res.status === "error") return <TicketStatusError />;

  const { data } = res;
  const { ticket_id, title, content, created_by, date_created, ticket_type } =
    data.ticket;
  const history = data.history;

  function refreshHistory() {
    res.reload();
  }

  function copyTicketUUID() {
    const succ = () =>
      alert.toggle({ text: "Copied UUID to clipboard", type: "success" });
    const fail = () =>
      alert.toggle({ text: "Failed to copy to clipboard", type: "error" });

    copyTextToClipboard(ticket_id).then(succ).catch(fail);
  }

  return (
    <>
      <div className="pb-4 pt-8 mt-12 sticky top-0 bg-base-100">
        <div className="flex aictr spbtw">
          <div>
            Resolve tickets (Last refreshed: {formatDate(res.timestamp)})
          </div>
          <Badge className="capitalize badge-primary my-2">{ticket_type}</Badge>
        </div>
        <div className="flex aictr spbtw">
          <div className="text-3xl font-bold">{title}</div>
          <div className="flex gap-2">
            <Tooltips text="Refresh history" dir="left">
              <button
                className="btn btn-square btn-outline btn-primary"
                onClick={refreshHistory}
              >
                <Icon name="refresh" />
              </button>
            </Tooltips>

            <Tooltips text="Copy UUID" dir="left">
              <button
                className="btn btn-square btn-outline btn-primary"
                onClick={copyTicketUUID}
              >
                <Icon name="content_copy" />
              </button>
            </Tooltips>
          </div>
        </div>
      </div>

      <div className="content border-1 rounded-lg overflow-hidden">
        <div className="bg-primary px-4 py-3 text-primary-content flex aictr spbtw">
          <div className="flex aictr gap-1">
            <Icon name="terminal" size="1.5em" />
            {created_by || "System"}
          </div>
          <div>{formatDate(date_created)}</div>
        </div>
        <div className="p-4 whitespace-pre-line">{content}</div>
      </div>

      <div className="interaction-history">
        {history.map((h) => {
          return (
            <div>
              <div className="border-l-3 h-8 mx-8"></div>

              <div className="content border-1 rounded-lg overflow-hidden">
                <div className="bg-primary px-4 py-3 text-primary-content flex aictr spbtw">
                  <div className="flex aictr gap-1">
                    <Icon name="terminal" size="1.5em" />
                    {h.by || "System"}
                  </div>
                  <div>{formatDate(h.time)}</div>
                </div>
                <div className="p-4 whitespace-pre-line">{h.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="py-8">
        <div className="text-lg font-semibold my-2">Add a comment</div>
        <MDEditor />

        <div className="flex jcend"></div>
      </div>
    </>
  );
}

function GridList() {
  const { tickets, setCurrentId } = useContext(TicketPanelContext);

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

function TicketStatusError() {
  return (
    <div>
      There was an error trying to fetch ticket data
      <button className="btn btn-primary-btn-soft">Reload</button>
    </div>
  );
}
