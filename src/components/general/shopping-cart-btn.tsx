"use client";

import { currentCart } from "@wix/ecom";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/cart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCartIcon, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import WixImage from "./wix-image";

interface IShoppingCartBtnProps {
  initialData: currentCart.Cart | null;
}

export default function ShoppingCartBtn({
  initialData,
}: IShoppingCartBtnProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery?.data?.lineItems?.reduce(
      (acc, lineItem) => acc + (lineItem?.quantity || 0),
      0,
    ) || 0;

  return (
    <>
      <div className={"relative"}>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setSheetOpen(true)}
          className={"rounded-full"}
        >
          <ShoppingCartIcon className={"text-xl"} />
          <span
            className={
              "absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
            }
          >
            {totalQuantity < 10 ? totalQuantity : "9+"}
          </span>
        </Button>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className={"flex flex-col sm:max-w-lg"}>
          <SheetHeader>
            <SheetTitle>
              Your cart{" "}
              <span className={"text-base"}>
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>

          {/*  content*/}
          <div className={"flex grow flex-col space-y-5 overflow-y-auto"}>
            <ul className={"space-y-5"}>
              {cartQuery.data?.lineItems?.map((item) => (
                <ShoppingCartItem
                  key={item._id}
                  item={item}
                  onProductLinkClick={() => setSheetOpen(false)}
                />
              ))}
            </ul>

            {cartQuery.isPending && (
              <Loader2 className="mx-auto animate-spin" />
            )}
            {cartQuery.isError && (
              <p className="text-destructive">
                {cartQuery.error?.message || "An error occurred"}
              </p>
            )}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow items-center justify-center text-center">
                <div className="5 space-y-1">
                  <p className="text-lg font-semibold">Your Cart is Empty</p>
                  <Link
                    href={"/shop"}
                    className="my-2 text-primary hover:underline"
                    onClick={() => setSheetOpen(false)}
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
          <hr />
          {/*  footer*/}
          <div className={"flex items-center justify-between gap-5"}>
            <div className={"space-y-0.5"}>
              <p className={"text-sm"}>Subtotal amount</p>
              <p className={"font-bold"}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                {cartQuery.data?.subtotal.formattedConvertedAmount}
              </p>

              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
            </div>

            <Button
              disabled={!totalQuantity || cartQuery?.isFetching}
              size={"lg"}
            >
              Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface IShoppingCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClick: () => void;
}

function ShoppingCartItem({
  item,
  onProductLinkClick,
}: IShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const productId = item._id;

  if (!productId) return null;

  const slug = item.url?.split("/").pop(); //get last element of the array
  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity > item.availability.quantityAvailable;

  return (
    <li className="flex items-center gap-3">
      <div className="relative size-fit flex-none">
        <Link href={`/products/${slug}`} onClick={onProductLinkClick}>
          <WixImage
            media={item.image}
            width={110}
            height={110}
            alt={item?.productName?.translated || "product image"}
            className="flex-none bg-secondary"
          />
        </Link>

        <button
          className="absolute -right-1 -top-1 rounded-full bg-background p-0.5"
          onClick={() => removeItemMutation.mutate(productId)}
        >
          <X className="size-3" />
        </button>
      </div>

      <div className="5 space-y-1 text-sm">
        <Link href={`/products/${slug}`} onClick={onProductLinkClick}>
          <p className="font-bold">{item.productName?.translated || "Item"}</p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line?.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}

        <div className="flex items-center gap-2">
          {item.quantity} X {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className="text-xs text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>

        <div className="5 flex items-center gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            disabled={item.quantity === 1}
            className="rounded-none disabled:cursor-not-allowed"
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                quantity: item.quantity ? item.quantity - 1 : 0,
              })
            }
          >
            -
          </Button>

          <span>{item.quantity}</span>

          <Button
            variant={"outline"}
            size={"sm"}
            disabled={quantityLimitReached}
            className="rounded-none"
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                quantity: item.quantity ? item.quantity + 1 : 1,
              })
            }
          >
            +
          </Button>

          {quantityLimitReached && <span>Quantity limit reached</span>}
        </div>
      </div>
    </li>
  );
}
