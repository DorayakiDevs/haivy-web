import { SlidePanelWrapper } from "@components/modals/slidepanel";

import StaffTickets from "./staff";
import TicketDetailsPanel from "./details";

export default function TicketPages() {
  return (
    <>
      <SlidePanelWrapper className="w-[80%]" path="/:id">
        <TicketDetailsPanel />
      </SlidePanelWrapper>

      <StaffTickets />
    </>
  );
}
