"use client";

import { Logo } from "@/config/logoSite";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const featuresCategories = [
  {
    key: "generate",
    title: "Generate Questions",
    icon: <Logo />,
    descriptions: [
      "Create tailored interview questions based on your field of expertise.",
      "Cover a wide range of topics to ensure comprehensive preparation.",
      "Generate role-specific scenarios to test critical thinking.",
    ],
  },
  {
    key: "provide",
    title: "Answer Assistance",
    icon: <Icon icon="ph:chat-circle-dots-light" width={42} />,
    descriptions: [
      "Get AI-powered suggestions to craft impactful answers.",
      "Practice with model answers to refine your responses.",
      "Simulate real-time interviews with Next Hire AI.",
    ],
  },
  {
    key: "analyze",
    title: "Analyze and Improve",
    icon: <Icon icon="lucide:line-chart" width={42} />,
    descriptions: [
      "Receive detailed feedback on your performance.",
      "Identify strengths and areas for improvement.",
      "Track your progress over time to ensure readiness.",
    ],
  },
];

export default function InterviewProcessCards() {
  return (
    <div className="my-20" id="about">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="tracking-tight inline font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#34e89e] to-[#0f3443] text-[2.3rem] lg:text-5xl leading-9">
          Trusted Process
        </span>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.25,
            },
          },
        }}
      >
        {featuresCategories.map((category) => (
          <motion.div
            key={category.key}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <FeatureCard
              descriptions={category.descriptions}
              icon={category.icon}
              title={category.title}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
