import { Icon } from "@components/icons/google";
import { Loading } from "@components/icons/loading";
import { Button } from "@components/shared/buttons";
import { InputText } from "@components/shared/text";
import { useServices } from "@services/index";
import { useEffect, useState } from "react";

type T_Data =
  Haivy.DBFunc<"get_medication_schedule_for_authenticated_user">["Returns"][0];

export function MedicineRow({ data }: { data: T_Data }) {
  const { client } = useServices();
  const { medicine, id } = data;

  const [taken, setTaken] = useState(data.taken);
  const [loading, setLoading] = useState(false);

  async function markMedicineAs(t = false) {
    setLoading(true);

    const { error } = await client
      .from("medicine_schedule")
      .update({ taken: t })
      .eq("id", id);

    setLoading(false);

    if (error) {
      console.error("Error updating record:", error);
      return null;
    }

    setTaken(t);
  }

  return (
    <div className="bg-base-200 flex aictr spbtw h-18 p-2 pr-6 mb-4 rounded-box gap-2">
      <div
        className="h-full aspect-square rounded-box bg-cover"
        style={{
          backgroundImage: `url('${medicine.image_url}')`,
        }}
      ></div>

      <div className="flex-1">
        <div className="text-md font-semibold">{medicine.name}</div>
        <div className="flex aictr gap-4 text-xs">
          <div className="flex aictr gap-1 capitalize w-24">
            <Icon name="event" size="1.2rem" />
            {data.take_at}
          </div>
          <div className="flex aictr gap-1">
            <Icon name="note" size="1.2rem" />
            {data.medicine.consumption_note}
          </div>
        </div>
      </div>
      {taken ? (
        <>
          <Button
            className="rounded-full"
            size="sm"
            onClick={() => markMedicineAs(false)}
            loading={loading}
          >
            <Icon name="undo" />
            Undo?
          </Button>
          <Icon
            name="check_circle"
            color="var(--color-primary)"
            size="1.7rem"
          />
        </>
      ) : (
        <Button
          className="rounded-full btn-outline"
          color="primary"
          size="sm"
          onClick={() => markMedicineAs(true)}
          loading={loading}
        >
          Mark as taken
        </Button>
      )}
    </div>
  );
}

export function MedicineQueryInput(props: {
  state?: React.State<Haivy.Medicine | null>;
}) {
  const { client } = useServices();

  const local = useState<Haivy.Medicine | null>(null);
  const [data, setData] = props.state || local;

  const query = useState("");
  const [list, setList] = useState<Haivy.Medicine[]>([]);

  const [curIndex, setCurIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const __q = query[0].toLowerCase().trim();

  function handleKeyDown(e: React.KeyboardEvent) {
    const { key } = e;

    switch (key) {
      case "ArrowDown": {
        setCurIndex((i) => (i + 1 >= list.length ? 0 : i + 1));
        break;
      }

      case "ArrowUp": {
        setCurIndex((i) => (i - 1 < 0 ? list.length - 1 : i - 1));
        break;
      }

      case "Enter": {
        const med = list[curIndex];
        if (!med) return;

        setData(med);
        return;
      }
    }
  }

  useEffect(() => {
    const c = new AbortController();

    setLoading(true);
    client
      .rpc("query_medicines", { query: __q, _limit: 8 })
      .abortSignal(c.signal)
      .then(({ data, error }) => {
        if (c.signal.aborted) return;

        if (error) {
          setList([]);
          return;
        }

        setList(data as any);
        setLoading(false);
      });

    return () => {
      c.abort();
    };
  }, [__q]);

  return (
    <div className="relative dropdown w-full">
      <InputText
        placeholder="Search for medicines"
        label="Add medicines to list"
        onKeyDown={handleKeyDown}
        state={data ? [data?.name, () => setData(null)] : query}
      />
      <ul className="menu dropdown-content bg-base-200 rounded-box w-full shadow-xl">
        {loading ? (
          <Loading type="spinner" className="mx-auto my-8" />
        ) : list.length ? (
          list.map((med, index) => {
            const active = index === curIndex;

            return (
              <li onClick={() => setData(med)}>
                <a className={"flex gap-4 " + (active ? "menu-active" : "")}>
                  <div
                    className="h-12 w-12 bg-cover rounded-box"
                    style={{
                      backgroundImage: `url(${med.image_url}), url(${Constant.IMG_PLACEHOLDER})`,
                    }}
                  ></div>
                  <div>
                    <div className="font-medium">{med.name}</div>
                    <div className="">{med.consumption_note}</div>
                  </div>
                </a>
              </li>
            );
          })
        ) : (
          <div className="mx-auto my-8">
            Cannot find medicine (Searching for '{__q}')
          </div>
        )}
      </ul>
    </div>
  );
}
