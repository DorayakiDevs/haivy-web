import { useToaster } from "@components/feedbacks/toaster/context";
import { useSidePanel } from "@components/modals/sidepanel";

export default function useUI() {
  const toaster = useToaster();
  const sidePanel = useSidePanel();

  return { toaster, sidePanel };
}
