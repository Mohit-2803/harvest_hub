import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["FARMER", "CUSTOMER"], {
      message: "Role is required",
    }),
    farmName: z.string().optional(),
    farmLocation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "FARMER") {
        return data.farmName && data.farmLocation;
      }
      return true;
    },
    {
      message: "Farm name and location are required for farmers",
      path: ["farmName"],
    }
  );

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string(),
  price: z.number().min(1, "Price must be at least 1"),
  imageFile: z.any().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
