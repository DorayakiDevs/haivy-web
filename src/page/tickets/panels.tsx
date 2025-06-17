import { useState } from "react";

import { InputTextErrorable } from "@components/base/input";
import { SelectOptions } from "@components/base/select";
import { UserSearchInput } from "@components/users";
import { Icon } from "@components/icons";

import { SidePanelWrapper } from "@context/ui/sidepanel";
import { SubmitWithLoading } from "@components/base/button";

export function TicketCreationPanel() {
  const [loading, setLoading] = useState(false);

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

        <div className="my-2">
          <InputTextErrorable
            label="Appointment's details"
            height="h-16"
            placeholder="Insert appointment details here . . ."
            maxLength={64}
          />
          <InputTextErrorable
            label="Service"
            height="h-16"
            placeholder="Appointment's service"
            maxLength={32}
          />
        </div>

        <div className="flex aiend gap-4 my-2">
          <SelectOptions
            label="Duration"
            direction="bottom right"
            width="w-70"
            closeOnClick
          />
        </div>

        <div className="my-2">
          <UserSearchInput label="Assigned doctor" roleFilter={["doctor"]} />
        </div>
      </div>
      <div>
        <SubmitWithLoading text="Create appointment" loading={loading} />
      </div>
    </SidePanelWrapper>
  );
}
