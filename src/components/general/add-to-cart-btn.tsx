import { products } from "@wix/stores";
import { Button, ButtonProps } from "../ui/button";
import { addToCart } from "@/api/cart";
import { wixBrowserClient } from "@/lib/wix-client-browser";

interface IAddToCartBtnProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartBtn({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: IAddToCartBtnProps) {
  return (
    <Button
      onClick={() =>
        addToCart(wixBrowserClient, { product, selectedOptions, quantity })
      }
      {...props}
      className={className}
    >
      Add to cart
    </Button>
  );
}
