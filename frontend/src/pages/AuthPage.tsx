import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LockKeyhole, Mail, User2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginUser, registerUser } from "../services/auth.api";

interface AuthForm {
  name?: string;
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Full name is required"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthForm>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: AuthForm) => {
    try {
      setErrorMessage(null);
      setIsSubmitting(true);

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
        reset({ email: data.email, password: "" });
        return;
      }

      reset();
      const from =
        (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)
          ?.from ?? null;
      const redirectTo =
        from?.pathname ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}` : "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fcf5ee_0%,#f0dfcf_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(106,70,39,0.16)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-[linear-gradient(180deg,#e3b588_0%,#c88e5b_100%)] p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
                Account Center
              </p>
              <h1 className="mt-4 max-w-md text-5xl font-semibold leading-tight">
                Sign in faster, manage addresses, and shop without friction.
              </h1>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] bg-white/18 p-5 backdrop-blur">
                Save shipping addresses for one-click checkout style flows.
              </div>
              <div className="rounded-[1.5rem] bg-white/18 p-5 backdrop-blur">
                Track profile details and keep your account info in one place.
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-biscuit-dark">
                {isLogin ? "Welcome back" : "Create account"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                {isLogin ? "Login to ShopSphere" : "Register your account"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Access your saved details, addresses, and account dashboard."
                  : "Create your account to save addresses and shop faster."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Full name
                  </span>
                  <div className="flex items-center rounded-2xl border border-biscuit/25 bg-[#fffaf6] px-4">
                    <User2 className="size-4 text-slate-400" />
                    <input
                      {...register("name")}
                      placeholder="Enter your full name"
                      className="h-12 w-full bg-transparent px-3 outline-none"
                    />
                  </div>
                  {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <div className="flex items-center rounded-2xl border border-biscuit/25 bg-[#fffaf6] px-4">
                  <Mail className="size-4 text-slate-400" />
                  <input
                    {...register("email")}
                    placeholder="Enter your email"
                    className="h-12 w-full bg-transparent px-3 outline-none"
                  />
                </div>
                {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="flex items-center rounded-2xl border border-biscuit/25 bg-[#fffaf6] px-4">
                  <LockKeyhole className="size-4 text-slate-400" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Enter your password"
                    className="h-12 w-full bg-transparent px-3 outline-none"
                  />
                </div>
                {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
              </label>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-biscuit py-3 font-semibold text-white transition hover:bg-biscuit-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? isLogin
                    ? "Logging in..."
                    : "Registering..."
                  : isLogin
                    ? "Login"
                    : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage(null);
                }}
                className="ml-2 font-semibold text-biscuit-dark"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
