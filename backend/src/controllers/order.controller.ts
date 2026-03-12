import { Request, Response } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../services/order.service";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const order = await createOrder(userId);

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const fetchOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const orders = await getOrders(userId);

    res.json(orders);
  } catch {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

export const fetchOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await getOrderById(Array.isArray(id) ? id[0] : id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch {
    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};
