import { useState } from "react";

function useGenericSubmitHandler(
  callback: (data: Record<string, string>) => Promise<any>
) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      await callback(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSubmit };
}

export { useGenericSubmitHandler };
