type HandlerFunction = (...args: any[]) => Promise<any>;

interface ValidationError {
  message: string;
  statusCode: number;
}

function extractError(error: any) {
  // Handle MongoDB duplicate key error
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return {
      message: `${
        field || "Field"
      } already exists. Please use a different one.`,
      statusCode: 400,
    };
  }

  // Handle Mongoose validation errors
  if (error?.name === "ValidationError") {
    return {
      message: Object.values<ValidationError>(error.errors)
        .map((el: any) => el.message)
        .join(", "),
      statusCode: 400,
    };
  }

  // Handle errors with message property
  if (error?.message) {
    return {
      message: error.message,
      statusCode: error.statusCode || 400,
    };
  }

  // Handle axios/fetch errors
  if (error?.response?.data?.message) {
    return {
      message: error.response.data.message,
      statusCode: error.response.status || 400,
    };
  }

  return {
    message: "Internal Server Error",
    statusCode: 500,
  };
}

export const catchAsyncError =
  (handler: HandlerFunction) =>
  async (...args: any[]) => {
    try {
      const result = await handler(...args);
      return result; // Returns success object from handler
    } catch (error: any) {
      const { message, statusCode } = extractError(error);

      // ✅ FIX: Return consistent structure matching server action expectations
      return {
        success: false,
        error: message,
        statusCode,
      };
    }
  };
