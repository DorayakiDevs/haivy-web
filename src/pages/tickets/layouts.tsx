import { useState } from "react";
import { format } from "date-fns";

import { TicketCard } from "@components/features/tickets";
import { IconButton } from "@components/shared/buttons";
import { Tooltip } from "@components/shared/tooltip";
import { Loading } from "@components/icons/loading";
import { Table } from "@components/tables";

import Badge from "@components/shared/badge";

import useUI from "@hooks/useUI";

import { capitalize } from "@utils/converter";
import { StatusColor } from "@utils/data";

import { useTicketPanel, type T_Ticket } from "./staff";

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
    <Tooltip title={st} dir="left">
      <div
        className="w-4 h-4 rounded-full"
        title={st}
        style={{ background: StatusColor[s] || "#676767" }}
      ></div>
    </Tooltip>
  );
}

type T_KanColProp = {
  list: T_Ticket[];
  name: string;
  desc: string;
  init?: boolean;
};

function KanbanColumn(props: T_KanColProp) {
  const { openDetails } = useTicketPanel();

  const { list, name, desc, init } = props;
  const [showAll, setShowAll] = useState(init ?? list.length !== 0);

  const ROW_PROPS = {
    className:
      "flex-1 border-1 rounded-box pb-4 relative flex coll overflow-hidden transition-keyword",
    style: {
      height: showAll ? "calc(100% + 16px)" : "fit-content",
      transition: "height 0.2s",
    },
  };

  const toggle = () => setShowAll((a) => !a);
  const render = list.slice(0, showAll ? list.length : 1);

  function Header() {
    return (
      <div className="p-4 bg-primary text-primary-content flex aictr spbtw">
        <div>
          <div className="flex aictr gap-2">
            <CircleIndicator s={name.toLowerCase()} hideTooltip />
            <div className="text-md font-semibold">
              {name} ({list.length})
            </div>
          </div>
          <div className="text-sm">{desc}</div>
        </div>
        <div className="flex aictr gap-2">
          <IconButton
            size="sm"
            onClick={toggle}
            title={showAll ? "Collapse" : "Expand"}
            icon={showAll ? "arrow_drop_up" : "arrow_drop_down"}
            dir="left"
          />
        </div>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div {...ROW_PROPS}>
        <Header />
        <NoDisplay />
      </div>
    );
  }

  return (
    <div {...ROW_PROPS}>
      <Header />
      <div className="flex-1 w-full overflow-y-scroll">
        {render.map((t) => (
          <TicketCard
            ticket={t}
            className="h-42 my-3 ml-2 mr-0 max-w-none fade-in"
            onClick={() => openDetails(t)}
          />
        ))}

        {list.length - render.length ? (
          <div className="tactr mt-4 text-sm">
            + {list.length - render.length} more tickets
          </div>
        ) : (
          <div className="h-8"></div>
        )}
      </div>
    </div>
  );
}

export function GridDisplay() {
  const { filtered: tickets, loading, openDetails } = useTicketPanel();

  if (loading) {
    return (
      <div className="w-full h-full flex aictr jcctr">
        <Loading size="xl" />
      </div>
    );
  }

  if (!tickets.length) {
    return <NoDisplay />;
  }

  return (
    <div className="cards-grid overflow-y-auto py-8 fade-in w-full h-full">
      {tickets.map((ticket) => (
        <TicketCard ticket={ticket} onClick={() => openDetails(ticket)} />
      ))}
      <div></div>
      <div></div>
    </div>
  );
}

export function TableDisplay() {
  const { filtered: tickets, loading, openDetails } = useTicketPanel();

  if (loading) {
    return (
      <div className="w-full h-full flex aictr jcctr">
        <Loading size="xl" />
      </div>
    );
  }

  return (
    <Table
      defaultSortCol={2}
      defaultSortDir="desc"
      list={tickets}
      tableProps={{
        className: "text-sm h-full pb-8 fade-in",
      }}
      rowsProps={(t, i) => ({
        onDoubleClick: () => openDetails(t),
        className: "fade-in",
        style: { animationDuration: `${Math.min(1.5, 0.1 * i)}s` },
      })}
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
              <div className="flex coll">
                <div className="font-bold">{a.title}</div>
                <div className="overflow-hidden whitespace-nowrap overflow-ellipsis w-[90%]">
                  ┗ {a.content}
                </div>
              </div>
            );
          },
        },

        {
          header: "Created day",
          width: 200,
          render(a) {
            return (
              <div>{format(a.date_created || "", "EEEE - dd.MM.yyyy")}</div>
            );
          },
          sortBy: (t) => t.date_created,
        },

        {
          header: "Type",
          width: 140,
          render(a) {
            return (
              <Badge className="badge-secondary capitalize">
                {a.ticket_type}
              </Badge>
            );
          },
        },
      ]}
      emptyPlaceholder={<NoDisplay />}
    />
  );
}

export function KanbanDisplay() {
  const { tickets, loading } = useTicketPanel();
  const { sidePanel } = useUI();

  if (loading) {
    return (
      <div className="w-full h-full flex aictr jcctr">
        <Loading size="xl" />
      </div>
    );
  }

  const pending = tickets.filter((t) => t.status === "pending");
  const approved = tickets.filter((t) => t.status === "approved");
  const cancelled = tickets.filter((t) => t.status === "cancelled");

  return (
    <div className="flex h-full w-full gap-4 fade-in">
      <KanbanColumn
        list={pending}
        name="Pending"
        desc="Tickets waiting to be process"
      />
      {sidePanel.panelId === "create_ticket" || (
        <div className="flex-2 flex gap-4 fade-in">
          <KanbanColumn
            list={approved}
            name="Approved"
            desc="Tickets that are approved"
            init={false}
          />
          <KanbanColumn
            list={cancelled}
            name="Cancelled"
            desc="Tickets that are cancelled"
            init={false}
          />
        </div>
      )}
    </div>
  );
}

function NoDisplay() {
  return (
    <div className="flex aictr jcctr h-full coll gap-8 p-8">
      <div className="flex coll aictr jcctr gap-8 text-xl font-bold">
        <div className="text-[4rem]">! (0 . 0 ;)</div>
        No item to display
      </div>
    </div>
  );
}
