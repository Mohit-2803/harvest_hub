"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showRoleSetupBanner, setShowRoleSetupBanner] = useState(false);

  // Check if OAuth user needs role setup - database-based approach
  useEffect(() => {
    if (user && user.role === "CUSTOMER") {
      // Fetch profile setup status from database
      const checkProfileStatus = async () => {
        try {
          const response = await fetch("/api/auth/profile-status");
          if (response.ok) {
            const data = await response.json();

            // Show banner if profile setup is not completed
            if (
              data.needsSetup &&
              !sessionStorage.getItem(`setup_banner_shown_${user.id}`)
            ) {
              setShowRoleSetupBanner(true);
              // Mark that we've shown the banner in this session
              sessionStorage.setItem(`setup_banner_shown_${user.id}`, "true");
            }
          }
        } catch (error) {
          console.error("Failed to check profile status:", error);
        }
      };

      checkProfileStatus();
    }
  }, [user]);

  const handleCompleteProfile = () => {
    router.push("/setup-role");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Role Setup Banner for OAuth Users */}
      {showRoleSetupBanner && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👋</span>
              <div>
                <p className="font-medium">
                  Complete your profile to get the full Harvest Hub experience!
                </p>
                <p className="text-sm opacity-90">
                  Are you a farmer looking to sell, or a buyer looking to
                  purchase?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCompleteProfile}
                variant="secondary"
                size="sm"
                className="text-purple-700 hover:text-purple-800"
              >
                Complete Profile
              </Button>
              <Button
                onClick={() => {
                  setShowRoleSetupBanner(false);
                  // Mark that user dismissed the banner (not permanently, just for this session)
                  if (user?.id) {
                    // Use session dismissal - will show again on next visit unless they complete setup
                    localStorage.setItem(
                      `profile_banner_dismissed_${user.id}`,
                      "session"
                    );
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-semibold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent"
        >
          Welcome to Harvest Hub 🌱
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Bridging Farmers, Buyers, and Experts together for a sustainable
          future.
        </p>
      </section>

      {/* Call to Action Banner */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white p-10 md:p-14 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">
                Explore Harvest Hub community
              </h3>
              <p className="mt-2 font-bold text-white/90">
                Start connecting with trusted partners and grow a more resilient
                supply chain.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              {!user ? (
                <>
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-2xl text-green-700"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="rounded-2xl bg-white text-green-700 hover:bg-white/90"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href={`/${user.role.toLowerCase()}/dashboard`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-2xl text-green-700"
                  >
                    Open Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 max-w-6xl mx-auto">
        {[
          {
            title: "For Farmers",
            desc: "Connect with buyers directly, sell your produce at fair prices, and get expert guidance.",
          },
          {
            title: "For Buyers",
            desc: "Find fresh and organic produce directly from trusted farmers. Buy at the best prices.",
          },
          {
            title: "For Experts",
            desc: "Offer agricultural advice, share knowledge, and support the farming community.",
          },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center">
          How It Works
        </h2>
        <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">
          Simple steps to connect and trade sustainably.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {[
            {
              step: "1",
              title: "Create Account",
              desc: "Sign up as a Farmer, Buyer, or Expert.",
            },
            {
              step: "2",
              title: "Build Profile",
              desc: "Add produce, preferences, and expertise.",
            },
            {
              step: "3",
              title: "Connect",
              desc: "Discover and message the right partners.",
            },
            {
              step: "4",
              title: "Trade & Grow",
              desc: "Close deals, get advice, and scale.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-2xl bg-white p-6 shadow border"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                {item.step}
              </div>
              <h3 className="mt-4 font-semibold text-green-700">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-4">
          {[
            {
              q: "Is there a fee to join?",
              a: "Creating an account is free. Transaction or premium features may carry fees depending on the plan.",
            },
            {
              q: "How are users verified?",
              a: "We use email verification and optional KYC/document checks for sellers to increase trust.",
            },
            {
              q: "Can I use both buyer and farmer roles?",
              a: "Yes, you can update your profile preferences anytime and access relevant features.",
            },
            {
              q: "How do I contact support?",
              a: "Visit the Help page from your dashboard or email support for assistance.",
            },
          ].map((item, i) => (
            <motion.details
              key={item.q}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl bg-white p-5 shadow border"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="font-semibold text-green-700">{item.q}</span>
                <span className="text-green-600 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center">
          What Our Community Says
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            {
              name: "Asha, Farmer",
              quote:
                "Sold my harvest directly to local stores. Better prices and faster payments!",
            },
            {
              name: "Rahul, Buyer",
              quote:
                "I source fresh produce weekly from verified farmers with confidence.",
            },
            {
              name: "Meera, Expert",
              quote:
                "I love mentoring small farmers and seeing their yields improve season over season.",
            },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-white p-6 shadow border"
            >
              <p className="text-muted-foreground italic">“{t.quote}”</p>
              <p className="mt-4 font-semibold text-green-700">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
