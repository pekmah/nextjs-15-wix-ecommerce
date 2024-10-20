import { env } from "@/env";

import { createClient, OAuthStrategy } from "@wix/sdk";
import {
  backInStockNotifications,
  currentCart,
  orders,
  recommendations,
} from "@wix/ecom";
import { files } from "@wix/media";
import { redirects } from "@wix/redirects";
import { reviews } from "@wix/reviews";
import { members } from "@wix/members";
import { collections, products } from "@wix/stores";

export function getWixClient() {
  return createClient({
    modules: {
      products: products,
      collections: collections,
      currentCart: currentCart,
      redirects: redirects,
      orders: orders,
      recommendations: recommendations,
      backInStockNotifications: backInStockNotifications,
      reviews: reviews,
      members: members,
      files: files,
    },
    auth: OAuthStrategy({
      clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
    }),
  });
}
