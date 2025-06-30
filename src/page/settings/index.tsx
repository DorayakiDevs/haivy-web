import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { InputTextErrorable } from "@components/base/input";
import { LTRLoadingBar } from "@components/base/others";
import { DatePicker } from "@components/base/date";
import { Icon } from "@components/icons";

import { executeDbRPC } from "@services/rpc/base";
import { useClient } from "@services/client";

import { useUIContext } from "@context/ui";

import { useValidatableState } from "@hooks/validator";

import { FullscreenLoading } from "@pages/others/loading";

import { DateUtils } from "@utils/date";
import { Parser } from "@utils/parser";

function updateImageProfile(token: string, file: File | null) {
  const EDIT_URL =
    "https://vsmrpwbcgkvznymcfuho.supabase.co/functions/v1/image";

  const formData = new FormData();
  if (file) {
    formData.append("image_file", file);
  }

  return axios.post(EDIT_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

export default function SettingsPage() {
  const { alert } = useUIContext();
  const defValRef = useRef<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  function notImplemented() {
    alert.toggle({
      text: "This function is not ready! Sorry for your inconvenience!",
      type: "info",
    });
  }

  const { account, session, supabase } = useClient();
  const { user } = session || {};

  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleFileChange() {
    const file = inputRef.current?.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  }

  function cancelCrop() {
    setImageFile(null);
    setImagePreview(null);
  }

  const name = useValidatableState("");
  const email = useValidatableState("");
  const password = useValidatableState("");
  const bday = useValidatableState("");
  // const phone = useValidatableState("");

  function refreshProfileAsChangesAreApplied() {
    defValRef.current = {
      name: name.current,
      // phone: phone.current,
      bday: bday.current,
    };
  }

  useEffect(() => {
    if (!account) return;
    if (!user) return;

    name.setValue(account.full_name);
    email.setValue(user.email || "");
    password.setValue("************");
    bday.setValue(account.birth_date || "");
    // phone.setValue(user.phone || "");

    defValRef.current = {
      name: account.full_name,
      phone: user.phone || "",
      bday: account.birth_date || "",
    };
  }, [account, user]);

  const defVal = defValRef.current;

  const diffName = name.current !== defVal.name;
  const diffBday = bday.current !== defVal.bday;
  // const diffPhone = phone.current !== defVal.phone;
  const infoHasChanges = diffName || diffBday; //|| diffPhone;

  function discardChanges() {
    name.setValue(defVal.name);
    bday.setValue(defVal.bday);
    // phone.setValue(defVal.phone);
  }

  async function saveProfileImage() {
    const token = session?.access_token;
    if (!token) return;

    try {
      alert.toggle({ text: "Updating your profile image!", duration: 1e6 });
      const res = await updateImageProfile(token, imageFile);

      console.log(res.data);

      alert.toggle({
        text: "Profile image uploaded! This may some time to take effect",
        type: "success",
      });
      setImageFile(null);
    } catch (e) {
      alert.toggle({
        text: "An error occured while updating your profile!",
        type: "error",
      });

      console.error(e);
    }
  }

  async function saveChanges() {
    try {
      if (!session) return;
      if (!account) return;

      setLoading(true);

      const { error } = await executeDbRPC(supabase, "edit_user_details", {
        p_birth_date: bday.current,
        p_full_name: name.current,
        p_user_id: account.user_id,
      });

      if (error) throw error;

      alert.toggle({ text: "Your profile has been saved", type: "success" });
      refreshProfileAsChangesAreApplied();

      setLoading(false);
    } catch (e: any) {
      alert.toggle({
        text: "An error occured while updating your profile!",
        type: "error",
      });

      console.error(e);
      setLoading(false);
    }
  }

  function uploadImage() {
    inputRef.current?.click();
  }

  if (!account) {
    return (
      <div className="h-full flex jcctr aictr coll gap-10">
        <FullscreenLoading />
      </div>
    );
  }

  return (
    <div className="h-full pt-10 fade-in pr-8 overflow-y-auto pb-24 key-fade-in">
      <input
        className="hidden"
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <div className="mb-4">
        <div className="flex aictr gap-4">
          <Icon name="account_circle" size="3.75rem" />
          <div>
            <div className="font-bold text-2xl">Account Preferences</div>
            <div className="mt-1">
              Manage your personal information, login details, and preferences.
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full spbtw gap-12">
        <div className="flex-1 max-w-270">
          <SectionHeader
            icon="badge"
            title="General information"
            description="Basic details about your profile and contact information"
          />
          <div className="flex gap-8 pl-2">
            <div className="w-59 tactr">
              <div className="relative rounded-xl overflow-hidden">
                <div
                  style={{ backgroundImage: Parser.getUserAvatar(account) }}
                  className="w-full aspect-square bg-cover bg-center"
                ></div>
                <div
                  className="absolute w-full h-full bg-[#0005] top-0 left-0 show-on-hover z-1 flex aictr jcctr cursor-pointer"
                  onClick={uploadImage}
                >
                  <div className="flex aictr coll text-white gap-8">
                    <Icon name="edit" size="4rem" />
                    <div>Edit your profile image</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="infomation flex gap-8 flex-1">
              <div className="flex coll gap-2 w-full">
                <InputTextErrorable
                  label="Full name"
                  icon="id_card"
                  state={name.state}
                />
                {/* <InputTextErrorable
                  label="Phone number"
                  icon="phone"
                  placeholder="No phone number provided"
                  state={phone.state}
                /> */}
                <DatePicker
                  label="Birthdate"
                  state={[new Date(bday.current), () => {}]}
                  onChange={(d) =>
                    bday.setValue(DateUtils.format(d, "yyyy-MM-dd"))
                  }
                  dateOnly
                />
              </div>
            </div>
          </div>

          <div className="h-4"></div>

          <SectionHeader
            icon="shield_lock"
            title="Credential & Security"
            description="Control your login credentials and security settings"
          />
          <div className="w-full flex coll gap-5 pl-2">
            <div className="flex w-full aiend gap-8">
              <div className="w-full">
                <InputTextErrorable
                  label="Email address"
                  icon="Email"
                  state={email.state}
                  readOnly
                />
              </div>

              <button className="btn btn-error w-64" onClick={notImplemented}>
                Request email change
              </button>
            </div>
            <div className="flex w-full aiend gap-8">
              <div className="w-full">
                <InputTextErrorable
                  label="Password"
                  icon="key"
                  type="password"
                  state={password.state}
                  readOnly
                  disabled
                />
              </div>
              <button className="btn btn-soft btn-error w-64">
                Change password
              </button>
            </div>
          </div>
        </div>
        <div className="w-110">
          <SecurityTipsCard />
          <div className="h-8"></div>
          <CommingSoon />
          <div className="h-8"></div>
          {/* <DVDLogo /> */}
        </div>
      </div>

      {!infoHasChanges || (
        <div className="fixed bottom-4 left-0 w-full flex jcctr key-fade-in">
          <div className="alert alert-warning gap-2 py-2">
            <Icon name="info" size="2rem" />
            <div className="pr-8 font-semibold">
              {loading
                ? "Saving your changes . . ."
                : "Careful, you have unsaved changes!"}
            </div>
            {loading ? (
              <LTRLoadingBar height={4} width="w-16" />
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={saveChanges}>
                  Save changes
                </button>
                <button className="btn btn-warning" onClick={discardChanges}>
                  Discard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!imageFile || !imagePreview || (
        <div className="fixed top-0 left-0 w-full h-full z-10 bg-[#0008] flex aictr jcctr">
          <div className="py-5 px-7 bg-base-200 rounded-box">
            <div className="text-xl font-bold mb-4 mt-2">Upload image</div>
            <div className="border-1 border-dashed rounded-box overflow-hidden">
              <div
                className="w-100 h-100"
                style={{
                  backgroundImage: `url('${imagePreview}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
            <div className="my-4 flex gap-2 jcend">
              <button className="btn btn-ghost" onClick={cancelCrop}>
                Cancel
              </button>
              <button
                className="btn btn-outline btn-primary"
                onClick={saveProfileImage}
              >
                Set as profile image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader(props: Record<string, string>) {
  const { title, icon, description } = props;

  let SEC_HEAD = "text-lg p-2 flex aictr gap-3 mb-4 mt-5 rounded-xl";

  return (
    <div className={SEC_HEAD}>
      <div className="flex coll flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-xs">{description}</div>
      </div>
      <Icon name={icon} size="2em" />
    </div>
  );
}

function SecurityTipsCard() {
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Use a strong password. Avoid common phrases and use a mix of letters, numbers, and symbols.",
    "Keep your email secure. Don't reuse passwords across multiple accounts.",
    "Sign out of unused or public devices to prevent unauthorized access.",
    "Check for suspicious activity regularly and update your password if needed.",
  ];

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="bg-primary text-primary-content shadow-lg rounded-lg p-6 w-full max-w-md">
      <div className="flex aictr gap-1 mb-2">
        <Icon name="verified_user" />
        <h2 className="text-lg font-semibold">Security Tips</h2>
      </div>
      <p className="text-sm py-4 pr-4 key-fade-in" key={tipIndex}>
        {tips[tipIndex]}
      </p>
      <div className="flex aiend">
        <button onClick={nextTip} className="btn btn-outline btn-sm">
          Next tip
          <Icon name="arrow_right" />
        </button>
        <div className="targt flex-1">
          {tipIndex + 1}/{tips.length}
        </div>
      </div>
    </div>
  );
}

function CommingSoon() {
  return (
    <div className="card rounded-lg bg-base-200 shadow-lg p-8">
      <Icon name="timer" size="4rem" />
      <p className="tactr mt-4">
        More settings will be available soon.
        <br />
        <b className="text-xl"> Stay tuned!</b>
      </p>
    </div>
  );
}

// function DVDLogo() {
//   return (
//     <div className="shadow-lg card h-48 overflow-hidden">
//       <iframe src="https://dvdscreensaver.net/" style={{ height: "100%" }} />
//     </div>
//   );
// }
