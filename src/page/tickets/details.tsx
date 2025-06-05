import { useContext, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MDEditor from "@components/mdeditor";
import { LoadingIcon } from "@components/icons/others";
import { UserInfoInline } from "@components/users";
import { Icon } from "@components/icons";

import Badge from "@components/base/badge";
import { AppointmentCard } from "@components/base/card";
import { SelectOptions } from "@components/base/select";
import { Tooltips } from "@components/base/others";

import { useTicketData } from "@services/data/ticket";
import { useClient } from "@services/client";

import { LoadingSkeletonParagraph } from "@pages/others/loading";

import { useUIContext } from "@context/ui";

import { copyTextToClipboard } from "@utils/clipboard";
import { formatDate } from "@utils/converter";
import { repeat } from "@utils/generator";

import { TicketPanelContext } from ".";

export function TicketDetailsPanel() {
  const { supabase } = useClient();
  const { alert } = useUIContext();

  const [commentCooldown, setCommentCooldown] = useState(false);
  const { currentId } = useContext(TicketPanelContext);

  const [message, setMessage] = useState("");
  const ticketAction = useState("comment");

  const res = useTicketData(currentId);

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

  function refreshHistory(savePrevData = false) {
    if (savePrevData) {
      setMessage("");
    }

    return () => res.reload(savePrevData);
  }

  function copyTicketUUID() {
    const succ = () =>
      alert.toggle({ text: "Copied UUID to clipboard", type: "success" });
    const fail = () =>
      alert.toggle({ text: "Failed to copy to clipboard", type: "error" });

    copyTextToClipboard(ticket_id).then(succ).catch(fail);
  }

  function submitComments() {
    if (commentCooldown) return;

    const msgTrimmed = message.trim();
    if (!msgTrimmed.length)
      return alert.toggle({ text: "Please enter a message" });

    setCommentCooldown(true);
    supabase
      .rpc("add_ticket_comment", { tid: ticket_id, content: msgTrimmed })
      .then(refreshHistory(true), (_) => console.error(_))
      .then(() => setCommentCooldown(false));
  }

  return (
    <>
      <div className="mx-4 inline-block w-[45vw]">
        <div className="pb-4 pt-8 mt-12 sticky top-0 bg-base-100">
          <div className="flex aictr spbtw">
            <div>
              Resolve tickets (Last refreshed: {formatDate(res.timestamp)})
            </div>
          </div>
          <div className="flex aictr spbtw">
            <div className="text-3xl font-bold">{title}</div>
            <div className="flex gap-2">
              <Tooltips text="Refresh history" dir="left">
                <button
                  className="btn btn-square btn-outline btn-primary"
                  onClick={refreshHistory(false)}
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
          <div className="bg-primary py-2 px-4 text-primary-content flex aictr spbtw">
            <UserInfoInline data={created_by} />
            <div>{formatDate(date_created)}</div>
          </div>
          <div className="p-4 whitespace-pre-line">{content}</div>
        </div>

        <div className="interaction-history">
          {history.map((h) => {
            return (
              <div key={h.id}>
                <div className="border-l-3 h-8 mx-8"></div>

                <div className="content border-1 rounded-lg overflow-hidden">
                  <div className="bg-primary py-2 px-4 text-primary-content flex aictr spbtw">
                    <UserInfoInline data={h.by} />
                    <div>{formatDate(h.time)}</div>
                  </div>
                  <div className="p-4 prose prose-invert">
                    <Markdown remarkPlugins={[remarkGfm]}>{h.note}</Markdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="py-8">
          <div className="text-lg font-semibold my-2">Add a comment</div>
          <MDEditor onChange={(c) => setMessage(c)} />

          <div className="flex jcend py-2 aictr gap-2">
            <SelectOptions
              options={[
                {
                  value: "Dismiss",
                  text: "❌ Dismiss ticket",
                  sub: "Dismiss ticket with comments",
                },
                {
                  value: "forward",
                  text: "➡️ Foward ticket",
                  sub: "Forward ticket with comments",
                },
                {
                  value: "comment",
                  text: "💬 Comment",
                  sub: "Add comments to ticket",
                },
              ]}
              state={ticketAction}
              closeOnClick
            />
            {ticketAction[0] !== "forward" || (
              <>
                <span>to</span>
                <SelectOptions
                  options={[
                    {
                      value: "James Waterson",
                      sub: "watersonjames@gmail.com",
                    },
                    {
                      value: "Narlel Madam",
                      sub: "madddaaaaadd@gmail.com",
                    },
                    {
                      value: "Paradam Google",
                      sub: "google@gmail.com",
                    },
                  ]}
                  closeOnClick
                />
              </>
            )}

            {commentCooldown ? (
              <button className="btn btn-disabled px-8">
                <LoadingIcon size="size-5" />
              </button>
            ) : (
              <button className="btn btn-primary px-8" onClick={submitComments}>
                Submit
              </button>
            )}
          </div>
        </div>
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
          <UserInfoInline data={created_by} />
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
