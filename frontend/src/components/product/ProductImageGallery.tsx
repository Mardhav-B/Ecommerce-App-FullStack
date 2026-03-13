import { memo, useEffect, useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

function ProductImageGalleryComponent({
  images,
  alt,
}: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-biscuit-light bg-white">
        <div className="group relative aspect-square overflow-hidden">
          <img
            src={activeImage}
            alt={alt}
            loading="eager"
            decoding="sync"
            className="h-full w-full object-cover bg-white transition-transform duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden rounded-2xl border transition ${
              activeImage === image
                ? "border-biscuit shadow-md"
                : "border-biscuit-light hover:border-biscuit/50"
            }`}
          >
            <img
              src={image}
              alt={`${alt} thumbnail ${index + 1}`}
              decoding="async"
              className="aspect-square h-full w-full object-cover bg-white"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const ProductImageGallery = memo(ProductImageGalleryComponent);

export default ProductImageGallery;
