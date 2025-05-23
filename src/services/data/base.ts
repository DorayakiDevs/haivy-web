import { useEffect, useState } from "react";

import { useClient } from "@services/client";

type T_RPCHook<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: any };

const getTimestamp = () => new Date().toISOString();

/**
 *
 * @param funcName Name of the RPC (Remote Procedural Call)
 * @param parameter Procedural prameters
 * @param paused Run condition (Avoid unecessary calls)
 * @returns
 */
export function useRPC<T>(
  funcName: string,
  parameter?: Record<string, string>,
  paused?: boolean
) {
  const { supabase } = useClient();

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

  const req = JSON.stringify(parameter, null, 0);

  useEffect(() => {
    setState({ status: "idle" });

    if (paused) return;

    const controller = new AbortController();

    if (!funcName) return;

    setState({ status: "loading" });

    supabase
      .rpc(funcName, parameter)
      .abortSignal(controller.signal)
      .then(
        (res) => parseThenSet(res.data),
        (err) => handleError(err)
      );

    return () => {
      controller.abort();
    };
  }, [funcName, req, paused, timestamp]);

  return {
    ...state,
    reload() {
      setTimestamp(getTimestamp());
    },
    timestamp,
  };
}
