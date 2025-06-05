import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useEffect, useState } from "react";

type Status = "loading" | "error" | "success";

type T_Result<T> =
  | {
      status: "error" | "success" | "loading";
      results: null | T | any;
    }
  | {
      status: "loading";
      results: null;
    }
  | {
      status: "success";
      results: T;
    }
  | {
      status: "error";
      results: any;
    };

type T_RetType<T> = {
  reload(): void;
  timestamp: string;
} & T_Result<T>;

export default function usePostgrestFilter<T = any>(
  func: PostgrestFilterBuilder<any, any, any, T, unknown>
): T_RetType<T> {
  const [results, setResults] = useState<T | any | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  function reload() {
    setTimestamp(new Date().toISOString());
  }

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");

    func
      .abortSignal(controller.signal)

      .then(
        (res) => {
          if (controller.signal.aborted) return;

          setResults(res.data);
          setStatus("success");
        },
        (err: any) => {
          if (controller.signal.aborted) return;

          setResults(err);
          setStatus("error");
        }
      );

    return () => {
      controller.abort();
    };
  }, [timestamp]);

  return { results, status, timestamp, reload };
}

export function getFirstResult<T>(data: T_RetType<T>) {
  return {
    ...data,
    results: Array.isArray(data.results) ? data.results[0] : data.results,
  };
}
