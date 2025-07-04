import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Confetti from "react-confetti";

import Badge from "@components/base/badge";
import { SlideOverlayPanel } from "@components/overlay/slidepanel";
import { SelectOptions } from "@components/base/select";
import { TabSelector } from "@components/base/tabs";
import { ActionCard } from "@components/base/card";
import { Tooltips } from "@components/base/others";
import { UserAutoInfo } from "@components/users";
import { Table } from "@components/table";
import { Icon } from "@components/icons";

import { getTickets } from "@services/rpc/ticket";

import { useUIContext } from "@context/ui";

import { FullscreenLoading } from "@pages/others/loading";

import { capitalize, clipString } from "@utils/converter";
import { DateUtils } from "@utils/date";

import { TicketPanelContext } from ".";
import { TicketDetailsPanel } from "./details";
import { TicketCreationPanel } from "./panels";

const StatusColor: { [n: string]: string } = {
  pending: "#FACC15",
  cancelled: "#EF4444",
  approved: "#10B981",
};

function CircleIndicator({
  s,
  hideTooltip,
}: {
  s: string;
  hideTooltip?: boolean;
}) {
  const st = capitalize(s);

  if (hideTooltip) {
    return (
      <div
        className="w-4 h-4 rounded-full"
        title={st}
        style={{ background: StatusColor[s] || "#676767" }}
      ></div>
    );
  }

  return (
    <Tooltips text={st} dir="left">
      <div
        className="w-4 h-4 rounded-full"
        title={st}
        style={{ background: StatusColor[s] || "#676767" }}
      ></div>
    </Tooltips>
  );
}

export default function StaffTickets() {
  const { sidepanel } = useUIContext();

  const { id: currentId = "" } = useParams();
  const navigate = useNavigate();

  const ticketList = getTickets();

  const displayState = useState("grid");
  const filterState = useState("p");

  if (ticketList.status === "loading" || ticketList.status === "idle") {
    return <FullscreenLoading />;
  }

  if (ticketList.status !== "success") {
    return "Failed to load data";
  }

  const ticketsRaw = ticketList.data || [];

  const tickets = ticketsRaw.filter((t) => {
    switch (filterState[0]) {
      case "p":
        return t.status === "pending";
      case "d":
        return t.status === "cancelled";
      case "a":
        return t.status === "approved";
    }

    return true;
  });

  function setCurrentId(id: string) {
    if (!id) return navigate("/tickets");
    navigate(`/tickets/${id}`);
  }

  function reload() {
    ticketList.reload();
  }

  function openNewTicket() {
    sidepanel.open("create_ticket");
  }

  return (
    <TicketPanelContext.Provider
      value={{ tickets, currentId, setCurrentId, reload }}
    >
      <div className="content-wrapper flex">
        <div className="h-full flex coll key-fade-in flex-1">
          <div className="flex aictr pb-4 pt-8 pr-8 gap-3">
            <Icon name="confirmation_number" size="3em" />
            <div className="flex-1">
              <div className="text-2xl font-bold">System's Tickets</div>
              <div className="">
                Showing {tickets.length} out of {ticketsRaw.length} tickets
              </div>
            </div>

            <div className="control flex-1 flex aictr jcend gap-4">
              <SelectOptions
                options={[
                  {
                    text: (
                      <div className="flex aictr gap-2">
                        <Icon name="list" />
                        All tickets
                      </div>
                    ),
                    value: "l",
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
                        Dismissed
                      </div>
                    ),
                    value: "d",
                  },
                ]}
                state={filterState}
                direction="bottom right"
              />
              <TabSelector
                list={[
                  { name: "Grid", icon: "grid_view", value: "grid" },
                  { name: "Table", icon: "view_list", value: "table" },
                ]}
                state={displayState}
              />
            </div>
            <button className="btn btn-primary" onClick={openNewTicket}>
              <Icon name="add" />
              Create
            </button>
          </div>

          <div key={filterState[0]} className="flex-1 overflow-hidden">
            {tickets.length ? (
              displayState[0] === "grid" ? (
                <GridList />
              ) : (
                <TableList />
              )
            ) : ticketsRaw.length < 1 ||
              (filterState[0] === "p" && !tickets.length) ? (
              <AllCaughtUp />
            ) : (
              <NoDisplay />
            )}
          </div>

          <div className="flex aictr jcctr gap-6 p-2 relative">
            {["pending", "cancelled", "approved"].map((s) => (
              <div className="flex aictr gap-2 capitalize h-8">
                <CircleIndicator s={s} hideTooltip />
                {s}
              </div>
            ))}
          </div>
        </div>
        <TicketCreationPanel />
      </div>

      <SlideOverlayPanel close={() => setCurrentId("")} isOpen={!!currentId}>
        <TicketDetailsPanel />
      </SlideOverlayPanel>
    </TicketPanelContext.Provider>
  );
}

