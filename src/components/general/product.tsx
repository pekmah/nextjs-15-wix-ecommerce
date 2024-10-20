/* eslint-disable @next/next/no-img-element */
import { products } from "@wix/stores";
import Link from "next/link";
import WixImage from "./wix-image";

interface IProductProps {
  product: products.Product;
}

const Product = ({ product }: IProductProps) => {
  const productImage = product.media?.mainMedia?.image;

  return (
    <Link
      href={`/products/${product?.slug}`}
      className="h-full overflow-hidden rounded-sm"
    >
      <div className="overflow-hidden">
        <WixImage
          media={productImage?.url}
          alt={productImage?.altText}
          className="transition-transform duration-300 hover:scale-105"
          width={700}
          height={700}
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
