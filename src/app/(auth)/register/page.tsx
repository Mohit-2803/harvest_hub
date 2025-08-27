"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, RegisterFormValues } from "@/lib/validation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      farmName: "",
      farmLocation: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Account created! Logging in...");
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        // redirect user on basis of role
        if (values.role === "FARMER") {
          router.push("/farmer/dashboard");
        }
        if (values.role === "CUSTOMER") {
          router.push("/customer/dashboard");
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error registering user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-[93vh] bg-gradient-to-br from-green-100 to-green-200">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
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
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="FARMER">Farmer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose your role in the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditionally show farm fields */}
              {form.watch("role") === "FARMER" && (
                <>
                  {/* Farm Name */}
                  <FormField
                    control={form.control}
                    name="farmName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farm Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Green Valley Farm"
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Farm Location */}
                  <FormField
                    control={form.control}
                    name="farmLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farm Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Springfield, IL"
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className={cn(
                  "w-full rounded-2xl shadow-md",
                  loading && "animate-pulse"
                )}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>

              <p className="text-center text-sm mt-2">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-green-600 hover:underline cursor-pointer"
                >
                  Login
                </a>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
