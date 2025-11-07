"use client";

import Breadcrumb from "@/components/layout/Breadcrumb/Breadcrumb";
import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import usePageTitle from "@/hook/usePageTitle";
import { usePathname } from "next/navigation";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { title, breadcrumbs } = usePageTitle();
  const pathName = usePathname();
  const noBreadcrumbPaths = ["/app/interviews/conduct/"];
  const shouldShowBreadcrumb = !noBreadcrumbPaths.some((path) =>
    pathName.startsWith(path)
  );
  return (
    <div className="grid grid-cols-1  gap-4 md:grid-cols-12 md:gap-10">
      <div className="col-span-1 md:col-span-4 lg:col-span-3">
        <AppSidebar />
      </div>
      <div className="col-span-1 md:col-span-8 lg:col-span-9">
        {shouldShowBreadcrumb && (
          <Breadcrumb title={title} breadcrumbs={breadcrumbs} />
        )}
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
