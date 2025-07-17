import type { React } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./db.types";

declare global {
  namespace Haivy {
    type Client = SupabaseClient<Database>;

    type Table<T extends keyof Database["public"]["Tables"]> =
      Database["public"]["Tables"][T];

    type Enum<T extends keyof Database["public"]["Enums"]> =
      Database["public"]["Enums"][T];

    type DBRow<T extends keyof Database["public"]["Tables"]> =
      Database["public"]["Tables"][T]["Row"];

    type DBFunc<T extends keyof Database["public"]["Functions"]> =
      Database["public"]["Functions"][T];

    type User = DBRow<"user_details">;
    type Appointment = DBRow<"appointment">;
    type Regimen = DBRow<"regimens">;
    type Medicine = DBRow<"medicines">;
    type Ticket = DBRow<"ticket">;
    type TestResults = DBRow<"test_results">;
    type TestType = DBRow<"tests">;
  }

  namespace React {
    type JSXProps<T extends keyof React.JSX.IntrinsicElements> =
      React.JSX.IntrinsicElements[T];

    type ChildrenProps = {
      children?: React.ReactNode;
    };

    type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];
  }

  namespace Style {
    type Color =
      | "neutral"
      | "primary"
      | "secondary"
      | "accent"
      | "info"
      | "success"
      | "warning"
      | "error";

    type Direction = "left" | "right" | "top" | "bottom";
    type Size = "xs" | "sm" | "md" | "lg" | "xl";
  }

  namespace Constant {
    const IMG_PLACEHOLDER: string;
  }
}
