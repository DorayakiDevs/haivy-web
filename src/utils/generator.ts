import { templateName } from "./data";

export function getRandomName() {
  return (
    templateName[Math.round(templateName.length * Math.random())] ||
    "James Watterson"
  );
}
