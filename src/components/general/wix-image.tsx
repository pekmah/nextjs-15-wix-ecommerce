/* eslint-disable @next/next/no-img-element */
import React, { ImgHTMLAttributes } from "react";
import { media as wixMedia } from "@wix/sdk";

type WixImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height" | "alt"
> & {
  media?: string;
  placeholder?: string;
  alt?: string | null;
} & (
    | {
        scaleToFill?: true;
        width: number;
        height: number;
      }
    | {
        scaleToFill: false;
      }
  );

function WixImage({
  media,
  placeholder = "/placeholder.png",
  alt,
  ...props
}: WixImageProps) {
  const imageUrl = media
    ? props.scaleToFill || props.scaleToFill === undefined
      ? wixMedia.getScaledToFillImageUrl(media, props.width, props.height, {})
      : wixMedia.getImageUrl(media).url
    : placeholder;

  return <img src={imageUrl} alt={alt || "product"} {...props} />;
}

export default WixImage;
