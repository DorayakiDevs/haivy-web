import { useEffect, useRef, useState } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useServices } from "@services/index";

import type { Database } from "types/db.types";

type DBFunctions = Database["public"]["Functions"];
type DBFunction<T extends keyof DBFunctions> =
  Database["public"]["Functions"][T];

type T_RPCHook<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: any };

const getTimestamp = () => new Date().toISOString();

type T_RetType<T extends keyof DBFunctions> = T_RPCHook<
  DBFunction<T>["Returns"]
> & {
  reload(): void;
  timestamp: string;
};

/**
 * RPC (Remote Procedural Call) generic data hooks
 * @param funcName Name of the RPC
 * @param parameter Procedural call parameters
 * @param paused Run condition (Avoid unecessary calls)
 * @returns Results of the RPC call
 */
export function useRPC<T extends keyof DBFunctions>(
  funcName: T,
  parameter?: DBFunction<T>["Args"],
  paused?: boolean
): T_RetType<T> {
  const savePrevData = useRef(false);
  const { client } = useServices();

  const [timestamp, setTimestamp] = useState(getTimestamp());
  const [state, setState] = useState<T_RPCHook<T>>({ status: "idle" });

  function parseThenSet(data: any) {
    try {
      if (data == null) {
        setState({ status: "loading" });
      } else {
        setState({ data, status: "success" });
      }
    } catch {
      setState({
        error: { message: "Cannot parse data sent from server" },
        status: "error",
      });
    }
  }

  function handleError(err: any) {
    setState({ error: err, status: "error" });
  }

  function getStatusStateFunc(status: "idle" | "loading") {
    const preserve = savePrevData.current;
    return (state: T_RPCHook<T>) => {
      if (state.status === "success" && !!state.data && preserve) {
        return { status: status, data: state.data };
      }

      return { status: status };
    };
  }

  const req = JSON.stringify(parameter, null, 0);

  useEffect(() => {
    setState(getStatusStateFunc("idle"));

    if (paused) return;

    const controller = new AbortController();

    if (!funcName) return;

    setState(getStatusStateFunc("loading"));

    client
      .rpc(funcName, parameter)
      .abortSignal(controller.signal)
      .then(
        (res) => parseThenSet(res.data),
        (err) => handleError(err)
      )
      //? Reset data preservation status
      .then(() => (savePrevData.current = false));

    return () => {
      controller.abort();
    };
  }, [funcName, req, paused, timestamp]);

  return {
    ...state,
    reload(savePreviousData = false) {
      setTimestamp(getTimestamp());

      if (state.status !== "success") {
        return;
      }

      if (!state.data) {
        return;
      }

      savePrevData.current = savePreviousData;
    },
    timestamp,
  };
}

export function executeDbRPC<T extends keyof DBFunctions>(
  supabase: SupabaseClient,
  fn: T,
  params: DBFunction<T>
) {
  return supabase.rpc(fn, params);
}
