import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { compareAsc, format } from "date-fns";
import Markdown from "react-markdown";

import { StatusBadge, TypeBadge } from "@components/features/tickets";
import { Button, IconButton } from "@components/shared/buttons";
import { UserSearchInput } from "@components/shared/users";
import { SelectOptions } from "@components/shared/select";
import { Loading } from "@components/icons/loading";
import { TextArea } from "@components/shared/text";
import { Icon } from "@components/icons/google";

import { useServices } from "@services/index";

import useUI from "@hooks/useUI";

import { copyTextToClipboard } from "@utils/clipboard";
import { getUserAvatar } from "@utils/parser";
import { stamp } from "@utils/date";
import {
  ActionColor,
  ActionIcons,
  ActionMessages,
  StatusColor,
  StatusIcons,
} from "@utils/data";
import { Helmet } from "react-helmet-async";
import { capitalize } from "@utils/converter";
import { AppointmentCard } from "@components/features/appointment";

type T_Ticket_Interaction = Omit<
  Haivy.DBRow<"ticket_interaction_history">,
  "by"
> & {
  by: Haivy.DBRow<"user_details"> | null;
};

const D_FORMAT = "EEE, dd.MM.yyyy - kk:mm";

type T_Details = {
  interactions: T_Ticket_Interaction[];
  created_by: Haivy.DBRow<"user_details"> | null;
  assigned_to: Haivy.DBRow<"user_details"> | null;
  appointment: Haivy.Appointment | null;
} & Omit<Haivy.DBRow<"ticket">, "created_by" | "assigned_to">;

type T_Context = {
  reload(deleteData?: boolean): void;
  details: T_Details | null;
  loading: boolean;
};

const TicketDetailsContext = createContext<T_Context | null>(null);
function useTicketDetails() {
  const data = useContext(TicketDetailsContext);
  if (!data) throw new Error("TicketDetails context data not found!");

  return data;
}

export default function TicketDetailsPanel() {
  const { client } = useServices();
  const { id = "" } = useParams();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<T_Details | null>(null);
  const [_stamp, setStamp] = useState(stamp());
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();
    const deleteData = _stamp.endsWith("-d");

    async function load() {
      setError(null);
      if (deleteData) setLoading(true);

      const promise = client
        .from("ticket")
        .select(
          `ticket_id, date_created, title, content, ticket_type, status, 
           interactions:ticket_interaction_history(id, ticket_id, time, action, note, by: user_details(*)), 
           created_by:user_details!ticket_created_by_fkey1(*),
           assigned_to:user_details!ticket_assigned_to_fkey1(*),
           appointment:appointment(*)
          `
        )
        .abortSignal(controller.signal)
        .eq("ticket_id", id)
        .single();

      const { data, error } = await promise;

      if (controller.signal.aborted) {
        setLoading(true);
        return;
      }

      if (error) {
        setError(error);
        setDetails(null);
      } else {
        setDetails(data);
      }

      setLoading(false);
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, _stamp]);

  const value = {
    details,
    loading,
    reload(deleteData = false) {
      setStamp(stamp() + (deleteData ? "-d" : ""));
    },
  };

  return (
    <TicketDetailsContext.Provider value={value}>
      {loading ? (
        <LoadingPanel />
      ) : details ? (
        <DetailsPanel />
      ) : error ? (
        <FailedPanel error={error} />
      ) : (
        <LoadingPanel />
      )}
    </TicketDetailsContext.Provider>
  );
}

