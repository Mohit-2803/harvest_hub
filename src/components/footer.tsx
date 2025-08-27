import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t bg-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-green-700">Harvest Hub</h4>
          <p className="text-md text-muted-foreground mt-2">
            Building fair, transparent, and sustainable agri-trade.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-lg text-green-700">Product</h5>
          <ul className="mt-3 space-y-2 text-md text-muted-foreground">
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/roadmap">Roadmap</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-lg text-green-700">Company</h5>
          <ul className="mt-3 space-y-2 text-md text-muted-foreground">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-lg text-green-700">Support</h5>
          <ul className="mt-3 space-y-2 text-md text-muted-foreground">
            <li>
              <Link href="/help">Help Center</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Harvest Hub. All rights reserved.
      </div>
    </footer>
  );
}
