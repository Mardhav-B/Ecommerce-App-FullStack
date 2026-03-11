import { Request, Response } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../services/cart.service";

export const fetchCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const cart = await getCart(userId);

    res.json(cart);
  } catch {
    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const { productId, quantity } = req.body;

    const item = await addToCart(userId, productId, quantity);

    res.status(201).json(item);
  } catch {
    res.status(500).json({
      message: "Failed to add to cart",
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;

    const { quantity } = req.body;

    const item = await updateCartItem(itemId, quantity);

    res.json(item);
  } catch {
    res.status(500).json({
      message: "Failed to update cart item",
    });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;

    await removeCartItem(itemId);

    res.json({
      message: "Item removed from cart",
    });
  } catch {
    res.status(500).json({
      message: "Failed to remove item",
    });
  }
};
