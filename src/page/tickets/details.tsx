import { useContext, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MDEditor from "@components/mdeditor";
import { UserFromTextRenderer } from "@components/parsers/uuid";
import { UserInfo, UserSearchInput } from "@components/users";
import { LoadingIcon } from "@components/icons/others";
import { Icon } from "@components/icons";

import Badge from "@components/base/badge";
import { AppointmentCard } from "@components/base/card";
import { SelectOptions } from "@components/base/select";
import { Tooltips } from "@components/base/others";

import { getTicketData } from "@services/rpc/ticket";
import { executeDbRPC } from "@services/rpc/base";
import { useClient } from "@services/client";

import { LoadingSkeletonParagraph } from "@pages/others/loading";

import { useUIContext } from "@context/ui";

import { copyTextToClipboard } from "@utils/clipboard";
import { DateUtils } from "@utils/date";

import { TicketPanelContext } from ".";

const ActionMessages: Record<string, string> = {
  create: "assigned to the ticket",
  forward: "forwarded the ticket",
  cancel: "closed the ticket",
  approve: "closed the ticket",
  other: "performed an unspecified action",
  appointment_update: "updated the appointment details",
  edit: "editted the ticket information",
  update: "made an update",
};

const ActionIcons: Record<string, string> = {
  create: "calendar_add_on",
  forward: "forward",
  cancel: "cancel",
  dismiss: "cancel",
  approve: "check_circle",
  other: "help_outline",
  appointment_update: "event",
  edit: "edit",
  update: "update",
};

const ActionColor: Record<string, string> = {
  create: "#2E7D32",
  forward: "#0288D1",
  cancel: "#D32F2F",
  dismiss: "#D32F2F",
  approve: "#388E3C",
  other: "#455A64",
  appointment_update: "#7E57C2",
  edit: "#AB47BC",
  update: "var(--color-primary)",
};

export function TicketDetailsPanel() {
  const { supabase, account } = useClient();
  const { alert } = useUIContext();

  const { currentId, reload: reloadList } = useContext(TicketPanelContext);
  const [commentCooldown, setCommentCooldown] = useState(false);

  const [message, setMessage] = useState("");
  const ticketAction = useState("comment");

  const [forwardTo, setForwardTo] = useState<Haivy.User | null>(null);

  const res = getTicketData(currentId);

  if (res.status === "idle")
    return (
      <div className="w-[50vw]">
        <LoadingSkeletonParagraph />
        <LoadingSkeletonParagraph />
        <LoadingSkeletonParagraph />
      </div>
    );

  if (res.status === "loading")
    return (
      <div className="w-[50vw]">
        <LoadingSkeletonParagraph />
        <LoadingSkeletonParagraph />
        <LoadingSkeletonParagraph />
      </div>
    );

  if (res.status === "error") return <TicketStatusError />;

  const { data, status: _ } = res;

  if (!data.ticket) {
    return <TicketStatusError reload={res.reload} />;
  }

  const {
    ticket_id,
    title,
    content,
    created_by,
    date_created,
    ticket_type,
    status,
  } = data.ticket;

  const appointments = data.appointments;
  const history = data.interactions;

  function getRefreshHandler(savePrevData = false) {
    if (savePrevData) {
      setMessage("");
    }

    return () => {
      res.reload(savePrevData);
      if (!["dismiss", "approve"].includes(ticketAction[0])) return;

      reloadList();
      ticketAction[1]("comment");
    };
  }

  function copyTicketUUID() {
    const succ = () =>
      alert.toggle({ text: "Copied UUID to clipboard", type: "success" });
    const fail = () =>
      alert.toggle({ text: "Failed to copy to clipboard", type: "error" });

    copyTextToClipboard(ticket_id).then(succ).catch(fail);
  }

  function handleError(err: any) {
    console.error(err.code);
    alert.toggle({
      text: `An error has occured, error code: [${err.code}]`,
      type: "error",
    });
  }

  const actionTarget = appointments.length ? "appointment" : "request";

  function commentTicket() {
    if (commentCooldown) return;

    const msgTrimmed = message.trim();
    if (!msgTrimmed.length)
      return alert.toggle({ text: "Please enter a message", type: "error" });

    setCommentCooldown(true);
    executeDbRPC(supabase, "add_ticket_comment", {
      tid: ticket_id,
      content: msgTrimmed,
    })
      .then(getRefreshHandler(true), handleError)
      .then(() => setCommentCooldown(false));
  }

  function dismissTicket() {
    if (commentCooldown) return;

    executeDbRPC(supabase, "dismiss_ticket", {
      p_ticket_id: ticket_id,
      p_note: `${account?.user_id} cancelled/dismissed this ${actionTarget}`,
    })
      .then(getRefreshHandler(true), handleError)
      .then(() => setCommentCooldown(false));
  }

  function forwardTicket() {
    if (commentCooldown) return;

    if (!forwardTo) {
      return alert.toggle({
        text: "Please select a user to forward this ticket to",
        type: "error",
      });
    }

    executeDbRPC(supabase, "forward_ticket_comment", {
      p_ticket_id: ticket_id,
      note: "",
      p_from_staff: account?.user_id || "",
      p_to_staff: forwardTo.user_id,
    })
      .then(getRefreshHandler(true), handleError)
      .then(() => setCommentCooldown(false));
  }

  function approveTicket() {
    executeDbRPC(supabase, "approve_ticket", {
      p_ticket_id: ticket_id,
      p_note: `${account?.user_id} approved this ${actionTarget}`,
    })
      .then(getRefreshHandler(true), handleError)
      .then(() => setCommentCooldown(false));
  }

  function onSubmit() {
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
    <>
      <div className="mx-4 inline-block w-[45vw]">
        <div className="pb-4 pt-8 mt-12 sticky top-0 bg-base-100">
          <div className="flex aictr spbtw">
            <div>
              Resolve tickets (Last refreshed:{" "}
              {DateUtils.dFormat(res.timestamp)})
            </div>
          </div>
          <div className="flex aictr spbtw">
            <div className="text-3xl font-bold">{title}</div>
            <div className="flex gap-2">
              <Tooltips text="Refresh history" dir="left">
                <button
                  className="btn btn-square btn-outline btn-primary"
                  onClick={getRefreshHandler(false)}
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

        <div className="content border-1 border-b-3 rounded-lg overflow-hidden">
          <div className="bg-primary py-2 px-4 text-primary-content flex aictr spbtw">
            <UserInfo data={created_by} />
            <div>{DateUtils.dFormat(date_created)}</div>
          </div>
          <div className="p-4 whitespace-pre-line">{content}</div>
        </div>

        <div className="interaction-history">
          {history
            .sort((a, b) => (a.time > b.time ? 1 : -1))
            .map((h) => {
              return <CommentBlock h={h} key={h.id} />;
            })}
        </div>

        {status === "cancelled" ? (
          <TicketStatusResolved status={status} color="cancel" icon="cancel" />
        ) : status === "approved" ? (
          <TicketStatusResolved
            status={status}
            color="approve"
            icon="check_circle"
          />
        ) : (
          <div className="py-8">
            <div className="text-lg font-semibold my-2">Add a comment</div>
            {ticketAction[0] !== "comment" ? (
              <div className="my-4">
                <div className="mb-2">
                  This action doesn't need further comments
                </div>
                {ticketAction[0] === "forward" || (
                  <b>
                    ⚠️ Note that this action will close this ticket. No more
                    action can be done after this!
                  </b>
                )}
              </div>
            ) : (
              <MDEditor onChange={(c) => setMessage(c)} />
            )}

            <div className="flex jcend py-2 aictr gap-2">
              <SelectOptions
                options={[
                  ...["dismiss", "approve", "forward"].map((act) => ({
                    value: act,
                    text: (
                      <div className="flex aictr gap-2 capitalize">
                        <Icon
                          name={ActionIcons[act]}
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
                state={ticketAction}
                closeOnClick
              />
              {ticketAction[0] !== "forward" || (
                <>
                  <div>to</div>
                  <div className="w-80">
                    <UserSearchInput
                      roleFilter={["staff", "doctor"]}
                      direction="top right"
                      state={[forwardTo, setForwardTo]}
                    />
                  </div>
                </>
              )}

              {commentCooldown ? (
                <button className="btn btn-disabled px-8">
                  <LoadingIcon size="size-5" />
                </button>
              ) : (
                <button className="btn btn-primary px-8" onClick={onSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-24 top-12 sticky inline-block align-top p-6 w-90">
        <div className="py-4">
          <div className="font-bold mb-3 flex aictr gap-1">
            <Icon name="label" size="1.4em" />
            Label
          </div>
          <Badge className="capitalize badge-primary">{ticket_type}</Badge>
          <Badge className="capitalize badge-primary">{status}</Badge>
        </div>
        <hr />
        <div className="py-4">
          <div className="font-bold mb-3 flex aictr gap-1">
            <Icon name="person" size="1.4em" />
            Created by
          </div>
          <UserInfo data={created_by} />
        </div>
        <hr />
        <div className="py-4">
          <div className="font-bold mb-3 flex aictr gap-1">
            <Icon name="event" size="1.5em" />
            Appointment
          </div>
          {appointments.length
            ? appointments.map((a) => (
                <AppointmentCard
                  data={a}
                  className="no-animated"
                  key={a.appointment_id}
                />
              ))
            : "No appointment"}
        </div>
      </div>
    </>
  );
}

function TicketStatusResolved({
  status,
  color,
  icon,
}: {
  status: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="py-12 pr-6 flex aictr">
      <Icon
        name={icon}
        className="m-6"
        size="3rem"
        color={ActionColor[color]}
      />
      <div>
        <div className="text-lg font-bold">
          This ticket is {status} and closed!
        </div>
        <div>
          This ticket is now read-only. Updates will show up here. No further
          actions can be taken on this ticket.
        </div>
      </div>
    </div>
  );
}

function TicketStatusError({ reload }: { reload?: any }) {
  return (
    <div className="w-[50vw] flex aictr jcctr coll h-full gap-8">
      <div className="text-2xl font-bold">
        There was an error trying to fetch ticket data
      </div>
      <button className="btn btn-primary-btn-soft" onClick={reload}>
        Reload
      </button>
    </div>
  );
}

type InteractionHistory = Omit<Haivy.TicketInteractions, "by"> & {
  by: Haivy.User | null;
};

function CommentBlock({ h }: { h: InteractionHistory }) {
  const CmpNote = () => (
    <div className="prose prose-invert text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{h.note}</Markdown>
    </div>
  );

  const FormattedTime = () => (
    <div className="text-xs">{DateUtils.dFormat(h.time)}</div>
  );

  if (h.action !== "comment") {
    const color = ActionColor[h.action];

    return (
      <>
        <div className="border-l-3 h-8 mx-8"></div>

        <div
          className="flex aictr gap-3 border-1 border-b-3 rounded-md overflow-hidden p-2"
          style={{ borderColor: color }}
        >
          <div className="flex aictr jcctr px-2">
            <Icon name={ActionIcons[h.action]} size="2rem" color={color} />
          </div>
          <div className="w-full">
            <div
              className="border-b-1 pb-1 pr-4 border-dotted flex spbtw aictr"
              style={{ borderColor: "#0002" }}
            >
              <div>
                <span className="link link-hover">
                  {h.by?.full_name || "System"}
                </span>
                <span className="font-bold"> {ActionMessages[h.action]}</span>
              </div>

              <div>{<FormattedTime />}</div>
            </div>
            {!h.note || (
              <div className="italic whitespace-pre-line mt-2">
                <UserFromTextRenderer text={h.note} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="border-l-3 h-8 mx-8"></div>

      <div className="content border-1 border-b-3 rounded-lg overflow-hidden">
        <div className="bg-primary py-2 px-4 text-primary-content flex aictr spbtw">
          <UserInfo data={h.by} />
          <div>{<FormattedTime />}</div>
        </div>
        <div className="p-4">
          <CmpNote />
        </div>
      </div>
    </div>
  );
}
