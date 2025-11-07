// components/NextHireLogo.tsx

import Image from "next/image";

// Define the dimensions for use in your header
const LOGO_WIDTH = 525; // Adjust as needed
const LOGO_HEIGHT = 100; // Adjust as needed

export const NextHireLogoComponent = ({
  width = 250,
  height = 80,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <div className="relative" style={{ width, height }}>
      <Image
        priority
        src="/NextHire_Logo.png"
        alt="NextHire AI Logo"
        fill
        sizes="(max-width: 600px) 100vw, 120px"
        className="object-contain"
      />
    </div>
  );
};
