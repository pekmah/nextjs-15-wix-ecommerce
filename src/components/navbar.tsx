import { getCart } from "@/api/cart";
import logo from "@/assets/cart-icon.jpg";
import { getWixServerClient } from "@/lib/wix-client.server";
import Image from "next/image";
import Link from "next/link";
import ShoppingCartBtn from "@/components/general/shopping-cart-btn";

export async function Navbar() {
  const cart = await getCart(await getWixServerClient());

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
          <span className="font-bold">Pekstar Ecomm</span>
        </Link>

        <ShoppingCartBtn initialData={cart} />
      </div>
    </header>
  );
}
