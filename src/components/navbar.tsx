import { getCart } from "@/api/cart";
import logo from "@/assets/cart-icon.jpg";
import Image from "next/image";
import Link from "next/link";

export async function Navbar() {
  const cart = await getCart();

  const totalQuantity = cart?.lineItems?.reduce(
    (acc, lineItem) => acc + (lineItem?.quantity || 0),
    0,
  );
  // const cart =
  console.log(totalQuantity);
  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5">
        <Link href="/" className="flex items-center">
          <Image
            className="h-14 w-14 rounded-full object-cover"
            src={logo}
            alt="Ecomm Shop"
            width={60}
            height={60}
          />
          <span>Pekstar Ecomm</span>
        </Link>
        {totalQuantity ?? 0} Cart
      </div>
    </header>
  );
}
