
import { Toast, useToast as useToastOriginal } from "@/components/ui/toast";
import { toast } from "sonner";

export { toast };
export const useToast = useToastOriginal;
export type { Toast };
