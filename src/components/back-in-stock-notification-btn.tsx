import { requiredString } from "@/lib/validation";
import { products } from "@wix/stores";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button, ButtonProps } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingBtn from "./general/loading-btn";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock-notifications";
import { env } from "@/env";

interface IBackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

const notificationFormSchema = z.object({
  email: requiredString.email(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export default function BackInStockNotificationButton({
  product,
  selectedOptions,
  ...props
}: IBackInStockNotificationButtonProps) {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useCreateBackInStockNotificationRequest();

  async function onSubmit({ email }: NotificationFormValues) {
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
      product,
      selectedOptions,
    });
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button {...props}>Notify me when available</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify me when available</DialogTitle>

          <DialogDescription>
            Enter your email address and we&apos;ll let you know when this
            product is back in stock.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={"email"}>Email</FormLabel>
                  <FormControl>
                    <Input {...field} id={"email"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingBtn type="submit" loading={mutation.isPending}>
              Notify me
            </LoadingBtn>
          </form>
        </Form>

        {mutation.isSuccess && (
          <div className="5 py-2 text-green-500">
            Thank you! We&apos;ll notify you when this product is back in stock.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
