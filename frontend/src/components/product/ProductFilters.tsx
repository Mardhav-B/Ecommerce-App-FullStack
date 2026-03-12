import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { fetchCategories, type ProductSort } from "@/services/product.api";

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
  sort: ProductSort;
}

interface ProductFiltersProps {
  value: FilterState;
  onChange: (nextValue: FilterState) => void;
}

const sortOptions: Array<{ label: string; value: ProductSort }> = [
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
  { label: "Newest", value: "newest" },
];

function ProductFiltersComponent({ value, onChange }: ProductFiltersProps) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const toggleCategory = (categoryId: string) => {
    const exists = value.categories.includes(categoryId);
    const categories = exists
      ? value.categories.filter((item) => item !== categoryId)
      : [...value.categories, categoryId];

    onChange({ ...value, categories });
  };

  return (
    <aside className="rounded-2xl border border-biscuit-light bg-white p-5 shadow-sm">
      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Search
          </h2>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={value.search}
              onChange={(event) =>
                onChange({ ...value, search: event.target.value })
              }
              placeholder="Search products"
              className="h-10 rounded-xl border-biscuit-light pl-9"
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Sort
          </h2>
          <select
            value={value.sort}
            onChange={(event) =>
              onChange({ ...value, sort: event.target.value as ProductSort })
            }
            className="mt-3 h-10 w-full rounded-xl border border-biscuit-light bg-white px-3 text-sm outline-none focus:border-biscuit focus:ring-2 focus:ring-biscuit/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Price Range
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Min</span>
                <span>${value.minPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={value.minPrice}
                onChange={(event) =>
                  onChange({
                    ...value,
                    minPrice: Math.min(Number(event.target.value), value.maxPrice),
                  })
                }
                className="w-full accent-biscuit"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Max</span>
                <span>${value.maxPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={value.maxPrice}
                onChange={(event) =>
                  onChange({
                    ...value,
                    maxPrice: Math.max(Number(event.target.value), value.minPrice),
                  })
                }
                className="w-full accent-biscuit"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Categories
          </h2>
          <div className="mt-3 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading categories...</p>
            ) : (
              categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={value.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="size-4 rounded border-biscuit-light text-biscuit focus:ring-biscuit"
                  />
                  <span>{category.name}</span>
                </label>
              ))
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}

const ProductFilters = memo(ProductFiltersComponent);

export default ProductFilters;
