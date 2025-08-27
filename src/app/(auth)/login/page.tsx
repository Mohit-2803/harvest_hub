"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loginSchema, LoginFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      form.setError("email", { message: "Invalid email or password" });
      form.setError("password", { message: "" });
    } else {
      const sessesion = await getSession();
      const role = sessesion?.user?.role;
      if (role === "FARMER") {
        router.push("/farmer/dashboard");
      } else if (role === "CUSTOMER") {
        router.push("/customer/dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="flex h-[93vh] w-full items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-green-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-800">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        className="focus:ring-2 focus:ring-green-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        className="focus:ring-2 focus:ring-green-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className={cn(
                  "w-full rounded-2xl bg-green-600 hover:bg-green-700",
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                )}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <Separator className="my-6" />

          {/* Google OAuth */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 cursor-pointer"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={17}
              height={17}
            />
            Continue with Google
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-green-700 hover:underline cursor-pointer"
            >
              Register
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