function DetailsPanel() {
  const { details, reload } = useTicketDetails();
  const { toaster } = useUI();

  if (!details) {
    return;
  }

  const { interactions, ticket_id, ticket_type, status, created_by } = details;

  function copyTicket() {
    copyTextToClipboard(ticket_id)
      .then(() => toaster.success("Ticket ID copied to clipboard"))
      .catch(() => toaster.error("Failed to copy to clipboard!"));
  }

  console.log(details);

  return (
    <div className="content-wrapper p-6 overflow-y-auto">
      <Helmet>
        <title>Haivy | Ticket - {details.title} </title>
      </Helmet>

      <div className="flex aiart">
        <div className="flex-1 pb-40">
          <div className="pb-2 pt-8 sticky -top-6 from-base-100 from-75% to-transparent bg-gradient-to-b flex aictr gap-4">
            <Icon name="confirmation_number" size="3rem" />
            <div className="flex-1">
              <div className="text-sm">Ticket Details</div>
              <div className="flex spbtw">
                <div className="font-bold text-3xl mb-4">{details.title}</div>
                <div className="flex gap-2">
                  <IconButton
                    icon="replay"
                    title="Reload"
                    onClick={() => reload(true)}
                  />
                  <IconButton
                    icon="content_copy"
                    title="Copy ticket ID"
                    color="primary"
                    onClick={copyTicket}
                  />
                </div>
              </div>
            </div>
          </div>

          {!details.content || (
            <CommentFrame
              note={details.content}
              by={details.created_by}
              time={details.date_created || ""}
            />
          )}

          <div>
            {interactions
              .sort((a, b) => compareAsc(a.time, b.time))
              .map((int) => {
                return <InteractionFrame int={int} />;
              })}

            <TicketActionMaker />
          </div>
        </div>

        <div className="w-[32%] max-w-128 float-right sticky top-28">
          <SectionSep icon="label" title="Tags">
            <TypeBadge type={ticket_type} />
            <StatusBadge status={status} />
          </SectionSep>

          <SectionSep icon="account_circle" title="Created by">
            <UserFrame user={created_by} />
          </SectionSep>

          <div className="ml-4">
            {!details.appointment || (
              <AppointmentCard data={details.appointment} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FailedPanel({ error }: { error?: any }) {
  const { id } = useParams();

  return (
    <div className="content-wrapper content-ctr coll gap-8">
      <div className="text-[4rem] font-bold">404</div>
      <div className="text-xl">Sorry, but we couldn't find what you need!</div>

      <div className="p-8 bg-neutral text-neutral-content w-fit rounded-box font-mono tactr">
        <div>Loading ID: {id}</div>
        <div>Message: {error?.message ?? "-"}</div>
      </div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="content-wrapper content-ctr">
      <Loading size="xl" />
    </div>
  );
}

function InteractionFrame({ int }: { int: T_Ticket_Interaction }) {
  if (int.action !== "comment") {
    return (
      <div className="ml-16">
        <div className="border-l-2 h-8 mx-8"></div>
        <ActionFrame a={int} />
      </div>
    );
  }

  return (
    <>
      <div className="border-l-2 h-8 ml-24"></div>
      <CommentFrame {...int} />
    </>
  );
}

function CommentFrame(props: Partial<T_Ticket_Interaction>) {
  const { note, by = null, time, id } = props;

  return (
    <div className="flex gap-4 aiart">
      <img src={getUserAvatar(by, true)} width={48} className="rounded-full" />

      <div className="border-1 flex-1 rounded-box overflow-hidden">
        <div className="bg-primary text-primary-content py-2 px-4 flex aictr spbtw">
          <div className="text-sm">
            {by?.full_name} {"commented "}
            <span className="text-xs">{id ? `(#${id})` : ""}</span>
          </div>
          <div className="text-xs">{time ? format(time, D_FORMAT) : "-"}</div>
        </div>

        <div className="content p-4 whitespace-pre-line">
          <Markdown>{note}</Markdown>
        </div>
      </div>
    </div>
  );
}

function ActionFrame({ a }: { a: T_Ticket_Interaction }) {
  const FormattedTime = () => (
    <div className="text-xs">{format(a.time, D_FORMAT)}</div>
  );

  const color = ActionColor[a.action];

  return (
    <div
      className="flex aictr gap-3 border-1 border-b-3 rounded-box overflow-hidden p-2"
      style={{ borderColor: color }}
    >
      <div className="px-2">
        <Icon name={ActionIcons[a.action] || ""} size="2rem" color={color} />
      </div>
      <div className="w-full">
        <div
          className="border-b-1 pb-1 pr-4 border-dotted flex spbtw aictr"
          style={{ borderColor: "#0002" }}
        >
          <div className="text-sm">
            <span className="link link-hover">
              {a.by?.full_name || "System"}
            </span>
            <span className="font-bold"> {ActionMessages[a.action]}</span>
          </div>

          <div>{<FormattedTime />}</div>
        </div>

        {!a.note || (
          <div className="italic whitespace-pre-line mt-2">
            <Markdown>{a.note}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionSep(
  props: { icon: string; title: string } & React.ChildrenProps
) {
  return (
    <div className="ml-4 mb-4 border-1 rounded-field overflow-hidden">
      <div className="p-4">
        <div className="font-semibold mb-4 flex aictr gap-2">
          <Icon name={props.icon} className="mr-2" />
          {props.title}
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}

function TicketActionMaker() {
  const { details, reload } = useTicketDetails();
  if (!details) return;

  const { status, ticket_id } = details;

  const { toaster } = useUI();
  const { client, auth } = useServices();

  const ticketAction = useState("comment");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forwardTo, setForwardTo] = useState<Haivy.User | null>(null);

  if (status !== "pending") {
    return <TicketClosed status={status} />;
  }

  function handleError(err: any) {
    console.error(err.code);
    toaster.error("An error has occured, error code");
  }

  function getRefreshHandler() {
    setMessage("");

    return () => {
      reload();
    };
  }

  function commentTicket() {
    if (loading) return;
    if (!ticket_id) return;

    const msgTrimmed = message.trim();
    if (!msgTrimmed.length) {
      return toaster.error("Please enter a message");
    }

    setLoading(true);
    client
      .rpc("add_ticket_comment", {
        tid: ticket_id,
        content: msgTrimmed,
      })
      .then(getRefreshHandler(), handleError)
      .then(() => setLoading(false));
  }

  function dismissTicket() {
    if (loading) return;
    if (!ticket_id) return;

    setLoading(true);
    client
      .rpc("dismiss_ticket", {
        p_ticket_id: ticket_id,
        p_note: `${auth.user?.id} cancelled/dismissed this ticket`,
      })
      .then(getRefreshHandler(), handleError)
      .then(() => setLoading(false));
  }

  function forwardTicket() {
    if (loading) return;
    if (!ticket_id) return;

    if (!forwardTo) {
      return toaster.error("Please select a user to forward this ticket to");
    }

    setLoading(true);
    client
      .rpc("forward_ticket_comment", {
        p_ticket_id: ticket_id,
        note: "",
        p_from_staff: auth.user?.id || "",
        p_to_staff: forwardTo.user_id,
      })
      .then(getRefreshHandler(), handleError)
      .then(() => setLoading(false));
  }

  function approveTicket() {
    if (loading) return;
    if (!ticket_id) return;

    setLoading(true);
    client
      .rpc("approve_ticket", {
        p_ticket_id: ticket_id,
        p_note: `${auth.user?.id} approved this ticket`,
      })
      .then(getRefreshHandler(), handleError)
      .then(() => setLoading(false));
  }

  function handleSubmit() {
    switch (ticketAction[0]) {
      case "dismiss": {
        return dismissTicket();
      }

      case "forward": {
        return forwardTicket();
      }

      case "approve": {
        return approveTicket();
      }

      default: {
        return commentTicket();
      }
    }
  }

  return (
    <div className="pl-16 mt-12">
      {ticketAction[0] === "comment" ? (
        <TextArea label="Leave a comment" state={[message, setMessage]} />
      ) : ticketAction[0] === "forward" ? (
        <UserSearchInput
          label="Select a user to forward to"
          state={[forwardTo, setForwardTo]}
          roleFilter={["staff"]}
        />
      ) : (
        <NoFurtherAction />
      )}

      <div className="flex aictr jcend gap-4 py-4">
        <SelectOptions
          state={ticketAction}
          direction="bottom right"
          closeOnClick
          options={[
            ...["dismiss", "approve", "forward"].map((act) => ({
              value: act,
              text: (
                <div className="flex aictr gap-2 capitalize">
                  <Icon
                    name={ActionIcons[act] || "info"}
                    color={ActionColor[act]}
                    size="1.2rem"
                  />
                  {act + " ticket"}
                </div>
              ),
            })),
            {
              value: "comment",
              text: (
                <div className="flex aictr gap-2">
                  <Icon name="comment" size="1.2rem" /> Comment
                </div>
              ),
            },
          ]}
        />
        <Button
          className="btn-outline btn-primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

function TicketClosed({ status }: { status: string }) {
  return (
    <div className="p-12 flex aictr">
      <Icon
        name={StatusIcons[status] || "info"}
        className="m-6"
        size="3rem"
        color={StatusColor[status]}
      />
      <div>
        <div className="text-lg font-bold">
          This ticket is {status} and closed!
        </div>
        <div>
          This ticket is now read-only. Updates will show up here. <br />
          No further actions can be taken on this ticket.
        </div>
      </div>
    </div>
  );
}

function NoFurtherAction() {
  return (
    <div className="my-4">
      <div className="mb-2">This action doesn't need further comments</div>
      <b>
        ⚠️ Note that this action will close this ticket. No more action can be
        done after this!
      </b>
    </div>
  );
}

function UserFrame({ user }: { user: Haivy.User | null }) {
  return (
    <div className="flex aictr gap-4">
      <img
        src={getUserAvatar(user, true)}
        width={48}
        className="rounded-full"
      />
      <div>
        <div className="text-sm capitalize">{user?.roles[0]}</div>
        <div className="font-semibold">{user?.full_name}</div>
      </div>
    </div>
  );
}
