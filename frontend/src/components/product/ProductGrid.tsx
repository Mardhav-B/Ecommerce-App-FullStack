import { memo } from "react";

import ProductCard from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/services/product.api";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
}

function ProductGridComponent({
  products,
  isLoading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={`product-skeleton-${index}`}
            className="rounded-xl border border-biscuit-light bg-white p-3"
          >
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="mt-4 h-5 w-4/5 rounded" />
            <Skeleton className="mt-3 h-4 w-1/3 rounded" />
            <Skeleton className="mt-4 h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const ProductGrid = memo(ProductGridComponent);

export default ProductGrid;
