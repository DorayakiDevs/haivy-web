import textmark from "@assets/textmark.svg";
import { Icon } from "@components/icons/google";

export default function PrintableHeader() {
  return (
    <header className="flex aictr spbtw my-4">
      <div className="w-[130px]">
        <img src={textmark} width={100} />
      </div>

      <div className="tactr">
        <div className="text-2xl font-bold">Haivy Medical Center</div>
        <div>128 Broadway Street, Ho Chi Minh, Vietnam</div>
      </div>

      <div className="w-[130px]">
        <div className="flex aictr jcend gap-2">
          0123-456-789 <Icon name="phone" />
        </div>
        <div className="flex aictr jcend gap-2">
          hello@haivy.help
          <Icon name="email" />
        </div>
      </div>
    </header>
  );
}
