"use server";

import {
  createInterview,
  deleteUserInterview,
  updateInterviewDetails,
} from "@/backend/controller/interview.controller";
import { InterviewBody } from "@/backend/types/interview.types";

export async function NewInterview(body: InterviewBody) {
  try {
    // ✅ FIX: Validate user ID before proceeding
    if (!body.user) {
      return {
        success: false,
        error: "User authentication required. Please sign in again.",
      };
    }

    const result = await createInterview(body);

    // ✅ FIX: Check if result contains an error from catchAsyncError
    if (!result.success) {
      // console.error("❌ Controller Error:", result.error);
      return {
        success: false,
        error: result.error || "Failed to create interview",
      };
    }

    // console.log("✅ Interview Created:", result.id);
    return result;
  } catch (error: any) {
    // console.error("❌ Server Action Error:", error);
    return {
      success: false,
      error: error?.message || "Unexpected server error",
    };
  }
}

// In interview.action.ts
export async function deleteInterview(interviewId: string) {
  try {
    const result = await deleteUserInterview(interviewId);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to delete interview",
      };
    }

    return result;
  } catch (error: any) {
    // console.error("❌ Server Action Error:", error);
    return {
      success: false,
      error: error?.message || "Unexpected server error",
    };
  }
}

export async function updateInterview(
  interviewId: string,
  timeLeft: string,
  questionId: string,
  answer: string,
  completed?: boolean
) {
  return await updateInterviewDetails(
    interviewId,
    timeLeft,
    questionId,
    answer,
    completed
  );
}
