import { Icon } from "@components/icons/google";
import { Loading } from "@components/icons/loading";
import { Button } from "@components/shared/buttons";
import { InputText } from "@components/shared/text";
import { useServices } from "@services/index";
import { useEffect, useState } from "react";

export function MedicineRow() {
  return (
    <div className="bg-base-200 flex aictr spbtw h-18 p-2 pr-6 mb-4 rounded-box gap-2">
      <div className="h-full aspect-square rounded-box bg-blue-400"></div>

      <div className="flex-1">
        <div className="text-md font-semibold">Medicine name</div>
        <div className="flex aictr gap-4 text-xs">
          <div className="flex aictr gap-1">
            <Icon name="assignment" size="1.2rem" />
            ATP
          </div>
          <div className="flex aictr gap-1">
            <Icon name="percent" size="1.2rem" />
            100% pills taken
          </div>
          <div>
            <Icon name="" />
          </div>
        </div>
      </div>
      <Button className="rounded-full" size="sm">
        <Icon name="undo" />
        Undo?
      </Button>
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
