import { Logo } from "@/config/logoSite";
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Main loader container */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-green-600 dark:border-t-green-500 animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-600 dark:bg-green-500 rounded-full animate-pulse opacity-20"></div>

        {/* Center logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Logo width={40} height={40} />
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Preparing Your Interview
        </p>
        <div className="flex items-center justify-center mt-2 space-x-1">
          <span
            className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
