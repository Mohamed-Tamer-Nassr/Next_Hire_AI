// app/AriaProvider.tsx

"use client"; // <--- THIS IS THE CRUCIAL LINE

import { SSRProvider } from "@react-aria/ssr";
import { ReactNode } from "react";

export function AriaProvider({ children }: { children: ReactNode }) {
  // If you are using React 18+, you might not need SSRProvider at all.
  // But if you're getting this error, you likely need this wrapper.
  return <SSRProvider>{children}</SSRProvider>;
}
