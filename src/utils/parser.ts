import { validate as isUUID } from "uuid";

type TextChunk = {
  text: string;
  type: "uuid" | "text";
};

const UUID_REG =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;

export class Parser {
  static extractTextInBrackets(str: string) {
    const reg = /\(([^)]+)\)/g;

    const text = str.match(reg)?.toString() ?? "";

    return text.slice(1, text.length - 1);
  }

  static extractUUIDs(text: string): string[] {
    const possibleUuids = text.match(UUID_REG) || [];

    return possibleUuids.filter(isUUID);
  }

  static extractUuidsAsChunks(text: string): TextChunk[] {
    const result: TextChunk[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(UUID_REG)) {
      const uuid = match[0];
      const start = match.index ?? 0;

      // Add text before the UUID
      if (start > lastIndex) {
        result.push({
          text: text.slice(lastIndex, start),
          type: "text",
        });
      }

      // Add the UUID if valid
      if (isUUID(uuid)) {
        result.push({ text: uuid, type: "uuid" });
      } else {
        // Treat as plain text if invalid (optional fallback)
        result.push({ text: uuid, type: "text" });
      }

      lastIndex = start + uuid.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push({
        text: text.slice(lastIndex),
        type: "text",
      });
    }

    return result;
  }

  static getNameInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    const func = (a: string[]) =>
      a.map((word) => word[0].toUpperCase()).join("");

    if (parts.length === 0) {
      return "-";
    }

    if (parts.length >= 4) {
      return func(parts.slice(-2));
    }

    return func(parts);
  }

  static getUserAvatar(user: Haivy.User) {
    const initial = Parser.getNameInitials(user.full_name);

    const backup = `https://vsmrpwbcgkvznymcfuho.supabase.co/storage/v1/object/public/profile-images/profile_${user.user_id}.png`;

    const urls = [
      user.profile_image_url,
      backup,
      `https://placehold.co/256/212b00/f1ffc4/?text=${initial}`,
    ];

    return urls.map((url) => `url('${url}')`).join(", ");
  }
}
