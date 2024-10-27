"use client";

import {
  addToCart,
  getCart,
  IAddToCart,
  IUpdateCartItemQuantity,
  removeCartItem,
  updateCartItemQuantity,
} from "@/api/cart";
import { useToast } from "@/hooks/use-toast";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";

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

// update cart hook
export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  const mutationKey: MutationKey = ["update-cart-item-quantity"];
  const { toast } = useToast();

  return useMutation({
    mutationKey,
    mutationFn: (values: IUpdateCartItemQuantity) =>
      updateCartItemQuantity(wixBrowserClient, values),
    onMutate: async ({ productId, quantity }) => {
      // optimistically update the cart state on
      await queryClient.cancelQueries({ queryKey: cartQueryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(cartQueryKey);

      queryClient.setQueryData<currentCart.Cart>(cartQueryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.map((lineItem) =>
          lineItem._id === productId ? { ...lineItem, quantity } : lineItem,
        ),
      }));

      return { previousState };
    },
    onError: (_err, _vars, context) => {
      // Roll back to previous values if error happens
      queryClient.setQueryData(cartQueryKey, context?.previousState);
      // console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update item quantity. Please try again",
      });
    },
    onSettled: () => {
      // check if mutation is mutating only once
      // This eliminates race conditions
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey: cartQueryKey });
      }
    },
  });
}

// remove cart item hook
export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutationKey: MutationKey = ["remove-cart-item"];

  return useMutation({
    mutationKey,
    mutationFn: (productId: string) =>
      removeCartItem(wixBrowserClient, productId),
    onMutate: async (productId) => {
      // optimistically update the cart state on
      await queryClient.cancelQueries({ queryKey: cartQueryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(cartQueryKey);

      queryClient.setQueryData<currentCart.Cart>(cartQueryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.filter(
          (lineItem) => lineItem._id !== productId,
        ),
      }));

      return { previousState };
    },
    onError: (_err, _vars, context) => {
      // Roll back to previous values if error happens
      queryClient.setQueryData(cartQueryKey, context?.previousState);
      // console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to remove item. Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}
// check if mutation is mutating only once
