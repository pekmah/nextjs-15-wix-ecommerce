import { products } from "@wix/stores";
import React from "react";
import Badge from "./badge";

interface IDiscountBadgeProps {
  data: products.Discount;
}

function DiscountBadge({ data }: IDiscountBadgeProps) {
  if (data.type !== "PERCENT") {
    return null;
  }
  return <Badge>-{data.value}%</Badge>;
}

export default DiscountBadge;
