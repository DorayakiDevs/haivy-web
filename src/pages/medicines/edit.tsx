import { useEffect, useState } from "react";

import { InputTextErrorable, TextAreaErrorable } from "@components/shared/text";
import { Button } from "@components/shared/buttons";
import { Icon } from "@components/icons/google";

import { useServices } from "@services/index";

import useValidatableState from "@hooks/useValidatableState";
import useUI from "@hooks/useUI";

import { validateNonNegativeInteger } from "@utils/validator";
import { parseError } from "@utils/parser";

import { usePageContext } from ".";

export function EditInfomationDialog({ dialogRef }: any) {
  const { client } = useServices();
  const { toaster } = useUI();

  const [loading, setLoading] = useState(false);
  const { curMed } = usePageContext();

  const vName = useValidatableState("");
  const vDesc = useValidatableState("");
  const vNote = useValidatableState("");
  const vDosage = useValidatableState("", validateNonNegativeInteger);
  const vUnit = useValidatableState("");

  const MED_ID = curMed?.id || null;

  useEffect(() => {
    if (!MED_ID) return;

    const { name, description, consumption_note, dosage, unit } = curMed!;

    vName.setValue(name);
    vDesc.setValue(description);
    vNote.setValue(consumption_note);
    vDosage.setValue(dosage + "");
    vUnit.setValue(unit);
  }, [MED_ID]);

  if (!curMed) {
    return (
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box content-ctr coll p-12 gap-8">
          <div className="text-4xl font-bold">404</div>
          Sorry but we could not find what you are looking for
          <form method="dialog">
            <Button className="btn-primary btn-outline">Close</Button>
          </form>
        </div>
      </dialog>
    );
  }

  async function submit() {
    if (loading) return;
    if (!MED_ID) return;

    let failed = false;
    const vals = [vName, vDesc, vNote, vDosage, vUnit];

    for (const val of vals) {
      failed = !val.validate() || false;
    }

    if (failed) return;

    setLoading(true);

    const { error } = await client.rpc("update_medicine", {
      p_id: MED_ID,
      p_consumption_note: vNote.current,
      p_description: vDesc.current,
      p_is_available: true,
      p_name: vName.current,
      p_dosage: parseInt(vDosage.current),
      p_unit: vUnit.current,
    });

    if (error) {
      toaster.error(parseError(error));
    } else {
      toaster.success("Medicine information saved!");
    }

    setLoading(false);
  }

  function close() {
    dialogRef.current?.close();
  }

  function stopPropa(e: any) {
    e.stopPropagation();
  }

  return (
    <dialog className="modal" ref={dialogRef} onClick={close}>
      <div className="modal-box flex coll gap-4" onClick={stopPropa}>
        <h3 className="font-bold text-lg mb-4 flex gap-4">
          <Icon name="edit" /> Edit medicine information
        </h3>

        <InputTextErrorable
          label="Name - Format: Name (Sub 1, Sub 2, Sub 3, ...)"
          state={vName.state}
          error={vName.error}
        />

        <TextAreaErrorable
          label="Description"
          maxLength={512}
          state={vDesc.state}
          error={vDesc.error}
        />

        <InputTextErrorable
          label="Consumption note"
          state={vNote.state}
          error={vNote.error}
        />

        <div className="flex aictr gap-4">
          <div className="flex-1">
            <InputTextErrorable
              label="Dosage"
              state={vDosage.state}
              error={vDosage.error}
            />
          </div>
          <div className="flex-1">
            <InputTextErrorable
              label="Unit"
              state={vUnit.state}
              error={vUnit.error}
            />
          </div>
        </div>

        <div className="modal-action flex coll gap-2">
          <form method="dialog">
            <Button className="btn-ghost w-full">Close</Button>
          </form>
          <Button
            className="btn-primary btn-outline"
            onClick={submit}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </div>
    </dialog>
  );
}
