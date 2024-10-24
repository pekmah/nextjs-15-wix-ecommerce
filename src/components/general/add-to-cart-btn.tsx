import { products } from "@wix/stores";
import { ButtonProps } from "../ui/button";
import LoadingBtn from "@/components/general/loading-btn";
import { useAddItemToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

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
  const mutation = useAddItemToCart();
  return (
    <LoadingBtn
      onClick={() => mutation.mutate({ product, selectedOptions, quantity })}
      {...props}
      loading={mutation.isPending}
      className={cn("flex items-center gap-2", className)}
    >
      <ShoppingCartIcon />
      <span>Add to cart</span>
    </LoadingBtn>
  );
}
