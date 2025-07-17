import { Icon } from "@components/icons/google";

export default function ErrorHandlerPage({ error }: { error: any }) {
  function reload() {
    location.reload();
  }

  return (
    <div className="content-wrapper content-ctr coll gap-8">
      <div className="content-ctr gap-12">
        <div>
          <img src={location.origin + "/404.png"} alt="" width={240} />
        </div>
        <div className="">
          <div className="text-[4rem] font-bold mb-4">Ooopss...</div>
          <p className="max-w-102 text-lg">
            An error has occured while trying to resolve your request, please
            try again later
          </p>
        </div>
      </div>

      <code className="bg-base-200 py-4 px-8 rounded-box selectable-text">
        <div className="mb-4 tactr">Error Details</div>
        <div className="flex gap-16">
          <div>
            <pre>Message:</pre>
            <pre>Code:</pre>
          </div>
          <div className="font-bold">
            <pre>{error?.message}</pre>
            <pre>{error?.code}</pre>
          </div>
        </div>
      </code>

      <button className="btn btn-primary btn-outline" onClick={reload}>
        <Icon name="replay" />
        Reload
      </button>
    </div>
  );
}
