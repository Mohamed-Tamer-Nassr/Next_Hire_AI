"use client";

import { isUserSubscribe } from "@/helper/auth";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InterviewProcessCards from "./interview-process/InterviewProcessCards";
import LandingPageStats from "./layout/landing-page-stats/LandingPageStats";
import Pricing from "./pricing/Pricing";
import Testimonials from "./testimonials/Testimonials";

function Home() {
  const { data } = useSession();
  const user = data?.user;
  const isSubscribed = isUserSubscribe(user);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="flex flex-col items-center justify-center gap-4 py-2 md:py-4"
      id="/"
    >
      {/* Animated Badge with Slide + Fade */}
      <div
        className={`transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <Button
          className="h-9 overflow-hidden border-1 border-default-100 bg-default-50 px-[18px] py-2 text-small font-normal leading-5 text-default-500 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          radius="full"
          variant="bordered"
          onPress={() => {
            toast.success("Coming soon...", { position: "bottom-left" });
          }}
        >
          <span className="relative">
            New onboarding experience
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
          </span>
          <Icon
            className="flex-none outline-none [&>path]:stroke-[2] transition-transform duration-300 group-hover:translate-x-1"
            icon="solar:arrow-right-linear"
            width={20}
          />
        </Button>
      </div>

      {/* Hero Text with Staggered Animation */}
      <div
        className={`inline-block max-w-xl text-center justify-center transform transition-all duration-700 delay-150 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="relative inline-block">
          <span className="tracking-tight inline font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#34e89e] to-[#0f3443] text-[2.3rem] lg:text-5xl leading-9 animate-gradient-x">
            Your Shortcut
          </span>
          {/* Animated underline */}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#34e89e] to-[#0f3443] transform scale-x-0 animate-scale-x origin-left"></div>
        </div>
        <br />
        <span className="tracking-tight inline font-semibold text-[2.3rem] lg:text-5xl leading-9">
          to Interview Success
        </span>
        <div
          className={`w-full my-2 text-lg lg:text-xl text-default-600 block mt-4 transform transition-all duration-700 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          AI-powered interview preparation made simple and effective. Fast,
          intuitive, and built for your career goals.
        </div>
      </div>

      {/* CTA Buttons with Hover Effects */}
      <div
        className={`flex flex-col items-center justify-center gap-6 sm:flex-row transform transition-all duration-700 delay-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <Button
          className="h-10 bg-default-foreground px-[30px] py-[10px] text-small font-medium leading-5 text-background relative overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/50"
          radius="full"
          as={Link}
          href={isSubscribed ? "/app/dashboard" : "/subscribe"}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10">Try Next Hire AI Now</span>
        </Button>
        <a href="#pricing">
          <Button
            className="h-10 border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5 hover:border-primary-400 hover:bg-primary-50 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            radius="full"
            variant="bordered"
          >
            See our plans
            <Icon
              className="text-default-500 [&>path]:stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
              icon="solar:arrow-right-linear"
              width={16}
            />
          </Button>
        </a>
      </div>

      <LandingPageStats />

      <Testimonials />

      <Pricing />

      <InterviewProcessCards />

      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes scale-x {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }

        .animate-scale-x {
          animation: scale-x 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
}

export default Home;
