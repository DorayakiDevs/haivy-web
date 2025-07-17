import { useState } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";

import { InputText } from "@components/shared/text";
import { Icon } from "@components/icons/google";
import { Table } from "@components/tables";

import FullscreenLoading from "@pages/others/loading";
import ErrorHandlerPage from "@pages/others/error";

import useNav from "@hooks/useNav";

import { CustomerMedicalDetailsPanel } from "./details";
import { useCustomers } from "./realtime";

export default function StaffPatientsRecordPage() {
  return <StaffPatientsRecordPageNoContext />;
}
function StaffPatientsRecordPageNoContext() {
  const nav = useNav();
  const { id = "" } = useParams();

  const fetcher = useCustomers();
  const query = useState("");

  if (fetcher.loading) {
    return <FullscreenLoading />;
  }

  if (fetcher.error) {
    return <ErrorHandlerPage error={fetcher.error} />;
  }

  function setCurrentId(uid: string) {
    nav(`/records/${uid}`);
  }

  const { customers } = fetcher;

  const filtered = customers.filter((c) =>
    c.full_name.toLowerCase().includes(query[0].toLowerCase())
  );

  return (
    <div className="content-wrapper flex flex-1 pb-4 pr-4">
      <Helmet>
        <title>Haivy | Medical Records</title>
      </Helmet>

      <div className="flex-3 overflow-y-auto mt-2 hide-scrollbar">
        <div className="py-4 mt-4 sticky top-4 bg-base-100 z-2 ">
          <div className="flex aictr gap-4 mb-4">
            <Icon name="medical_information" size="3rem" />
            <div>
              <div className="head-text">Medical Records</div>
              <div>
                Showing {filtered.length} out of {customers.length} patients
              </div>
            </div>
          </div>
          <InputText placeholder="Search for customer . . ." state={query} />
        </div>
        <Table
          list={filtered}
          hideHeader
          onRowClick={(c) => setCurrentId(c.user_id)}
          columns={[
            {
              header: <div className="tactr">Registered Customers</div>,
              render(data) {
                return (
                  <div>
                    <div className="font-semibold">{data.full_name}</div>
                    <div>
                      Birthdate:
                      {data.birth_date ? format(data.birth_date, " yyyy") : "-"}
                    </div>
                  </div>
                );
              },
            },
          ]}
          rowsProps={(c) => ({
            className:
              c.user_id === id
                ? "rounded-r-[0]! bg-primary! text-primary-content!"
                : "rounded-r-[0]!",
          })}
        />
      </div>

      <div className="flex-6 my-4">
        <CustomerMedicalDetailsPanel />
      </div>
    </div>
  );
}
