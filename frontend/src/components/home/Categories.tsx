import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { fetchCategories, type Category } from "../../services/api";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const landingCategories = categories.filter(
    (category) => category.name !== "mobile-accessories",
  );

  return (
    <section className="px-3 py-12 sm:px-4 sm:py-16 md:px-6">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] bg-white/90 p-4 shadow-[0_25px_70px_rgba(141,97,62,0.08)] sm:rounded-[2rem] sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
              Shop by Category
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              Browse the collections behind the best sellers.
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-biscuit-dark"
          >
            View all products
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-[1.5rem] border border-biscuit-light bg-biscuit-light/50 p-4"
                >
                  <Skeleton className="mb-4 h-44 w-full rounded-[1.25rem]" />
                  <Skeleton className="h-6 w-2/3 rounded" />
                  <Skeleton className="mt-3 h-10 w-full rounded-full" />
                </div>
              ))
            : landingCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.id)}`}
                  className="group overflow-hidden rounded-[1.35rem] border border-biscuit-light bg-[linear-gradient(180deg,#fff_0%,#fcf3ea_100%)] p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.5rem] sm:p-4"
                >
                  <div className="overflow-hidden rounded-[1rem] bg-biscuit-light sm:rounded-[1.25rem]">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44"
                      />
                    ) : (
                      <div className="flex h-36 items-center justify-center text-sm uppercase tracking-[0.3em] text-biscuit-dark sm:h-44">
                        {category.name}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 sm:mt-5">
                    <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm leading-5 text-slate-500 sm:leading-6">
                      Jump straight into products curated for {category.name.toLowerCase()}.
                    </p>
                  </div>

                  <Button className="mt-4 h-10 w-full rounded-full bg-biscuit text-white hover:bg-biscuit-dark sm:mt-5 sm:h-11">
                    Explore {category.name}
                  </Button>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
