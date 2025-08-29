import { DefaultSession } from "next-auth";

// Type definitions for NextAuth with role-based authentication
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "FARMER" | "CUSTOMER" | "ADMIN";
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }

  interface User {
    id: string;
    role: "FARMER" | "CUSTOMER" | "ADMIN";
    name: string | null;
    email: string | null;
    image: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "FARMER" | "CUSTOMER" | "ADMIN";
    name: string | null;
    email: string | null;
    image: string | null;
  }
}
