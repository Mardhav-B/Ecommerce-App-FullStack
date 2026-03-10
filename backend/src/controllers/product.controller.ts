import { Request, Response } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/product.service";

export const fetchProducts = async (req: Request, res: Response) => {
  try {

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const page =
      typeof req.query.page === "string"
        ? parseInt(req.query.page)
        : 1;

    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit)
        : 10;

    const result = await getProducts(search, page, limit);

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
};

export const fetchProductById = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const product = await getProductById(Array.isArray(id) ? id[0] : id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch {
    res.status(500).json({
      message: "Error fetching product"
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {

    const product = await createProduct(req.body);

    res.status(201).json(product);

  } catch {
    res.status(500).json({
      message: "Failed to create product"
    });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const product = await updateProduct(Array.isArray(id) ? id[0] : id, req.body);

    res.json(product);

  } catch {
    res.status(500).json({
      message: "Failed to update product"
    });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    await deleteProduct(Array.isArray(id) ? id[0] : id);

    res.json({
      message: "Product deleted"
    });

  } catch {
    res.status(500).json({
      message: "Failed to delete product"
    });
  }
};