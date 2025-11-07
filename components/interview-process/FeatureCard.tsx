"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import React from "react";

export type FeatureCardProps = {
  title: string;
  descriptions: string[];
  icon: React.ReactNode;
};

const FeatureCard = ({ title, descriptions = [], icon }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        rotateX: 2,
        rotateY: -2,
        boxShadow: "0px 12px 40px rgba(178, 73, 248, 0.2)",
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="rounded-xl"
    >
      <Card
        className="
    bg-white dark:bg-gradient-to-b dark:from-[#1E1E1E] dark:to-[#111]
    border border-gray-200 dark:border-[#2A2A2A]/70
    backdrop-blur-xl transition-all duration-500
  "
        shadow="none"
      >
        <CardHeader className="flex flex-col items-center gap-3 px-4 pb-4 pt-6">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white/90">
            {title}
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-2">
          {descriptions.map((description, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="
          flex min-h-[50px] rounded-lg
          bg-gray-100 dark:bg-[#2A2A2A]/60
          px-3 py-2
          text-gray-700 dark:text-gray-300
          hover:bg-gray-200 dark:hover:bg-[#333]/70
          transition-all
        "
            >
              <p className="text-sm">{description}</p>
            </motion.div>
          ))}
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
