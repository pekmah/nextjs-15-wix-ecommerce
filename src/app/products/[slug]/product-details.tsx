"use client";
import { Badge } from "@/components/general";
import WixImage from "@/components/general/wix-image";
import { findVariant } from "@/lib/utils";
import { products } from "@wix/stores";
import { useState } from "react";
import ProductOptions from "./product-options";
import ProductPrice from "./product-price";

interface IProductDetailsProps {
  product: products.Product;
}

export default function ProductDetails({ product }: IProductDetailsProps) {
  // const [quantity, setQuantity] = useState(1);
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
  // const inStock = checkInStock(product, selectedOptions);

  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <div className="basis-2/5">
        <WixImage
          media={product?.media?.mainMedia?.image?.url}
          alt={product?.media?.mainMedia?.image?.altText}
          width={1000}
          height={1000}
          className="sticky top-5"
        />
      </div>

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

        <div>{JSON.stringify(selectedOptions)}</div>
        <div>{JSON.stringify(selectedVariant?.choices)}</div>
      </div>
    </div>
  );
}
