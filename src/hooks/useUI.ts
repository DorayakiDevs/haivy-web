import { useToaster } from "@components/feedbacks/toaster/context";

export function useUI() {
  const toaster = useToaster();

  return { toaster };
}
