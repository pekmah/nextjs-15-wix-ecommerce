/* eslint-disable @next/next/no-img-element */
import { products } from "@wix/stores";
import Link from "next/link";
import WixImage from "./wix-image";
import Badge from "./badge";
import { formatCurrency } from "@/lib/utils";
import DiscountBadge from "./discount-badge";

interface IProductProps {
  product: products.Product;
}

const Product = ({ product }: IProductProps) => {
  const productImage = product.media?.mainMedia?.image;

  return (
    <Link
      href={`/products/${product?.slug}`}
      className="h-full overflow-hidden rounded-sm border border-gray-100 bg-card"
    >
      <div className="relative overflow-hidden">
        <WixImage
          media={productImage?.url}
          alt={productImage?.altText}
          className="transition-transform duration-300 hover:scale-105"
          width={700}
          height={700}
        />

        <div className="absolute bottom-3 right-3">
          {product?.ribbon && <Badge>{product.ribbon}</Badge>}
          {product?.discount && <DiscountBadge data={product?.discount} />}
          <Badge className="bg-secondary font-semibold text-secondary-foreground">
            {getFormattedPrice(product)}
          </Badge>
        </div>
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

function getFormattedPrice(product: products.Product) {
  const minPrice = product.priceRange?.minValue;
  const maxPrice = product.priceRange?.maxValue;

  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `From ${formatCurrency(minPrice, product.priceData?.currency)}`;
  } else
    return (
      product.priceData?.formatted?.discountedPrice ||
      product.priceData?.formatted?.price ||
      "N/A"
    );
}
