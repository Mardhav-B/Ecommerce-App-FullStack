const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ecommerce-app-fullstack.onrender.com/api";

export type ProductSort = "price_low_high" | "price_high_low" | "newest";

export interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface ProductCategoryRef {
  id: string;
  name?: string | null;
}

interface RawProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  images?: string[];
  rating?: number;
  sizes?: string[];
  categoryId?: string | null;
  category?: ProductCategoryRef | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  rating: number;
  sizes?: string[];
  categoryId?: string | null;
  categoryName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSort;
}

export interface ProductsQuery extends ProductFilters {
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

interface RawProductsResponse {
  products?: RawProduct[];
  total?: number;
  page?: number;
  totalPages?: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";
const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  "mobile-accessories":
    "https://mate.net.in/public/uploads/all/UsReqZvujmEjMUb27qlTtRcCG8Pf18SyULO4HW7U.jpg",
};

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function normalizeAssetUrl(
  value?: string | null,
  options: { width: number; quality: number } = { width: 1200, quality: 80 },
) {
  if (!value) {
    return FALLBACK_IMAGE;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return FALLBACK_IMAGE;
  }

  if (!isAbsoluteUrl(trimmed)) {
    return trimmed;
  }

  const encoded = encodeURI(trimmed);

  try {
    const url = new URL(encoded);

    if (url.hostname.includes("images.unsplash.com")) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(options.width));
      url.searchParams.set("q", String(options.quality));
      url.searchParams.delete("dpr");
      return url.toString();
    }

    if (url.hostname.includes("images.pexels.com")) {
      url.searchParams.set("auto", "compress");
      url.searchParams.set("cs", "tinysrgb");
      url.searchParams.set("w", String(options.width));
      url.searchParams.delete("dpr");
      return url.toString();
    }

    if (url.hostname.includes("dummyjson.com")) {
      url.searchParams.set("w", String(options.width));
      return url.toString();
    }

    return url.toString();
  } catch {
    return encoded;
  }
}

function clampRating(value?: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(5, Math.max(0, value));
  }

  return 4.5;
}

function extractCategoryName(category?: ProductCategoryRef | string | null) {
  if (!category) {
    return null;
  }

  if (typeof category === "string") {
    return category;
  }

  return category.name ?? null;
}

function normalizeImages(product: RawProduct) {
  const sourceImages = Array.isArray(product.images)
    ? product.images
        .filter(Boolean)
        .map((image) =>
          normalizeAssetUrl(image, {
            width: 1200,
            quality: 80,
          }),
        )
    : [];
  const primaryImage =
    normalizeAssetUrl(product.imageUrl, {
      width: 1200,
      quality: 80,
    }) ||
    sourceImages[0] ||
    FALLBACK_IMAGE;
  const merged = [primaryImage, ...sourceImages].filter(Boolean);
  const uniqueImages = Array.from(new Set(merged));

  if (uniqueImages.length > 0) {
    return uniqueImages.slice(0, 5);
  }

  return [FALLBACK_IMAGE];
}

export function normalizeProduct(product: RawProduct): Product {
  const images = normalizeImages(product);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: images[0],
    images,
    rating: clampRating(product.rating),
    sizes: Array.isArray(product.sizes) ? product.sizes : undefined,
    categoryId:
      product.categoryId ??
      (product.category && typeof product.category === "object"
        ? product.category.id
        : null),
    categoryName: extractCategoryName(product.category),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function buildProductsUrl(params: ProductsQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 12));

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.category?.length) {
    searchParams.set("category", params.category.join(","));
  }

  if (typeof params.minPrice === "number") {
    searchParams.set("minPrice", String(params.minPrice));
  }

  if (typeof params.maxPrice === "number") {
    searchParams.set("maxPrice", String(params.maxPrice));
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  return `${API_BASE_URL}/products?${searchParams.toString()}`;
}

function filterAndSortProducts(products: Product[], filters: ProductFilters) {
  const categorySet = filters.category?.length ? new Set(filters.category) : null;
  let nextProducts = [...products];

  if (categorySet) {
    nextProducts = nextProducts.filter((product) => {
      const categoryId = product.categoryId ?? "";
      const categoryName = product.categoryName ?? "";
      return categorySet.has(categoryId) || categorySet.has(categoryName);
    });
  }

  if (typeof filters.minPrice === "number") {
    nextProducts = nextProducts.filter(
      (product) => product.price >= filters.minPrice!,
    );
  }

  if (typeof filters.maxPrice === "number") {
    nextProducts = nextProducts.filter(
      (product) => product.price <= filters.maxPrice!,
    );
  }

  if (filters.sort === "price_low_high") {
    nextProducts.sort((left, right) => left.price - right.price);
  }

  if (filters.sort === "price_high_low") {
    nextProducts.sort((left, right) => right.price - left.price);
  }

  if (filters.sort === "newest") {
    nextProducts.sort((left, right) => {
      const leftDate = new Date(left.createdAt ?? 0).getTime();
      const rightDate = new Date(right.createdAt ?? 0).getTime();
      return rightDate - leftDate;
    });
  }

  return nextProducts;
}

export async function fetchProducts(
  params: ProductsQuery = {},
): Promise<ProductsResponse> {
  const response = await fetch(buildProductsUrl(params));

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = (await response.json()) as RawProductsResponse;
  const products = Array.isArray(data.products)
    ? data.products.map(normalizeProduct)
    : [];
  const filteredProducts = filterAndSortProducts(products, params);
  const page = data.page ?? params.page ?? 1;
  const totalPages = data.totalPages ?? page;
  const total = data.total ?? filteredProducts.length;

  return {
    products: filteredProducts,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = (await response.json()) as RawProduct;
  return normalizeProduct(data);
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = (await response.json()) as Category[] | { categories?: Category[] };

  if (Array.isArray(data)) {
    return data.map((category) => ({
      ...category,
      imageUrl: normalizeAssetUrl(
        category.imageUrl || CATEGORY_IMAGE_FALLBACKS[category.name],
      ),
    }));
  }

  return Array.isArray(data.categories)
    ? data.categories.map((category) => ({
        ...category,
        imageUrl: normalizeAssetUrl(
          category.imageUrl || CATEGORY_IMAGE_FALLBACKS[category.name],
        ),
      }))
    : [];
}

export async function addToCart(productId: string, quantity: number) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please sign in to add items to cart.");
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to add item to cart.");
  }

  return response.json();
}
