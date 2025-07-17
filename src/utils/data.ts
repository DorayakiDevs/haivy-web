type T_Data = Record<string, string | undefined>;

export const StatusColor: T_Data = {
  pending: "#cca700",
  approved: "#10b981",
  cancelled: "#d80000",

  completed: "#047857",
  scheduled: "#1d4ed8",
  in_progress: "#ff623c",
};

export const StatusIcons: T_Data = {
  pending: "pending",
  approved: "check_circle",
  cancelled: "cancel",
};

export const ActionMessages: T_Data = {
  create: "assigned to the ticket",
  forward: "forwarded the ticket",
  cancel: "closed the ticket",
  approve: "closed the ticket",
  other: "performed an unspecified action",
  appointment_update: "updated the appointment details",
  edit: "editted the ticket information",
  update: "made an update",
};

export const ActionIcons: T_Data = {
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

export const ActionColor: T_Data = {
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

export const TicketTypeColor: T_Data = {
  appointment: "#3ABFF8",
};
