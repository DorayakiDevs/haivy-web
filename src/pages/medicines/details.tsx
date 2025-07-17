import { useEffect, useRef } from "react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";

import { IconButton } from "@components/shared/buttons";
import { Icon } from "@components/icons/google";

import { useServices } from "@services/index";

import useValidatableState from "@hooks/useValidatableState";

import { includesAny, validateFullName } from "@utils/validator";

import { usePageContext } from ".";
import { EditInfomationDialog } from "./edit";

export function MedicationDetailsPanel() {
  const { auth } = useServices();
  const roles = auth.userDetails?.roles || [];

  const hasEditRights = includesAny(roles, ["admin", "manager"]);

  const imageRef = useRef<HTMLDialogElement | null>(null);
  const editRef = useRef<HTMLDialogElement | null>(null);

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
    return <NotFound />;
  }

  function openImage() {
    imageRef.current?.showModal();
  }

  function openEdit() {
    if (!hasEditRights) return;
    editRef.current?.show();
  }

  const chemName = curMed.commercialName;
  const medsName = curMed.supplNames.join(", ");

  const description = curMed.description?.split("\\n").join("\n\n");

  return (
    <div className="flex coll gap-2 key-fade-in" key={curMedId}>
      <Helmet>
        <title>Haivy | Medicine - {chemName}</title>
      </Helmet>
      <div className="mb-2 flex aictr">
        <div className="selectable-text flex-1">
          <div>Medicine details</div>
          <div className="text-2xl font-bold text-wrap">{chemName}</div>
          {!medsName || <div className="text-sm">{medsName}</div>}
        </div>

        <div>
          {!hasEditRights || (
            <IconButton
              title="Edit info"
              icon="edit"
              dir="left"
              onClick={openEdit}
            />
          )}
        </div>
      </div>

      <div className="flex coll flex-1">
        <div
          className="h-64 w-full bg-cover bg-center border-2 rounded-box relative hover-wrapper"
          style={{
            borderColor: "#00000022",
            backgroundImage: `url('${curMed.image_url}'), url('${Constant.IMG_PLACEHOLDER}')`,
          }}
        >
          <div className="absolute bottom-2 right-2 show-on-hover">
            <button
              className="btn btn-primary btn-outline btn-square"
              onClick={openImage}
            >
              <Icon name="zoom_out_map" />
            </button>
          </div>
        </div>

        <div className="badge badge-primary badge-lg my-4 rounded-md">
          {curMed.dosage || "-"} {curMed.unit}
        </div>

        <div className="flex-1 flex coll gap-8 text-md selectable-text">
          <div className="badge-primary badge h-fit p-6 w-full">
            <div className="px-4">
              <Icon name="info" size="2.4em" />
            </div>
            <div className="pr-2 flex-1">
              <h4 className="font-semibold">Usage guide</h4>
              <div className="text-wrap">{curMed.consumption_note}</div>
            </div>
          </div>

          <div
            className="text-wrap text-justify pr-4"
            style={{ lineHeight: 1.75 }}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
          </div>
        </div>

        <div className="h-16"></div>
      </div>

      <ImageViewer dialogRef={imageRef} />
      <EditInfomationDialog dialogRef={editRef} />
    </div>
  );
}

function ImageViewer({ dialogRef }: any) {
  const { curMedId, medicines } = usePageContext();

  const curMed = medicines.find((med) => med.id === curMedId);

  function closeDialog() {
    dialogRef.current?.close();
  }

  if (!curMed) return;

  return (
    <dialog
      className="modal flex aictr jcctr"
      ref={dialogRef}
      onClick={closeDialog}
    >
      <div className="flex aiart jcctr modal-box max-w-none bg-[#0000] shadow-none">
        <div className="mx-4 my-2">
          <button className="btn btn-primary btn-square" onClick={closeDialog}>
            <Icon name="close" />
          </button>
        </div>
        <div>
          <div className="bg-base-100 rounded-xl overflow-hidden flex jcctr">
            <img
              src={curMed.image_url || ""}
              alt={curMed.name}
              style={{ maxHeight: "calc(100vh - 16rem)" }}
            />
          </div>
          <div className="badge badge-primary w-full my-2">{curMed.name}</div>
        </div>
      </div>
    </dialog>
  );
}

function NotFound() {
  return (
    <div className="flex coll aictr jcctr gap-8 h-full">
      <Icon name="pill_off" size="5rem" />

      <div className="text-3xl font-bold">Ooops!</div>

      <div className="text-md">Sorry but we could not found what you need</div>
    </div>
  );
}
