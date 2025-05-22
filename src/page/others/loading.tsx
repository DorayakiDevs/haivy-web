import { IconLogo, LoadingIcon } from "@components/icons/others";

export function FullscreenLoading() {
  return (
    <div className="disable-fade-in app-wrapper flex aictr jcctr coll gap-12">
      <IconLogo size={120} />
      <LoadingIcon />
    </div>
  );
}
