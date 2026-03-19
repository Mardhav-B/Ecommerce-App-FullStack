import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/auth.service";
import prisma from "../config/prisma";

function getRefreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const frontendUrl = process.env.FRONTEND_URL ?? "";
  const isHttpsFrontend = /^https:\/\//i.test(frontendUrl);

  const useSecureCookies = isProduction || isHttpsFrontend;

  return {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: useSecureCookies ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token not found in cookies",
      });
    }

    const result = await refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Token refresh failed",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    const cookieOptions = getRefreshCookieOptions();
    res.clearCookie("refreshToken", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Logout failed",
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      street: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
    },
  });

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    addresses,
  });
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { street, city, state, country, zipCode } = req.body;

    if (!street || !city || !state || !country || !zipCode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        street,
        city,
        state,
        country,
        zipCode,
      },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
      },
    });

    return res.status(201).json(address);
  } catch {
    return res.status(500).json({
      message: "Failed to save address",
    });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { street, city, state, country, zipCode } = req.body;

    if (!street || !city || !state || !country || !zipCode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        street,
        city,
        state,
        country,
        zipCode,
      },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
      },
    });

    return res.json(address);
  } catch {
    return res.status(500).json({
      message: "Failed to update address",
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return res.status(204).send();
  } catch {
    return res.status(500).json({
      message: "Failed to delete address",
    });
  }
};
