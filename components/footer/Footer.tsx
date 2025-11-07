"use client";

import { NextHireLogoComponent } from "@/config/logo";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        relative mt-28 overflow-hidden w-full
        border-t border-gray-200 dark:border-white/10
        bg-gradient-to-b from-gray-50 to-white
        dark:from-[#0D0D0D] dark:to-[#111]
        py-4 lg:py-8
        transition-colors duration-500
      "
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(178,73,248,0.08),transparent_70%)] dark:opacity-100 opacity-0 transition-opacity duration-500" />

      {/* CONTENT */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-8 px-6 md:flex-row md:px-12">
        {/* Logo + Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <Link href="/" prefetch={false} className="flex items-center gap-3">
            <NextHireLogoComponent />
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 transition-colors"
        >
          {[
            { name: "Home", href: "/#/" },
            { name: "About", href: "/#about" },
            { name: "Pricing", href: "/#pricing" },
            {
              name: "Contact",
              href: "https://www.linkedin.com/in/mohamed-tamer-nassr",
              target: "_blank",
            },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              target={link.target}
              className="
                relative transition-all duration-300
                text-gray-700 dark:text-gray-400
                hover:text-black dark:hover:text-white
              "
            >
              {link.name}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-[#34e89e] to-[#0f3443] transition-all duration-300 hover:w-full" />
            </Link>
          ))}
        </motion.nav>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-xs text-gray-500 dark:text-gray-400 md:translate-y-1 transition-colors"
        >
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-black dark:text-white">
            Next Hire AI
          </span>
          . All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}
