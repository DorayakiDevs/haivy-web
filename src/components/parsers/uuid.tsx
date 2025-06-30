import { UserAutoInfo } from "@components/users";

import { Parser } from "@utils/parser";

export function UserFromTextRenderer({ text }: { text: string }) {
  const possibleUUIDs = Parser.extractUuidsAsChunks(text);

  return (
    <div>
      {possibleUUIDs.map(({ text, type }, i) => {
        if (type === "text") {
          return <span key={i} className="align-bottom">{` ${text} `}</span>;
        }

        return (
          <UserAutoInfo
            inline
            hideAvatar
            id={text}
            key={text + "-" + i}
            hideRole
          />
        );
      })}
    </div>
  );
}
