/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  createBackInStockNotificationRequest,
  IBackInStockNotificationRequest,
} from "@/api/backInStockNotifications";
import { wixBrowserClient } from "@/lib/wix-client-browser";

export function useCreateBackInStockNotificationRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: IBackInStockNotificationRequest) =>
      createBackInStockNotificationRequest(wixBrowserClient, values),
    onError: (error) => {
      if (
        (error as any).details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "You are already subscribed to this product",
        });
      } else {
        toast({
          variant: "destructive",
          description: "An error occurred, please try again.",
        });
      }
    },
  });
}
