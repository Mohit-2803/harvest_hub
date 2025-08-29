"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export function useRoleSetup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      // Check if user needs role setup
      const needsRoleSetup = 
        session.user.role === "CUSTOMER" && 
        !session.user.email?.includes("@") || // This is a simple check, you might want more sophisticated logic
        window.location.pathname !== "/setup-role";

      // For OAuth users, check if they just signed up (you might want to use a timestamp or other logic)
      const isNewUser = sessionStorage.getItem('oauth-signup') === 'true';
      
      if (isNewUser && needsRoleSetup && window.location.pathname !== "/setup-role") {
        logger.info("Redirecting OAuth user to role setup", {
          userId: session.user.id,
          action: "oauth_role_setup_redirect"
        });
        
        setShouldRedirect(true);
        sessionStorage.removeItem('oauth-signup'); // Clean up
        router.push("/setup-role");
      }
    }
  }, [session, status, router]);

  return {
    needsRoleSetup: shouldRedirect,
    isLoading: status === "loading"
  };
}
