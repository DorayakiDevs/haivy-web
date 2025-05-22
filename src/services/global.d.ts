import type { Database } from "db.types";

export type DatabaseColType<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
