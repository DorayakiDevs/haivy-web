import type { React } from "react";
import type { Database } from "./db.types";

declare global {
  namespace Haivy {
    type Table<T extends keyof Database["public"]["Tables"]> =
      Database["public"]["Tables"][T];
  }

  namespace React {
    type JSXProps<T extends keyof React.JSX.IntrinsicElements> =
      React.JSX.IntrinsicElements[T];

    type ChildrenProps = {
      children: ?React.ReactNode;
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
}
