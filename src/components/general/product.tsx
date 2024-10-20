/* eslint-disable @next/next/no-img-element */
import { media as wixMedia } from "@wix/sdk";
import { products } from "@wix/stores";
import Link from "next/link";
import React from "react";

interface IProductProps {
  product: products.Product;
}

const Product = ({ product }: IProductProps) => {
  const productImage = product.media?.mainMedia?.image;
  const resizedImage = productImage?.url
    ? wixMedia.getScaledToFillImageUrl(productImage.url, 700, 700, {})
    : null;

  return (
    <Link
      href={`/products/${product?.slug}`}
      className="h-full overflow-hidden rounded-sm"
    >
      <div className="overflow-hidden">
        <img
          src={resizedImage || "/placeholder.png"}
          alt={productImage?.altText || "product"}
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-3">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div
          className="line-clamp-5"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>
    </Link>
  );
};

export default Product;
