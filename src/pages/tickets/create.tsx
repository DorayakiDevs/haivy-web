import { useState } from "react";

import { InputTextErrorable, TextArea } from "@components/shared/text";
import { SidePanelWrapper } from "@components/modals/sidepanel";
import { SelectOptions } from "@components/shared/select";
import { Button } from "@components/shared/buttons";
import { Icon } from "@components/icons/google";

import { useServices } from "@services";

import { useValidatableState } from "@hooks/useValidatableState";
import useUI from "@hooks/useUI";

import { validateNotEmpty } from "@utils/validator";

export function TicketCreationPanel() {
  const { toaster, sidePanel } = useUI();

  const { client } = useServices();
  const [loading, setLoading] = useState(false);

  const title = useValidatableState("", validateNotEmpty);
  const content = useValidatableState("", validateNotEmpty);

  const type = useState<"other">("other");

  async function createTicket() {
    const a = title.validate();
    const b = content.validate();

    if (!a || !b) return;

    setLoading(true);

    const { error } = await client.rpc("create_ticket", {
      p_title: title.current,
      p_content: content.current.trim(),
      p_type: type[0],
    });

    if (error) {
      toaster.error(`Error: ${error.message}`);
    } else {
      toaster.success("Successfully addded ticket!");
      sidePanel.close();
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
          label="Subject"
          height="h-16"
          placeholder="Ticket's subject . . ."
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
          label="Description"
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

        {/* <UserSearchInput
          roleFilter={["staff", "manager"]}
          label="Assigned to"
          state={assigned}
        /> */}
      </div>
      <div>
        <Button
          className="w-full btn-outline"
          loading={loading}
          color="primary"
          onClick={createTicket}
        >
          Create tickets
        </Button>
      </div>
    </SidePanelWrapper>
  );
}
