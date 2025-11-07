"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.error("Error occurred:", error);
  }, [error]);

  const getErrorDetails = (message: string) => {
    if (message.includes("completed interview")) {
      return {
        title: "Interview Already Completed",
        description:
          "This interview has been finalized. You can view your results in the dashboard.",
        emoji: "✅",
        showRetry: false,
      };
    }
    if (message.includes("fetch")) {
      return {
        title: "Connection Issue",
        description:
          "We're having trouble connecting to our servers. Please check your internet connection.",
        emoji: "🌐",
        showRetry: true,
      };
    }
    return {
      title: "Unexpected Error",
      description:
        "Our AI interviewer encountered an unexpected situation. Don't worry, your progress is saved.",
      emoji: "✦︎",
      showRetry: true,
    };
  };

  const errorDetails = getErrorDetails(error?.message || "");

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 px-6 mt-3">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-2xl"
      >
        {/* Error emoji with pulsing effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-8xl mb-8 text-center"
        >
          {errorDetails.emoji}
        </motion.div>

        {/* Error title with gradient */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-6xl font-black mb-6 text-center"
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {errorDetails.title}
          </span>
        </motion.h1>

        {/* Error message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300 mb-4 text-center max-w-lg mx-auto"
        >
          {errorDetails.description}
        </motion.p>

        {/* Technical error message (collapsed by default) */}
        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8 text-center"
        >
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400 transition-colors mb-2">
            Technical Details
          </summary>
          <p className="text-xs text-gray-600 bg-gray-900/50 rounded-lg p-4 font-mono max-w-lg mx-auto break-words">
            {error?.message || "Unknown error occurred"}
            {error?.digest && (
              <span className="block mt-2 text-gray-700">
                Error ID: {error.digest}
              </span>
            )}
          </p>
        </motion.details>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {errorDetails.showRetry && (
            <button
              onClick={() => reset()}
              className="group relative px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </span>
            </button>
          )}

          <Link
            href="/app/dashboard"
            className="group relative px-8 py-3.5 rounded-xl text-base font-semibold bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </span>
          </Link>

          <Link
            href="/"
            className="group relative px-8 py-3.5 rounded-xl text-base font-semibold bg-transparent border border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Home
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 text-center z-10"
      >
        <p className="text-gray-500 text-sm mb-2">
          Powered by AI-driven interview intelligence
        </p>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-bold text-lg">
          NextHire AI
        </p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
    </div>
  );
}