function GridList() {
  const { tickets, setCurrentId } = useContext(TicketPanelContext);

  return (
    <div className="overflow-y-auto cards-grid h-full">
      {tickets.map((ticket, i) => {
        const { ticket_id, status, date_created, content, title, ticket_type } =
          ticket;

        const created = DateUtils.format(
          new Date(date_created || ""),
          "eeee, MMM io, yyyy"
        );

        return (
          <ActionCard
            key={ticket_id}
            subtitle={capitalize(ticket_type)}
            subIcon="confirmation_number"
            tag={<CircleIndicator s={status} />}
            details={
              <div>
                <div>{content}</div>
                <div className="font-semibold text-xs">{created}</div>
              </div>
            }
            title={title || "No title"}
            className="h-60 key-fade-in"
            style={{ animationDuration: Math.min(1, i * 0.2) + "s" }}
            onDoubleClick={() => setCurrentId(ticket_id)}
            actions={[
              {
                title: "View details",
                onClick: () => setCurrentId(ticket_id),
              },
            ]}
          />
        );
      })}
      <div></div>
      <div></div>
    </div>
  );
}

function TableList() {
  const { tickets, setCurrentId } = useContext(TicketPanelContext);

  return (
    <Table
      defaultSortCol={2}
      defaultSortDir="desc"
      list={tickets}
      tableProps={{
        className: "text-sm mr-8 h-full",
      }}
      rowsProps={(t) => {
        return {
          onDoubleClick: () => setCurrentId(t.ticket_id),
        };
      }}
      columns={[
        {
          header: <div className="tactr">Status</div>,
          render(ticket) {
            return <CircleIndicator s={ticket.status} hideTooltip />;
          },
          width: 80,
          className: "flex aictr jcctr",
        },
        {
          header: "Ticket's content",
          render(a) {
            return (
              <div className="max-w-0">
                <div className="font-bold">
                  {a.title}
                  <Badge className="badge-secondary capitalize scale-70">
                    {a.ticket_type}
                  </Badge>
                </div>
                <div>┗ {clipString(a.content, 64)}</div>
              </div>
            );
          },
        },

        {
          header: "Created day",
          width: 200,
          render(a) {
            return (
              <div>{DateUtils.format(a.date_created || "", "yyyy-MM-dd")}</div>
            );
          },
          sortBy: (t) => t.date_created,
        },

        {
          header: "Created by",
          width: 300,
          render(a) {
            return <UserAutoInfo id={a.created_by} />;
          },
        },
      ]}
    />
  );
}

function NoDisplay() {
  return (
    <div className="flex aictr jcctr h-full coll gap-8">
      <div className="flex coll aictr jcctr gap-8 text-xl font-bold">
        <div className="text-[10rem]">(·.·)</div>
        No item to display
      </div>
    </div>
  );
}

function AllCaughtUp() {
  // const tRef = useRef<Record<string, any>>({ e: 0, u: 0 });

  // const [run, setRun] = useState(false);
  const [ren, setRen] = useState(false);

  const { innerWidth: width, innerHeight: height } = window;

  function celebrate() {
    // setRun(true);
    setRen(true);

    // clearTimeout(tRef.current.e);
    // clearTimeout(tRef.current.u);

    // tRef.current = {
    //   // u: setTimeout(() => setRun(false), 1000),
    //   // e: setTimeout(() => setRen(false), 4000),
    // };
  }

  function stopRen() {
    setRen(false);
  }

  return (
    <div className="flex aictr jcctr h-full coll gap-8">
      {!ren || (
        <div className="fixed top-0 left-0 z-50 w-full h-full key-fade-in bg-[#0003]">
          <Confetti
            width={width}
            height={height}
            gravity={0.7}
            numberOfPieces={2000}
            tweenDuration={2000}
            onConfettiComplete={stopRen}
            recycle={false}
          />

          <div
            className="text-secondary absolute top-1/2"
            style={{ transform: "translateY(50%)" }}
          >
            <div className="text-[10rem] font-bold whitespace-nowrap key-lets-gooo">
              {"Y" + "A".repeat(200) + "Y"}
            </div>
          </div>
        </div>
      )}
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
        <button
          className="btn bg-gradient-to-r from-pink-200 to-secondary btn-lg via-yellow-100"
          onClick={celebrate}
        >
          {ren ? "Celebrating ! ! ! ! ! !" : "Celebrate!"}
        </button>
      </div>
    </div>
  );
}
