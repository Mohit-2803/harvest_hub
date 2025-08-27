"use client";

import Link from "next/link";

export default function DeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-semibold text-red-500 mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-6">
          You don’t have permission to view this page.
        </p>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Why this happened:
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• You are not logged in to your account.</li>
            <li>
              • Your role does not have access to this page (e.g., Admin-only or
              not authorized section).
            </li>
            <li>• The resource you’re trying to view is restricted.</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Go Home
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
