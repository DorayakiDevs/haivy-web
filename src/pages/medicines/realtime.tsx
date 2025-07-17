import { useServices } from "@services/index";
import { useEffect } from "react";

export function useMedicinesRealtime(
  ...callbacks: ((updated: Haivy.Medicine) => void)[]
) {
  const { client } = useServices();

  useEffect(() => {
    const channel = client
      .channel("public:medicines")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medicines",
        },
        (payload) => {
          console.log("Change received!", payload);

          for (const callback of callbacks) {
            callback(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);
}
