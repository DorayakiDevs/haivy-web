import { useState } from "react";

import { ErrorableTextInput } from "@components/base/input";
import { Icon } from "@components/icons";

import { useValidatableState } from "@hooks/validator";

import { useClient } from "@services/client";

import { validateEmail } from "@utils/validator";

export default function SettingsPage() {
  const [page, setPage] = useState("account");

  const pageList: { [n: string]: { button: string; page: React.ReactNode } } = {
    account: {
      button: "Account settings",
      page: <AccountSettings />,
    },

    general: {
      button: "General settings",
      page: <GeneralSettings />,
    },
  };

  function isActive(a: string) {
    return page === a;
  }

  return (
    <div className="full-h pt-10 fade-in">
      <div className="flex coll gap-4">
        <div className="flex aictr gap-8">
          <div className="flex aictr text-3xl gap-2">
            <Icon name="settings" size="1.5em" />
            <div className="font-bold my-3">Settings</div>
          </div>
        </div>

        <div>
          <div className="flex aictr gap-2">
            {Object.keys(pageList).map((type: string) => {
              const page = pageList[type];
              return (
                <ColumnButton
                  active={isActive(type)}
                  onClick={() => setPage(type)}
                  key={type}
                >
                  {page.button}
                </ColumnButton>
              );
            })}
          </div>
        </div>
      </div>

      {pageList[page].page}
    </div>
  );
}

function AccountSettings() {
  const [showDialog, setShowDialog] = useState(false);
  const { account, session } = useClient();

  const firstName = useValidatableState(account?.first_name || "");
  const lastName = useValidatableState(account?.last_name || "");
  const email = useValidatableState(session?.user.email || "", validateEmail);
  const dateOfBirth = useValidatableState(account?.dob || "");
  const phoneNumber = useValidatableState("");

  // const profilePicture = useValidatableState(account?.profile_picture || "");

  const imgUrl = account?.profile_picture || "";

  function openDialog() {
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog(false);
  }

  return (
    <>
      <button className="btn" onClick={openDialog}>
        Open settings
      </button>
      <div
        className={"screen-overlay" + (showDialog ? " active" : "")}
        onClick={closeDialog}
      >
        <div
          className="bg-base-100 p-8 rounded-[var(--radius-box)]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex aictr gap-8">
            <div className="flex coll gap-2">
              <div className="avatar bg-base-300 w-60 h-60 rounded-xl">
                {imgUrl ? (
                  <div className="rounded-xl">
                    <img src={imgUrl} alt="Profile picture" />
                  </div>
                ) : (
                  <div className="w-full h-full flex aictr jcctr">
                    <Icon name="person" />
                  </div>
                )}
              </div>
              <div></div>
              <button className="btn btn-primary">Change avatar</button>
              <button className="btn btn-error">Remove avatar</button>
            </div>

            <div className="flex-1">
              <div className="text-xl font-bold mb-2">Edit Information</div>
              <div className="flex aictr gap-4">
                <ErrorableTextInput
                  title="First name"
                  state={firstName.state}
                />
                <ErrorableTextInput title="Last name" state={lastName.state} />
              </div>
              <ErrorableTextInput title="Email address" state={email.state} />
              <ErrorableTextInput
                title="Phone number"
                state={phoneNumber.state}
              />
              <ErrorableTextInput
                title="Date of birth"
                state={dateOfBirth.state}
              />
            </div>
          </div>

          <div className="flex jcend mt-8 gap-4 ">
            <button className="btn btn-neutral btn-soft">
              Discard changes
            </button>

            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </>
  );
}

function GeneralSettings() {
  return <div></div>;
}

function ColumnButton({
  children,
  active,
  ...props
}: {
  active?: boolean;
} & React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      className={[
        "btn btn-primary btn-outline ",
        active ? "btn-active" : "",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
