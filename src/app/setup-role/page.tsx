"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export default function SetupRolePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"FARMER" | "CUSTOMER" | null>(null);
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user already has a role set
  if (session?.user?.role && session.user.role !== "CUSTOMER") {
    router.push(`/${session.user.role.toLowerCase()}/dashboard`);
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    if (selectedRole === "FARMER" && (!farmName.trim() || !farmLocation.trim())) {
      toast.error("Farm name and location are required for farmers");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          farmName: selectedRole === "FARMER" ? farmName.trim() : undefined,
          farmLocation: selectedRole === "FARMER" ? farmLocation.trim() : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          role: selectedRole,
        },
      });

      logger.info("User role updated successfully", {
        userId: session?.user?.id,
        newRole: selectedRole,
        action: "role_setup_complete"
      });

      toast.success("Profile setup complete!");
      
      // Redirect to appropriate dashboard
      router.push(`/${selectedRole.toLowerCase()}/dashboard`);
    } catch (error) {
      logger.error("Failed to update user role", error, {
        userId: session?.user?.id,
        selectedRole,
        action: "role_setup_failed"
      });
      
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-700">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Welcome to Harvest Hub! Please select your role to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">I am a:</Label>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setSelectedRole("CUSTOMER")}
                className={`p-4 text-left border rounded-lg transition-all hover:border-green-300 ${
                  selectedRole === "CUSTOMER" 
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200" 
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-700">🛒 Buyer/Customer</h3>
                    <p className="text-sm text-muted-foreground">
                      I want to buy fresh produce from farmers
                    </p>
                  </div>
                  {selectedRole === "CUSTOMER" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Selected
                    </Badge>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("FARMER")}
                className={`p-4 text-left border rounded-lg transition-all hover:border-green-300 ${
                  selectedRole === "FARMER" 
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200" 
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-700">🌱 Farmer/Producer</h3>
                    <p className="text-sm text-muted-foreground">
                      I want to sell my produce directly to buyers
                    </p>
                  </div>
                  {selectedRole === "FARMER" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Selected
                    </Badge>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Farmer-specific fields */}
          {selectedRole === "FARMER" && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-700">Farm Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name *</Label>
                <Input
                  id="farmName"
                  placeholder="e.g., Green Valley Farm"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmLocation">Farm Location *</Label>
                <Input
                  id="farmLocation"
                  placeholder="e.g., California, USA"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!selectedRole || isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isLoading ? "Setting up..." : "Complete Setup"}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              You can change your role later in your profile settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
