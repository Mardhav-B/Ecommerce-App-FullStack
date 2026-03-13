const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ecommerce-app-fullstack.onrender.com/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  "mobile-accessories":
    "https://mate.net.in/public/uploads/all/UsReqZvujmEjMUb27qlTtRcCG8Pf18SyULO4HW7U.jpg",
};

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function normalizeAssetUrl(
  value?: string | null,
  options: { width: number; quality: number } = { width: 1400, quality: 90 },
) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
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
      url.searchParams.set("dpr", "2");
      return url.toString();
    }

    if (url.hostname.includes("images.pexels.com")) {
      url.searchParams.set("auto", "compress");
      url.searchParams.set("cs", "tinysrgb");
      url.searchParams.set("w", String(options.width));
      url.searchParams.set("dpr", "2");
      return url.toString();
    }

    return url.toString();
  } catch {
    return encoded;
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map((category: Category) => ({
        ...category,
        imageUrl: normalizeAssetUrl(
          category.imageUrl || CATEGORY_IMAGE_FALLBACKS[category.name],
        ),
      }));
    }
    if (Array.isArray(data.categories)) {
      return data.categories.map((category: Category) => ({
        ...category,
        imageUrl: normalizeAssetUrl(
          category.imageUrl || CATEGORY_IMAGE_FALLBACKS[category.name],
        ),
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/* -------------------- FETCH PRODUCTS -------------------- */

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=10`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    if (Array.isArray(data.products)) {
      return data.products;
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

/* -------------------- FETCH PRODUCT BY ID -------------------- */

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

/* -------------------- FETCH HERO BANNERS -------------------- */

export const fetchHeroBanners = async (): Promise<HeroBanner[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners`);

    if (!response.ok) {
      throw new Error("Failed to fetch hero banners");
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map((banner: HeroBanner) => ({
        ...banner,
        imageUrl: normalizeAssetUrl(banner.imageUrl, { width: 1800, quality: 92 }),
      }));
    }
    if (Array.isArray(data.banners)) {
      return data.banners.map((banner: HeroBanner) => ({
        ...banner,
        imageUrl: normalizeAssetUrl(banner.imageUrl, { width: 1800, quality: 92 }),
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching hero banners:", error);
    return [];
  }
};
