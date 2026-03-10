import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const refreshTokens: Set<string> = new Set();

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  refreshTokens.add(refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshTokens.has(refreshToken)) {
    throw new Error("Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {
      userId: string;
    };
    const newAccessToken = generateAccessToken(decoded.userId);

    return { accessToken: newAccessToken };
  } catch (error) {
    refreshTokens.delete(refreshToken);
    throw new Error("Invalid refresh token");
  }
};

export const logoutUser = (refreshToken: string) => {
  refreshTokens.delete(refreshToken);
};
