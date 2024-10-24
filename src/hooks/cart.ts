"use client";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addToCart, getCart, IAddToCart } from "@/api/cart";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import { currentCart } from "@wix/ecom";
import { useToast } from "@/hooks/use-toast";

const cartQueryKey: QueryKey = ["cart"];

export function useCart(initialData: currentCart.Cart | null) {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: async () => getCart(wixBrowserClient),
    initialData,
  });
}

export function useAddItemToCart() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationKey: ["add-item-to-cart"],
    mutationFn: (values: IAddToCart) => addToCart(wixBrowserClient, values),
    onSuccess: (data) => {
      toast({ description: "Item added to cart" });
      queryClient.cancelQueries({ queryKey: cartQueryKey }).then();
      queryClient.setQueryData(cartQueryKey, data.cart);
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add item to cart. Please try again",
      });
    },
  });
}
