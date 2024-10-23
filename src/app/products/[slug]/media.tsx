import WixImage from "@/components/general/wix-image";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";

interface IProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: IProductMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState(media?.at(0));

  useEffect(() => {
    setSelectedMedia(media?.at(0));
  }, [media]);

  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.at(0);

  return (
    <div className="h-fit basis-2/5 space-y-5 md:sticky md:top-10">
      <div className="aspect-square bg-secondary">
        {selectedImage?.url ? (
          <Zoom key={selectedImage?.url}>
            <WixImage
              media={selectedImage?.url}
              alt={selectedImage?.altText}
              width={1000}
              height={1000}
              className="sticky top-5"
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full bg-black">
            <video controls className="size-full">
              <source
                src={selectedVideo?.url}
                type={`video/${selectedVideo?.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>

      {/* rest of images */}
      {media?.length && (
        <div className="flex flex-wrap gap-5">
          {media.map((mediaItem, index) => (
            <MediaPreview
              key={index}
              mediaItem={mediaItem}
              isSelected={mediaItem?._id === selectedMedia?._id}
              onSelect={() => setSelectedMedia(mediaItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface IMediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: IMediaPreviewProps) {
  const imageUrl = mediaItem.image?.url;
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbNailUrl = mediaItem?.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbNailUrl
      ? thumbNailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      className={cn(
        "relative cursor-pointer bg-secondary",
        isSelected && "outline outline-1 outline-primary",
      )}
    >
      <WixImage
        media={imageUrl || resolvedThumbnailUrl}
        alt={
          mediaItem.image?.altText || mediaItem?.video?.files?.at(0)?.altText
        }
        width={100}
        height={100}
        onMouseEnter={onSelect}
      />
      {resolvedThumbnailUrl && (
        <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40">
          <PlayIcon className="size-5 text-white/80" />
        </span>
      )}
    </div>
  );
}
