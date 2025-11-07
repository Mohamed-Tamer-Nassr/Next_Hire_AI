import { adminPages, appPages, nestedPages } from "@/constants/page";
import { match } from "path-to-regexp";

interface pageTitle {
  title: string;
  breadcrumb?: Array<{ name: string; path: string }>;
}
export const getPageTitle = (pathname: string): pageTitle => {
  const pageToCheck = pathname?.includes("/admin")
    ? adminPages
    : [...appPages, ...nestedPages];
  for (const page of pageToCheck) {
    const matcher = match(page.path, { decode: decodeURIComponent });
    if (matcher(pathname)) {
      return { title: page.title, breadcrumb: page.breadcrumb };
    }
  }
  return {
    title: "not Found",
    breadcrumb: [{ name: "not Found", path: "/" }],
  };
};
