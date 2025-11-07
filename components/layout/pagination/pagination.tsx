"use client";
import { updateSearchParams } from "@/helper/helpers";
import { Pagination } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Updated Props to match new pagination structure
interface Props {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function Custompagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Fixed: Use 'p' parameter correctly in the handler
  const handlePageChange = (p: number) => {
    let queryParams = new URLSearchParams(window.location.search);
    // ✅ Fixed: Was using 'page' variable instead of 'p' parameter
    queryParams = updateSearchParams(queryParams, "page", p.toString());
    const path = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(path);
  };

  // ✅ Don't render if only 1 page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <Pagination
        isCompact
        showControls
        showShadow
        // ✅ Removed initialPage (not needed with controlled 'page' prop)
        total={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        // ✅ Added: Disable controls based on actual page state
        isDisabled={totalPages === 0}
      />
    </div>
  );
}

export default Custompagination;
