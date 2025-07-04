import { useEffect, useRef, useState } from "react";
import { useClient } from "..";
import Utility from "../../utils";

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

      const { data, error } = await client.from(table).select("*").limit(50);

      if (error) {
        console.error(`Error fetching ${table}:`, error);
      }
      setRows(data ?? []);

      setLoading(false);
    }

    fetchData();

    return () => {
      setLoading(false);
    };
  }, [timestamp, client]);

  function reload() {
    setTimestamp(Utility.stamp());
  }

  return {
    rows,
    reload,
    timestamp,
    loading,
  };
}
