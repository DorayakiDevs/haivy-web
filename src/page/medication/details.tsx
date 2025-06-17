import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";

import { Icon } from "@components/icons";

import { useValidatableState } from "@hooks/validator";

import { validateFullName } from "@utils/validator";

import { usePageContext } from ".";

export function MedicationDetailsPanel() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const { medicines, curMedId } = usePageContext();

  const nameState = useValidatableState("", validateFullName);
  const usageState = useValidatableState("");

  useEffect(() => {
    const med = medicines.find((med) => med.id === curMedId);
    if (!med) return;

    nameState.setValue(med.name);
    usageState.setValue(med.consumption_note || "");
  }, [curMedId]);

  const curMed = medicines.find((med) => med.id === curMedId);

  if (!curMed) {
    return (
      <div className="flex coll aictr jcctr gap-8 h-full">
        <Icon name="pill_off" size="5rem" />

        <div className="text-3xl font-bold">Ooops!</div>

        <div className="text-md">
          Sorry but we could not found what you need
        </div>
      </div>
    );
  }

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  const chemName = curMed.commercialName;
  const medsName = curMed.supplNames.join(", ");

  const description = curMed.description?.split("\\n").join("\n\n");

  return (
    <div className="flex coll gap-2 h-full key-fade-in" key={curMedId}>
      <Helmet>
        <title>Haivy | Medicine - {chemName}</title>
      </Helmet>
      <div className="selectable-text">
        <div>Medicine details</div>
        <div className="text-2xl font-bold text-wrap">{chemName}</div>
        {!medsName || <sub>{medsName}</sub>}
      </div>

      <div className="flex coll flex-1">
        <div
          className="h-[248px] w-full flex jcctr border-2 rounded-xl relative hover-wrapper"
          style={{ borderColor: "#00000022" }}
        >
          <img
            src={curMed.image_url || Constant.IMG_PLACEHOLDER_URL}
            alt={curMed.name}
            className="h-full"
          />

          <div className="absolute bottom-2 right-2 show-on-hover">
            <button
              className="btn btn-primary btn-outline btn-square"
              onClick={openDialog}
            >
              <Icon name="zoom_out_map" />
            </button>
          </div>
        </div>

        <div className="flex-1 mt-8 flex coll gap-8 text-md selectable-text">
          <div className="bg-primary text-primary-content py-4 shadow-md flex aictr rounded-lg">
            <div className="flex aictr jcctr w-20">
              <Icon name="info" size="2.4em" />
            </div>
            <div className="pr-2">
              <h4 className="font-semibold">Usage guide</h4>
              <p className="text-wrap">{curMed.consumption_note}</p>
            </div>
          </div>

          <p className="text-wrap" style={{ lineHeight: 1.75 }}>
            <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
          </p>
        </div>

        <div className="h-[72px]"></div>
      </div>

      <dialog
        className="modal flex aictr jcctr"
        ref={dialogRef}
        onClick={closeDialog}
      >
        <div className="flex aiart jcctr modal-box max-w-none bg-[#0000] shadow-none">
          <div className="mx-4 my-2">
            <button className="btn btn-primary btn-square" onClick={openDialog}>
              <Icon name="close" />
            </button>
          </div>
          <div>
            <div className="bg-base-100 rounded-xl overflow-hidden flex jcctr">
              <img
                src={curMed.image_url || Constant.IMG_PLACEHOLDER_URL}
                alt={curMed.name}
                style={{
                  maxHeight: "calc(100vh - 16rem)",
                }}
              />
            </div>
            <div className="text-base-100 text-md">{curMed.name}</div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
