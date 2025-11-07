"use client";

import { Logo } from "@/config/logoSite";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden transition-colors bg-transparent text-gray-900 dark:text-white">
      {/* Background glow layers */}
      <motion.div
        className="absolute -z-10 w-[500px] h-[500px] rounded-full 
        bg-gradient-to-r from-blue-400/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-600/10 
        blur-[120px]"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -z-10 top-1/4 left-1/3 w-[300px] h-[300px] rounded-full 
        bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-500/10 dark:to-pink-500/10 
        blur-[100px]"
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Brand / Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
        <div className="h-10 mx-auto mb-4 translate-x-9">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide text-gray-700 dark:text-gray-300">
          Next Hire AI
        </h1>
      </motion.div>

      {/* 404 number */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-8xl font-extrabold 
          bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
          dark:from-blue-400 dark:via-purple-400 dark:to-pink-500 
          bg-clip-text text-transparent"
      >
        404
      </motion.h1>

      {/* Main message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100"
      >
        Page not found
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-2 text-gray-500 dark:text-gray-400 max-w-md text-center"
      >
        The page you’re looking for doesn’t exist or has been moved. Let’s get
        you back to where you belong.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl font-medium 
            bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-500 hover:to-purple-500 
            dark:from-blue-500 dark:to-purple-500 
            dark:hover:from-blue-400 dark:hover:to-purple-400 
            transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
        >
          Go Home
        </Link>
      </motion.div>

      {/* Minimal floating AI symbol */}
      <motion.div
        className="absolute bottom-10 right-10 opacity-50 hidden md:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          className="w-14 h-14 text-purple-500 dark:text-purple-400"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M32 20a12 12 0 100 24 12 12 0 000-24z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>
      </motion.div>
    </div>
  );
}
