import { IconLogo, LoadingIcon } from "@components/icons/others";

export function AppWrapperLoading() {
  return (
    <div className="disable-fade-in app-wrapper flex aictr jcctr coll gap-12">
      <IconLogo size={120} />
      <LoadingIcon />
    </div>
  );
}

export function FullscreenLoading() {
  return (
    <div className="flex aictr jcctr w-full h-full">
      <LoadingIcon />
    </div>
  );
}

export function LoadingSkeletonParagraph() {
  return (
    <div className="space-y-2 animate-pulse my-4">
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>

      <div className="h-6 bg-gray-300 rounded w-full"></div>
      <div className="h-6 bg-gray-300 rounded w-11/12"></div>
      <div className="h-6 bg-gray-300 rounded w-10/12"></div>
      <div className="h-6 bg-gray-300 rounded w-3/5"></div>
    </div>
  );
}
