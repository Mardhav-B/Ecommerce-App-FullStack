import { useState, useEffect } from "react";
import { fetchCategories, type Category } from "../../services/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Fetching categories...");
        const data = await fetchCategories();
        console.log("Categories fetched:", data);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (error) {
    return (
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center text-red-600">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-biscuit-light rounded-lg p-4"
              >
                <Skeleton className="w-full h-40 mb-3 rounded-md" />
                <Skeleton className="w-3/4 h-6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          No categories available
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader className="pb-3">
                {category.imageUrl && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}

                <CardTitle className="text-lg text-gray-900">
                  {category.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Button className="w-full">Browse {category.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
