"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logger";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error when the error page mounts
    logger.error("Global error page rendered", error, {
      digest: error.digest,
      action: "global_error_page"
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600 text-2xl">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            We encountered an unexpected error. Our team has been notified and is working to fix it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && (
            <div className="text-sm bg-red-50 p-4 rounded-lg border border-red-200">
              <details>
                <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                  🐛 Error Details (Development Mode)
                </summary>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Message:</span>
                    <p className="text-red-700 mt-1">{error.message}</p>
                  </div>
                  {error.digest && (
                    <div>
                      <span className="font-medium">Digest:</span>
                      <p className="text-red-700 mt-1 font-mono text-xs">{error.digest}</p>
                    </div>
                  )}
                  {error.stack && (
                    <div>
                      <span className="font-medium">Stack Trace:</span>
                      <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-auto max-h-40">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset} 
              variant="outline" 
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Go Home
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
