"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import {
  ThemeProvider as NextThemeProvider,
  ThemeProviderProps,
} from "next-themes";
import { useRouter } from "next/navigation";

type ProviderProps = {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
};

function HeroProvider({ children, themeProps }: ProviderProps) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemeProvider {...themeProps}>
        <SessionProvider>{children}</SessionProvider>
      </NextThemeProvider>
    </HeroUIProvider>
  );
}
export default HeroProvider;
