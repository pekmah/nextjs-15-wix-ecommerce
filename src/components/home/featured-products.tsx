import { delay } from "@/lib/utils";
import React from "react";
import { Product } from "../general";
import { getCollectionBySlug } from "@/api/collections";
import { queryProducts } from "@/api/products";

async function FeaturedProducts() {
  await delay(1000);

  const collection = await getCollectionBySlug("featured-products");

  if (!collection?._id) return null;

  const featuredProducts = await queryProducts({
    collectionIds: collection._id,
  });

  if (!featuredProducts.items?.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <div className="flex grid-cols-2 gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
