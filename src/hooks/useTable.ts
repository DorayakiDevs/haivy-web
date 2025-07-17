import { useEffect, useState } from "react";

import { useClient } from "@services";
import { stamp } from "@utils/date";

export function useTable<T>(table: string) {
  const client = useClient();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<T[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    setTimestamp(null);
    setRows([]);
  }, [table]);

  useEffect(() => {
    if (!timestamp || !client) {
      return;
    }

    async function fetchData() {
      setLoading(true);

      const { data, error } = await client
        .from(table as any)
        .select("*")
        .limit(50);

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        setRows([]);
      } else {
        setRows(data as any);
      }

      setLoading(false);
    }

    fetchData();

    return () => {
      setLoading(false);
    };
  }, [timestamp, client]);

  function reload() {
    setTimestamp(stamp());
  }

  return {
    rows,
    reload,
    timestamp,
    loading,
  };
}
