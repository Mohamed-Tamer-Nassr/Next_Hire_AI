import { isUserSubscribe } from "@/helper/auth";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const Pricing = () => {
  const { data } = useSession();
  const user = data?.user;
  const isSubscribed = isUserSubscribe(user);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
    "Comprehensive questions",
    "Feedback reports or results",
    "You choose time and field",
    "Industry-specific interviews",
    "Expert video tutorials",
    "Technical question practice",
    "Behavioral question practice",
    "Situational question preparation",
    "24/7 AI mentor support",
    "Soft skills training",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div id="pricing" ref={sectionRef}>
      <div
        className={`text-center my-10 transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <span className="tracking-tight inline font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#34e89e] to-[#0f3443] text-[2.3rem] lg:text-5xl leading-9">
          Pricing
        </span>
      </div>

      <div
        className={`flex justify-center transform transition-all duration-700 delay-200 ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <Card className="max-w-[400px] p-2 border-solid border-4 border-blue-400 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 group relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Floating particles effect */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-float-1 opacity-0 group-hover:opacity-60"></div>
          <div className="absolute top-10 right-10 w-3 h-3 bg-purple-400 rounded-full animate-float-2 opacity-0 group-hover:opacity-60"></div>
          <div className="absolute bottom-20 left-10 w-2 h-2 bg-pink-400 rounded-full animate-float-3 opacity-0 group-hover:opacity-60"></div>

          <CardHeader className="flex gap-3 mb-3 relative z-10">
            <div className="flex flex-col">
              <p className="text-xl font-extrabold group-hover:text-blue-500 transition-colors duration-300">
                Pro Version
              </p>
              <p className="text-md text-default-500 group-hover:text-default-700 transition-colors duration-300">
                Best for all types of users
              </p>
            </div>
            {/* Popular badge */}
            <div className="ml-auto">
              <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-slow">
                Popular
              </span>
            </div>
          </CardHeader>
          <Divider className="group-hover:bg-blue-400 transition-colors duration-300" />
          <CardBody className="relative z-10">
            <div className="flex items-baseline space-x-1 transform group-hover:scale-110 transition-transform duration-300 origin-left">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 animate-gradient-x">
                  $9.99
                </span>
              </h1>
              <p className="group-hover:text-blue-500 transition-colors duration-300">
                / month
              </p>
            </div>

            <ul className="mt-8 max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-center transform transition-all duration-500 hover:translate-x-2 hover:text-blue-500 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 400}ms` }}
                >
                  <Icon
                    icon="hugeicons-tick-02"
                    fontSize={26}
                    color="green"
                    className="flex-shrink-0 transition-transform duration-300 hover:scale-125"
                  />{" "}
                  <span className="ml-2">{feature}</span>
                </li>
              ))}
            </ul>
          </CardBody>
          <Divider className="group-hover:bg-blue-400 transition-colors duration-300" />
          <CardFooter className="relative z-10">
            <Button
              color="primary"
              className="w-full my-3 relative overflow-hidden group/btn hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              endContent={
                <Icon
                  icon="akar-icons:arrow-right"
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              }
              as={Link}
              href={isSubscribed ? "/app/dashboard" : "/subscribe"}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Get Started</span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -20px);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-15px, 15px);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -10px);
          }
        }
        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 3.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Pricing;
