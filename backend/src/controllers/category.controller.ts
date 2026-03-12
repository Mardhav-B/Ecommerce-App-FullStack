import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.json(categories);
  } catch (error) {
    console.error("Category fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};
