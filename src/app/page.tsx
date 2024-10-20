import Image from "next/image";

import banner from "@/assets/banner.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedProducts } from "@/components/home";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      {/* banner */}
      <div className="flex items-center bg-secondary md:h-96">
        {/* text */}
        <div className="space-y-7 p-10 text-center md:w-1/2">
          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome to Pekstar E-commerce
          </h1>
          <p>
            The best place to buy your favorite products at the best prices. We
            have a wide range of products that you can choose from. We offer the
            best prices and the best quality products.
          </p>

          <Button asChild>
            <Link href="/products">
              Shop now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>

        {/* image */}
        <div className="relative hidden h-full w-1/2 md:block">
          <Image
            src={banner}
            alt={"Pekstar ecomm banner"}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Featured products */}
      <Suspense fallback={<div>Loading...</div>}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}
