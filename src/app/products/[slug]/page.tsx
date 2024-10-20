import { getProductBySlug } from "@/api/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetails from "./product-details";

interface IPageProps {
  params: { slug: string };
}

export default async function page({ params: { slug } }: IPageProps) {
  console.log("SLUG IS::", slug);
  const product = await getProductBySlug(slug);

  if (!product?._id) return notFound();
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </main>
  );
}
