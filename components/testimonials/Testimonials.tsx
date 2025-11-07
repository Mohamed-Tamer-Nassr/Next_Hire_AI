import { testimonials } from "@/constants/constants";
import { User } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col gap-4 my-10" ref={sectionRef}>
      <div
        className={`text-center transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <span className="tracking-tight inline font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#34e89e] to-[#0f3443] text-[2.3rem] lg:text-5xl leading-9">
          Testimonials
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`rounded-medium bg-content1 p-5 shadow-small hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group relative overflow-hidden ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
                <User
                  avatarProps={{
                    src: testimonial?.user?.avatar,
                    className:
                      "ring-2 ring-transparent group-hover:ring-primary-400 transition-all duration-300",
                  }}
                  classNames={{
                    name: "font-medium group-hover:text-primary-500 transition-colors duration-300",
                    description: "text-small",
                  }}
                  name={testimonial?.user?.name || "User Name"}
                />
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={i}
                    className={`transition-all duration-300 ${
                      i + 1 <= testimonial?.rating
                        ? "text-warning scale-100 group-hover:scale-110"
                        : "text-default-300"
                    }`}
                    icon="solar:star-bold"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 w-full relative z-10">
              <p className="font-medium text-default-900 group-hover:text-primary-600 transition-colors duration-300">
                {testimonial?.title || "Testimonial Title"}
              </p>
              <p className="mt-2 text-default-500 group-hover:text-default-700 transition-colors duration-300">
                {testimonial?.content || "Testimonial Content"}
              </p>
            </div>

            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
