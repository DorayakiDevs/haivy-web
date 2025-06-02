export type Appointment = {
  status: AppointmentStatus;
  content: string;
  visible: boolean;
  duration: number;
  staff_id: string;
  ticket_id: string;
  patient_id: string;
  created_date: string;
  meeting_date: string;
  patient_info: PatientInfo;
  appointment_id: string;
};

interface PatientInfo {
  dob: any;
  last_name: any;
  account_id: string;
  first_name: any;
  patient_id: string;
  account_uid: string;
  account_type: string;
  profile_picture: any;
  anonymous_status: boolean;
}

export type AppointmentStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "canceled"
  | "no_show"
  | null;
