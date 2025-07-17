import { useEffect, useState } from "react";
import { useParams } from "react-router";

import {
  InputText,
  InputTextErrorable,
  TextArea,
} from "@components/shared/text";

// import { SelectOptions } from "@components/shared/select";
import { Loading } from "@components/icons/loading";
import { Button } from "@components/shared/buttons";

import { useServices } from "@services/index";

import useValidatableState from "@hooks/useValidatableState";
import useUI from "@hooks/useUI";

import { useMedicalInfo, useTestResults } from "./realtime";
import { parseError } from "@utils/parser";
import { SelectOptions } from "@components/shared/select";
import { TestResultsDisplay } from "@components/features/testlab";

const HEAD_CLS = "subhead-text flex aictr gap-16 mb-4";

export function BasicInfo() {
  const { toaster } = useUI();
  const { client } = useServices();
  const { id } = useParams();

  if (!id) return "";

  const fInfo = useMedicalInfo(id);

  //   const vSex = useValidatableState("unspecified");
  const vWeight = useValidatableState("");
  const vHeight = useValidatableState("");
  const vPreg = useValidatableState("");
  const vBlood = useValidatableState("");

  const vAllergies = useValidatableState("");
  const vChronic = useValidatableState("");
  const vSubstance = useValidatableState("");
  const vMental = useValidatableState("");

  const list = [
    // vSex,
    vWeight,
    vHeight,
    vBlood,
    vPreg,
    vAllergies,
    vChronic,
    vSubstance,
    vMental,
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = fInfo.data;

    if (!data) {
      for (const state of list) {
        state.setValue("");
      }

      vPreg.setValue("u");
      return;
    }

    // vSex.setValue(data.sex);
    vPreg.setValueInit(data.sex);
    vWeight.setValueInit(data.weight_kg.toString());
    vHeight.setValueInit(data.height_cm.toString());
    vBlood.setValueInit(data.blood_type);
    vAllergies.setValueInit(data.allergies);
    vChronic.setValueInit(data.chronic_conditions);
    vSubstance.setValueInit(data.substance_use_history);
    vMental.setValueInit(data.mental_health_notes);
    vPreg.setValueInit(
      data.is_pregnant !== null ? (data.is_pregnant ? "y" : "n") : "u"
    );
  }, [fInfo.data, id]);

  if (fInfo.loading) {
    return (
      <div className="content-ctr h-full">
        <Loading size="xl" />
      </div>
    );
  }

  async function submit() {
    if (!id) return;
    if (loading) return;

    setLoading(true);

    const { error } = await client.from("patient_medical_info").upsert(
      [
        {
          height_cm: parseInt(vHeight.current),
          weight_kg: parseInt(vWeight.current),
          blood_type: vBlood.current,
          allergies: vAllergies.current,
          chronic_conditions: vChronic.current,
          substance_use_history: vSubstance.current,
          mental_health_notes: vMental.current,
          patient_id: id,
        },
      ],
      { onConflict: "patient_id" }
    );

    if (error) {
      toaster.error(parseError(error));
    } else {
      toaster.success("Record updated sucessfully!");
    }

    setLoading(false);
  }

  function changed() {
    for (const state of list) {
      if (state.hasChanged()) return true;
    }

    return false;
  }

  function discard() {
    for (const state of list) {
      state.reset();
    }
  }

  return (
    <div className="overflow-y-auto h-full py-4 px-1 pr-4 fade-in">
      <CustomHr>Basic Information</CustomHr>

      <div className="flex gap-8">
        <div className="flex-2 flex aiend">
          <SelectOptions
            label="Is pregnant"
            options={[
              { value: "n", text: "No" },
              { value: "y", text: "Yes" },
              { value: "u", text: "Unknown" },
            ]}
            state={vPreg.state}
            closeOnClick
            direction="bottom left"
            width="w-full"
          />
        </div>
        <div className="flex-2">
          <InputTextErrorable
            label="Weight (kg)"
            placeholder="-"
            state={vWeight.state}
            error={vWeight.error}
          />
        </div>

        <div className="flex-2">
          <InputTextErrorable
            label="Height (cm)"
            placeholder="-"
            state={vHeight.state}
            error={vHeight.error}
          />
        </div>

        <div className="flex-3">
          <InputText label="Boodtype" placeholder="-" state={vBlood.state} />
        </div>
      </div>

      <CustomHr>Medical Conditions</CustomHr>

      <div className="flex gap-8">
        <div className="flex-2">
          <TextArea
            label="Allergies"
            placeholder="No known allergies"
            state={vAllergies.state}
          />
        </div>

        <div className="flex-2">
          <TextArea
            label="Chronic conditions"
            placeholder="No chronic conditions reported"
            state={vChronic.state}
          />
        </div>
      </div>

      <CustomHr>Mental & Behavioral Health</CustomHr>

      <div className="flex gap-8">
        <div className="flex-2">
          <TextArea
            label="Substance usage histories"
            placeholder="No mental health notes"
            state={vSubstance.state}
          />
        </div>

        <div className="flex-2">
          <TextArea
            label="Other mental notes"
            placeholder="No notes provided"
            state={vMental.state}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex jcend aictr py-4">
          <Loading className="mr-8" />
          <Button className="btn-disabled">Updating</Button>
        </div>
      ) : changed() ? (
        <div className="flex jcend py-4 gap-4 fade-in">
          <Button className="btn-soft btn-error" onClick={discard}>
            Discard changes
          </Button>
          <Button color="primary" onClick={submit}>
            Update information
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export function TestRecord() {
  const { id = "" } = useParams();

  const fRecords = useTestResults(id);

  if (fRecords.loading) {
    return (
      <div className="content-ctr h-full">
        <Loading size="xl" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full fade-in">
      {fRecords.data.map((rec) => (
        <TestResultsDisplay results={rec as any} />
      ))}
    </div>
  );
}

function CustomHr({ children }: React.ChildrenProps) {
  return (
    <div className={HEAD_CLS}>
      {children}
      <div className="border-b-1 flex-1 border-base-content/20"></div>
    </div>
  );
}
