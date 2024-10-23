"use client";
import { Badge } from "@/components/general";
import { checkInStock, findVariant } from "@/lib/utils";
import { products } from "@wix/stores";
import { useState } from "react";
import ProductMedia from "./media";
import ProductOptions from "./product-options";
import ProductPrice from "./product-price";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IProductDetailsProps {
  product: products.Product;
}

export default function ProductDetails({ product }: IProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0]?.description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  const selectedVariant = findVariant(product, selectedOptions);
  const inStock = checkInStock(product, selectedOptions);
  const availableQuantity =
    selectedVariant?.stock?.quantity ?? product?.stock?.quantity;
  const availableQuantityExceeded =
    !!availableQuantity && quantity > availableQuantity;
  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (c) => c.description === selectedOptions[option.name || ""],
    );

    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }
      />

      <div className="basis-3/5 space-y-5">
        <div className="5 space-y-2">
          <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>

          {product.brand && (
            <div className="text-muted-foreground">{product.brand}</div>
          )}

          {product.ribbon && <Badge className="block">{product.ribbon}</Badge>}
        </div>
        {product.description && (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose dark:prose-indigo"
          />
        )}

        <ProductPrice product={product} selectedVariant={selectedVariant} />

        <ProductOptions
          product={product}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />

        <div className="5 space-y-1">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="5 flex items-center gap-2">
            <Input
              name="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24"
              disabled={!inStock}
            />

            {!!availableQuantity &&
              (availableQuantityExceeded || availableQuantity < 5) && (
                <span className="text-destructive">
                  Only {availableQuantity} left in stock
                </span>
              )}
          </div>
        </div>

        {!!product.additionalInfoSections?.length && (
          <div className="5 space-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <InfoIcon className="size-5" />
              <span>Additional product information</span>
            </span>

            <Accordion type="multiple">
              {product.additionalInfoSections.map((section, index) => (
                <AccordionItem value={section.title || ""} key={index}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  {/* content */}
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: section.description || "",
                      }}
                      className="prose text-sm font-normal text-muted-foreground dark:prose-invert"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
