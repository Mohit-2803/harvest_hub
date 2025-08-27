"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-md font-medium rounded-md transition block",
        active
          ? "text-green-700 bg-green-200"
          : "text-muted-foreground hover:text-green-700 hover:bg-green-100"
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const baseItems = [
    { href: "/", label: "Home" },
    { href: `/customer/marketplace`, label: "Marketplace" },
    { href: "/experts", label: "Experts" },
    { href: "/about", label: "About" },
  ];

  const items =
    user?.role === "ADMIN"
      ? [...baseItems, { href: "/admin", label: "Admin" }]
      : baseItems;

  const AuthButtons = ({ mobile }: { mobile?: boolean }) => {
    if (isLoading)
      return <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />;

    if (user) {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback className="font-semibold">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user.name?.toUpperCase() ?? "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="font-medium cursor-pointer"
                onClick={() =>
                  router.push(`/${user.role?.toLowerCase()}/dashboard`)
                }
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-medium cursor-pointer"
                onClick={() =>
                  router.push(`/${user.role?.toLowerCase()}/profile`)
                }
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 font-medium cursor-pointer"
                onClick={() => logout?.()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }

    return (
      <>
        <Link href="/login" onClick={() => mobile && setOpen(false)}>
          <Button
            className={cn(
              "rounded-2xl shadow-md cursor-pointer",
              mobile && "w-full"
            )}
          >
            Login
          </Button>
        </Link>
        <Link href="/register" onClick={() => mobile && setOpen(false)}>
          <Button
            variant="outline"
            className={cn(
              "rounded-2xl border-green-500 text-green-700 hover:bg-green-50 cursor-pointer",
              mobile && "w-full"
            )}
          >
            Register
          </Button>
        </Link>
      </>
    );
  };

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold shadow">
            H
          </span>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-500">
            Harvest Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href))
              }
            />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <AuthButtons />
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border text-green-700 hover:bg-green-50"
          onClick={() => setOpen((s) => !s)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor">
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href))
                  }
                />
              ))}
              <div className="pt-2 border-t mt-2 flex flex-col gap-2">
                <AuthButtons mobile />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
