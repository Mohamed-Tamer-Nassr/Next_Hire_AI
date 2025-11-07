"use client";

import Breadcrumb from "@/components/layout/Breadcrumb/Breadcrumb";
import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import usePageTitle from "@/hook/usePageTitle";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { title, breadcrumbs } = usePageTitle();

  return (
    <div className="grid grid-cols-1  gap-4 md:grid-cols-12 md:gap-10">
      <div className="col-span-1 md:col-span-4 lg:col-span-3">
        <AppSidebar />
      </div>
      <div className="col-span-1 md:col-span-8 lg:col-span-9">
        <Breadcrumb title={title} breadcrumbs={breadcrumbs} />
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
