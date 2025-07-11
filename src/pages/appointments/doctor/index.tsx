import { Route, Routes } from "react-router";

import DetailsPage from "./details";
import ListPage from "./list";

export default function DoctorAppointmentsPages() {
  return (
    <Routes>
      <Route path="/:id" element={<DetailsPage />} />
      <Route path="/:id/*" element={<DetailsPage />} />

      <Route path="/*" element={<ListPage />} />
    </Routes>
  );
}
