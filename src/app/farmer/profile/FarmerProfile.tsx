import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function FarmerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-xl font-semibold">Not Logged In</h2>
        <Link href="/sign-in">
          <Button className="mt-4">Sign In</Button>
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      products: true,
      orders: true,
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p>User not found.</p>
      </div>
    );
  }

  console.log(user);

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="font-semibold text-3xl capitalize">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">
            {user.name?.toUpperCase()}
          </CardTitle>
          <p className="text-gray-600">{user.email}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-lg font-semibold">{user.products.length}</p>
              <p className="text-sm font-semibold text-gray-500">Products</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-lg font-semibold">{user.orders.length}</p>
              <p className="text-sm font-semibold text-gray-500">Orders</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-lg font-semibold">{user.role}</p>
              <p className="text-sm font-semibold text-gray-500">Role</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Link href="/profile/edit">
              <Button className="cursor-pointer" variant="default">
                Edit Profile
              </Button>
            </Link>
            <form action="/api/auth/signout" method="post">
              <Button
                className="cursor-pointer"
                type="submit"
                variant="destructive"
              >
                Logout
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
