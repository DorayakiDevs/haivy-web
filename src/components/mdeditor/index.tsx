import { useEffect, useRef, useState } from "react";

import ReactMardown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Icon } from "@components/icons";

import { useHistoryState } from "@hooks/history.js";

type AvailableFormat =
  | "bold"
  | "italic"
  | "h2"
  | "h3"
  | "link"
  | "ul"
  | "ol"
  | "mention";

export default function MDEditor({
  onChange,
}: {
  onChange?: (c: string) => void;
}) {
  const textAreaRef = useRef<null | HTMLTextAreaElement>(null);

  const [editorHeight, setEditorHeight] = useState(4);

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [content, setContent, undoContent, redoContent] = useHistoryState("");

  function switchEdit() {
    setTab("write");
  }

  // function switchPreview() {
  //   setTab("preview");
  // }

  useEffect(() => {
    if (onChange) onChange(content);

    const newLineCount = content.split("\n").length;
    setEditorHeight((a) => Math.max(a, newLineCount + 4));
  }, [content, onChange]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    const keyArr = [];

    if (ctrlOrCmd) {
      keyArr.push("ctrl");
    }

    keyArr.push(e.key);

    const key = keyArr.join("+");

    switch (key) {
      case "ctrl+z": {
        undoContent();
        break;
      }

      case "ctrl-y": {
        redoContent();
        break;
      }

      case "ctrl-b": {
        format("bold");
        break;
      }
    }
  }

  const format = (type: AvailableFormat) => () =>
    applyFormatting(type, textAreaRef);

  return (
    <div className="w-full border rounded-field overflow-hidden flex coll">
      <div className="flex border-b border-base-content spbtw">
        <div>
          <MDOption
            text="Add a comment"
            active={tab === "write"}
            onClick={switchEdit}
          />
          {/* <MDOption
            text="Preview"
            active={tab === "preview"}
            onClick={switchPreview}
          /> */}
        </div>

        {true ||
          (tab === "write" && (
            <div className="flex items-center">
              <MDOption
                icon="format_h1"
                title="Add heading"
                onClick={format("h2")}
              />

              <MDOption
                icon="format_h2"
                title="Add subheading"
                onClick={format("h3")}
              />

              <MDOption
                icon="format_bold"
                title="Bold text"
                onClick={format("bold")}
              />
              <MDOption
                icon="format_italic"
                title="Italic text"
                onClick={format("italic")}
              />

              <MDOption icon="link" title="Add link" onClick={format("link")} />

              <MDOption text="@" title="Mention" onClick={format("mention")} />

              <MDOption
                icon="format_list_numbered"
                title="Add list"
                onClick={format("ol")}
              />

              <MDOption
                icon="format_list_bulleted"
                title="Add unordered list"
                onClick={format("ul")}
              />
            </div>
          ))}
      </div>

      <div className="p-4 flex-1">
        {tab === "write" ? (
          <textarea
            ref={textAreaRef}
            className="w-full flex-1 border-none outline-none resize-none"
            placeholder="Type your response here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ height: editorHeight * 1.5 + "em" }}
          />
        ) : (
          <div className="prose prose-invert min-h-48">
            <ReactMardown remarkPlugins={[remarkGfm]}>
              {content || "*Nothing to preview*"}
            </ReactMardown>
          </div>
        )}
      </div>
    </div>
  );
}

function MDOption(
  p: React.JSXProps<"button"> &
    ({ icon: string; text?: never } | { icon?: never; text: string }) & {
      active?: boolean;
    }
) {
  const { className, active, ...rest } = p;

  const clssArr = ["btn text-md rounded-none"];
  if (className) {
    clssArr.push(className);
  }

  if (active) {
    clssArr.push("btn-primary");
  }

  return (
    <button className={clssArr.join(" ")} {...rest}>
      {p.icon ? (
        <Icon name={p.icon} size="1.5em" />
      ) : (
        <span children={p.text} />
      )}
    </button>
  );
}

function applyFormatting(
  format: AvailableFormat,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);

  let insert = "";
  let selectOffset = 0;

  switch (format) {
    case "bold":
      insert = `**${selected || "bold text"}**`;
      selectOffset = selected ? 0 : 2;
      break;
    case "italic":
      insert = `*${selected || "italic text"}*`;
      selectOffset = selected ? 0 : 1;
      break;
    case "h2":
      insert = `## ${selected || "Heading 1"}`;
      break;
    case "h3":
      insert = `### ${selected || "Heading 2"}`;
      break;
    case "link":
      insert = `[${selected || "link text"}](https://example.com)`;
      break;
    case "mention":
      insert = `@${selected || "username"}`;
      break;
    case "ul":
      insert = `- ${selected || "list item"}\n`;
      break;
    case "ol":
      insert = `1. ${selected || "list item"}\n`;
      break;
  }

  // replace selected text and preserve undo history
  textarea.setRangeText(insert, start, end, "end");

  // optionally reposition cursor
  const cursor = start + insert.length;
  textarea.setSelectionRange(cursor - selectOffset, cursor - selectOffset);
  textarea.focus();

  // trigger onChange manually to update React state
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}
