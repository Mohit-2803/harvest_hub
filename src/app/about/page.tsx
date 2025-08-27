export const metadata = {
  title: "About Us",
  description: "Learn more about Harvest Hub and our mission.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          About Harvest Hub
        </h1>
        <p className="mt-3 text-gray-600">
          A local farmers’ marketplace for fresh, transparent, and secure
          shopping.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
          <p className="mt-2 text-gray-600">
            Empower local agriculture by making farm-to-table shopping simple,
            transparent, and secure.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            What We Offer
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
            <li>Product listings with price, quantity, and farm location.</li>
            <li>Filters by category, location, and price range.</li>
            <li>Cart and secure Stripe checkout.</li>
            <li>Authentication to manage purchases and orders.</li>
            <li>Real-time notifications for product updates.</li>
            <li>Server-side rendering for speed and SEO.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            How It Works
          </h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-gray-600">
            <li>Explore fresh produce from local farms.</li>
            <li>Filter to find what fits preferences and budget.</li>
            <li>Add to cart and pay securely with Stripe.</li>
            <li>Track orders and receive updates in real time.</li>
          </ol>
        </div>

        <aside className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Security & Trust
          </h3>
          <ul className="mt-2 space-y-2 text-gray-600">
            <li>Token-based authentication.</li>
            <li>Stripe-powered payments.</li>
            <li>Privacy-first data handling.</li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-gray-900">
            Why Local?
          </h3>
          <p className="mt-2 text-gray-600">
            Support farmers, reduce food miles, and build resilient food
            systems—one order at a time.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="/customer/marketplace"
              className="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700"
            >
              Browse Marketplace
            </a>
            <a
              href="/register"
              className="block w-full rounded-lg border px-4 py-2 text-center text-gray-900 hover:bg-gray-50"
            >
              Create an Account
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
