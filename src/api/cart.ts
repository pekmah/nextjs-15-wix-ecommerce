import { WIX_STORES_APP_ID } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { WixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

export async function getCart(wixClient: WixClient) {
  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as { details: { applicationError: { code: string } } }).details
        .applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
}

export interface IAddToCart {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export async function addToCart(
  wixClient: WixClient,
  { product, selectedOptions, quantity }: IAddToCart,
) {
  const selectedVariant = findVariant(product, selectedOptions);

  return wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product._id,
          options: selectedVariant
            ? {
                variantId: selectedVariant._id,
              }
            : { options: selectedOptions },
        },
        quantity,
      },
    ],
  });
}

// update cart items quantity
export interface IUpdateCartItemQuantity {
  productId: string;
  quantity: number;
}

export async function updateCartItemQuantity(
  wixClient: WixClient,
  { productId, quantity }: IUpdateCartItemQuantity,
) {
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([
    {
      _id: productId,
      quantity,
    },
  ]);
}

// delete cart item
export async function removeCartItem(wixClient: WixClient, productId: string) {
  return wixClient.currentCart.removeLineItemsFromCurrentCart([productId]);
}
