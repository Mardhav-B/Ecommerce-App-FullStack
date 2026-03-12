import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser, registerUser } from "../services/auth.api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface AuthForm {
  name?: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<AuthForm>();

  const onSubmit = async (data: AuthForm) => {
    try {
      if (isLogin) {
        const result = await loginUser({
          email: data.email,
          password: data.password,
        });

        localStorage.setItem("accessToken", result.accessToken);

        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } else {
        await registerUser({
          name: data.name!,
          email: data.email,
          password: data.password,
        });

        setIsLogin(true);
        return;
      }

      reset();
      navigate("/");
    } catch (error) {
      console.error("Auth failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Login to ShopSphere" : "Create your account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <input
              {...register("name")}
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg outline-none focus:border-biscuit"
            />
          )}

          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-3 rounded-lg outline-none focus:border-biscuit"
          />

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border p-3 rounded-lg outline-none focus:border-biscuit"
          />

          <button className="w-full bg-biscuit hover:bg-biscuit-dark text-white py-3 rounded-lg font-medium transition">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-biscuit font-semibold"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
