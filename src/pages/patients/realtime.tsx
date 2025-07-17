import { useServices } from "@services/index";
import { PostgrestError } from "@supabase/supabase-js";
import { stamp } from "@utils/date";
import { useEffect, useState } from "react";

type T_Data = Haivy.User[];

export function useCustomers() {
  const { client } = useServices();

  const [customers, setCustomers] = useState<T_Data>([]);
  const [error, setError] = useState<null | PostgrestError>(null);

  const [loading, setLoading] = useState(false);
  const [_stamp, setStamp] = useState(stamp());

  useEffect(() => {
    const c = new AbortController();

    setLoading(true);

    //? Reset if not save
    if (!_stamp.endsWith("-d")) {
      setCustomers([]);
      setLoading(true);
    }

    setError(null);

    client
      .rpc("get_all_customers")
      .abortSignal(c.signal)
      .then(({ error, data }) => {
        if (c.signal.aborted) return;

        setError(error);
        setCustomers(data ?? []);
        setLoading(false);
      });

    return () => {
      c.abort();
    };
  }, [_stamp]);

  function reload(save?: [boolean]) {
    setStamp(stamp() + (save ? "-d" : ""));
  }

  return { customers, error, reload, loading };
}

export function useMedicalInfo(id: string) {
  const { client } = useServices();

  const [data, setData] = useState<Haivy.DBRow<"patient_medical_info"> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [_stamp, setStamp] = useState(stamp());

  useEffect(() => {
    if (!id) return;

    const c = new AbortController();

    setLoading(true);

    if (!_stamp.endsWith("-d")) {
      setData(null);
      setLoading(true);
    }

    client
      .from("patient_medical_info")
      .select("*")
      .eq("patient_id", id)
      .abortSignal(c.signal)
      .then(({ data }) => {
        if (c.signal.aborted) return;

        setData(data ? data[0] ?? null : null);
        setLoading(false);
      });

    return () => {
      c.abort();
    };
  }, [_stamp, id]);

  function reload(save?: [boolean]) {
    setStamp(stamp() + (save ? "-d" : ""));
  }

  return { data, reload, loading };
}

type T_TestResults = { test_type: Haivy.DBRow<"tests"> } & Omit<
  Haivy.DBRow<"test_results">,
  "test_type"
>;

export function useTestResults(id: string) {
  const { client } = useServices();

  const [data, setData] = useState<T_TestResults[]>([]);
  const [loading, setLoading] = useState(false);
  const [_stamp, setStamp] = useState(stamp());

  useEffect(() => {
    if (!id) return;

    const c = new AbortController();

    setLoading(true);

    if (!_stamp.endsWith("-d")) {
      setData([]);
      setLoading(true);
    }

    client.rpc("get_all_tests_for_authenticated_user");

    return () => {
      c.abort();
    };
  }, [_stamp, id]);

  function reload(save?: [boolean]) {
    setStamp(stamp() + (save ? "-d" : ""));
  }

  return { data, reload, loading };
}
