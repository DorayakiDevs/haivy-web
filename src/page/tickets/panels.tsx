import { useContext, useState } from "react";

import { InputTextErrorable } from "@components/base/input";
import { SubmitWithLoading } from "@components/base/button";
import { SelectOptions } from "@components/base/select";
import { TextArea } from "@components/base/textarea";
import { UserSearchInput } from "@components/users";
import { Icon } from "@components/icons";

import { SidePanelWrapper } from "@context/ui/sidepanel";
import { useUIContext } from "@context/ui";

import { useValidatableState } from "@hooks/validator";

import { useClient } from "@services/client";

import { validateNotEmpty } from "@utils/validator";

import { TicketPanelContext } from ".";

export function TicketCreationPanel() {
  const { reload } = useContext(TicketPanelContext);
  const { alert, sidepanel } = useUIContext();

  const { supabase } = useClient();
  const [loading, setLoading] = useState(false);

  const title = useValidatableState("", validateNotEmpty);
  const content = useValidatableState("", validateNotEmpty);
  const assigned = useState<Haivy.User | null>(null);

  const type = useState("other");

  async function createTicket() {
    const a = title.validate();
    const b = content.validate();

    if (!a || !b) return;

    const c = assigned[0];
    if (!c) {
      return alert.toggle({
        text: "Please assign a user",
        type: "error",
      });
    }

    setLoading(true);

    const { error } = await supabase.rpc("create_ticket", {
      p_title: title.current,
      p_content: content.current.trim(),
      p_type: type[0],
      p_assigned_to: c.user_id,
    });

    if (error) {
      alert.toggle({ text: `Error: ${error.message}`, type: "error" });
    } else {
      alert.toggle({ text: "Successfully addded ticket!", type: "success" });
      reload();
      sidepanel.close();
    }

    setLoading(false);
  }

  return (
    <SidePanelWrapper id="create_ticket">
      <div>
        <div className="text-2xl font-semibold mb-2 flex spbtw aiend">
          <div className="pl-2 border-l-8">Open new ticket</div>
          <Icon name="event" size="2rem" />
        </div>
      </div>
      <div className={loading ? "ppointer-events-none opacity-50" : ""}>
        <div className="my-2 border-t-1"></div>

        <InputTextErrorable
          label="Ticket's title"
          height="h-16"
          placeholder="Insert appointment details here . . ."
          maxLength={64}
          state={title.state}
          error={title.error}
        />

        <div className="h-4"></div>
        <SelectOptions
          label="Ticket's type"
          direction="bottom left"
          width="w-full"
          options={[{ text: "Other services", value: "other" }]}
          state={type}
          closeOnClick
        />

        <div className="h-4"></div>
        <TextArea
          label="Content"
          maxLength={256}
          height="h-48"
          state={content.state}
        />
        {content.error ? (
          <span className="text-error text-xs font-semibold">
            * Please provide a description
          </span>
        ) : (
          ""
        )}

        <div className="h-4"></div>

        <UserSearchInput
          roleFilter={["staff", "manager"]}
          label="Assigned to"
          state={assigned}
        />
      </div>
      <div>
        <SubmitWithLoading
          children="Create tickets"
          loading={loading}
          onClick={createTicket}
        />
      </div>
    </SidePanelWrapper>
  );
}
