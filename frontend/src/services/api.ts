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

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.categories)) return data.categories;

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

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.banners)) return data.banners;

    return [];
  } catch (error) {
    console.error("Error fetching hero banners:", error);
    return [];
  }
};
