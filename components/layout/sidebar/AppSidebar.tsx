"use client";

import { adminPages, appPages } from "@/constants/page";
import { getPageIconAndPath } from "@/helper/helpers";
import { Button, cn, Link, Listbox, ListboxItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
}

export const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div
    className={cn(
      className,
      "flex items-center rounded-small justify-center w-7 h-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
    )}
  >
    {children}
  </div>
);

const AppSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [selected, setSelected] = useState<Key>(pathName);
  const [isVisible, setIsVisible] = useState(false);
  const pages = pathName.includes("/admin") ? adminPages : appPages;

  useEffect(() => {
    setSelected(pathName);
  }, [pathName]);

  useEffect(() => {
    // Stagger animation on mount
    setIsVisible(true);
  }, []);

  const handlerAction = (key: Key) => {
    setSelected(key);
    router.push(key?.toString());
  };

  return (
    <div
      className={cn(
        "sticky top-[90px] z-10 transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      )}
    >
      <Listbox
        aria-label="User Menu"
        className="py-8 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small rounded-medium backdrop-blur-xl"
        itemClasses={{
          base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none h-12 data-[hover=true]:bg-default-100/80",
        }}
        selectedKeys={[selected]}
        onAction={handlerAction}
      >
        <ListboxItem
          key="#"
          className={cn(
            "mt-3 transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
          textValue="New Interview"
          startContent={
            <Button
              className="bg-foreground font-bold text-background w-full relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              color="secondary"
              endContent={
                <Icon
                  icon="ep:circle-plus-filled"
                  className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110"
                />
              }
              variant="flat"
              as={Link}
              href="/app/interviews/new"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span className="relative">New Interview</span>
            </Button>
          }
        />
        <>
          {pages.map((page, index) => {
            const isSelected = selected?.toString()?.includes(page.path);
            const pageData = getPageIconAndPath(page.path);

            return (
              <ListboxItem
                key={page.path}
                className={cn(
                  "mt-3 font-semibold group relative overflow-hidden transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
                  isSelected &&
                    "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900",
                  isSelected && "shadow-inner",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{
                  transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
                }}
                startContent={
                  <IconWrapper
                    className={cn(
                      `bg-${pageData.color}/10 text-${pageData.color}`,
                      isSelected && `bg-${pageData.color}/20 shadow-sm`
                    )}
                  >
                    <Icon
                      icon={pageData.icon}
                      className={cn(
                        "text-lg transition-all duration-300",
                        isSelected && "scale-110"
                      )}
                    />
                  </IconWrapper>
                }
                textValue=""
              >
                <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
                  {page.title}
                </span>
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full animate-pulse" />
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </ListboxItem>
            );
          })}
        </>
      </Listbox>
    </div>
  );
};

export default AppSidebar;
