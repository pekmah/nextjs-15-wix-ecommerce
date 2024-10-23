import { getProductBySlug } from "@/api/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetails from "./product-details";
import { Metadata } from "next";
import { delay } from "@/lib/utils";

interface IPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const mainImage = product?.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Get this amazing product now!",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}

export default async function page({ params }: IPageProps) {
  const { slug } = await params;
  await delay(3000);
  const product = await getProductBySlug(slug);

  if (!product?._id) return notFound();
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
    </main>
  );
}
