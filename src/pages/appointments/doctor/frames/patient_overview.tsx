import { differenceInYears, getYear } from "date-fns";

import { Icon } from "@components/icons/google";

import { Frame, InfoRow } from "@pages/appointments/component";

import { getUserAvatar } from "@utils/parser";

import { useAptDetails } from "../details";

export function PatientOverviewFrame() {
  const { details: data } = useAptDetails();
  const { patient } = data;

  const curDate = new Date();
  const birthDate = new Date(patient?.birth_date || "");

  return (
    <Frame>
      <div>Patient information</div>

      <InfoRow
        icon={
          <img
            src={getUserAvatar(patient, true)}
            width={68}
            className="rounded-full"
          />
        }
        name={patient?.full_name}
        desc={
          <div className="flex aictr gap-1 mt-1">
            <Icon name="calendar_month" />
            <div>Born: {getYear(birthDate)}</div>
            <div>-</div>
            <Icon name="cake" />
            <div>Age: {differenceInYears(curDate, birthDate)}</div>
          </div>
        }
        className="mb-0"
      />
    </Frame>
  );
}
