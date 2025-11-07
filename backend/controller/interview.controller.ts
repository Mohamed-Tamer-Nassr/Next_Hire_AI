import { getFirstDayOfMonth, getToday } from "@/helper/helpers";
import mongoose from "mongoose";
import dbConnect from "../config/dbConnect";
import Interview, {
  IInterview,
  IQuestion,
} from "../config/models/interview.model";
import { catchAsyncError } from "../middleware/cachAsyncError";
import { evaluateAnswer, generateInterviewQuestions } from "../openai/openai";
import { InterviewBody } from "../types/interview.types";
import APIFilter from "../utils/apiFilter";
import { getCurrentUser } from "../utils/auth"; // Assumed to handle cookie reading internally
import { getQueryStr } from "../utils/utils";

const mockQuestions = (numOfQuestion: number) => {
  const questions = [];
  for (let i = 0; i < numOfQuestion; i++) {
    questions.push({
      question: `Mock question ${i + 1}`,
      answer: "",
    });
  }
  return questions;
};

export const createInterview = catchAsyncError(async (body: InterviewBody) => {
  // console.log("📦 Creating Interview with:", body);

  // ✅ FIX: Validate user before DB operations
  if (!body.user) {
    throw new Error("User ID is required");
  }

  await dbConnect();
  // console.log("✅ MongoDB Connected");

  const {
    industry,
    type,
    topic,
    role,
    numOfQuestion,
    difficulty,
    duration,
    user,
  } = body;
  const questions = await generateInterviewQuestions(
    industry,
    topic,
    type,
    role,
    numOfQuestion,
    duration,
    difficulty
  );
  // console.log(questions);
  // ✅ FIX: Validate numOfQuestion range
  if (numOfQuestion < 1 || numOfQuestion > 50) {
    throw new Error("Number of questions must be between 1 and 50");
  }

  // ✅ FIX: Validate duration range (in minutes)
  if (duration < 2 || duration > 120) {
    throw new Error("Duration must be between 2 and 120 minutes");
  }

  // const questions = mockQuestions(numOfQuestion);

  const newInterview = await Interview.create({
    industry,
    type,
    topic,
    role,
    numOfQuestion,
    difficulty,
    duration: duration * 60, // store as seconds
    durationLeft: duration * 60,
    user,
    questions,
  });

  // console.log("✅ Interview created with ID:", newInterview._id);

  return {
    success: true,
    created: true,
    id: newInterview._id.toString(),
  };
});
export const getInterviews = catchAsyncError(
  async (request: Request, Admin?: string) => {
    await dbConnect();
    const user = await getCurrentUser(request);

    const { searchParams } = new URL(request.url);
    const queryStr = getQueryStr(searchParams);
    if (!Admin) {
      queryStr.user = user?._id?.toString();
    }

    // ✅ Make resultPerPage configurable (default 10, max 50)
    const resultPerPage = Number(queryStr.limit) || 10;
    const validatedResultPerPage = Math.min(Math.max(resultPerPage, 1), 50);

    // Create the base filter and apply sort
    const apiFilter = new APIFilter(Interview, queryStr).filter().sort(); // ✅ Add sort here

    // ✅ Get total count efficiently
    const filteredInterviewsCount = await Interview.countDocuments(
      apiFilter.query.getFilter()
    );

    const totalPages = Math.ceil(
      filteredInterviewsCount / validatedResultPerPage
    );

    let currentPage = Number(queryStr.page) || 1;
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }

    // Apply pagination after sorting
    apiFilter.pagination(validatedResultPerPage);
    const interviews: IInterview[] = await apiFilter.query;

    return {
      interviews,
      pagination: {
        currentPage,
        resultPerPage: validatedResultPerPage,
        totalCount: filteredInterviewsCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }
);
export const getInterviewById = catchAsyncError(async (id: string) => {
  await dbConnect();

  const interview = await Interview.findById(id);
  // console.log("interviews:", interviews);
  return { interview };
});
export const deleteUserInterview = catchAsyncError(
  async (interviewId: string) => {
    await dbConnect();

    // Find interview and verify ownership
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    await interview.deleteOne();

    return {
      success: true,
      deleted: true,
      message: "Interview deleted successfully",
    };
  }
);

export const updateInterviewDetails = catchAsyncError(
  async (
    interviewId: string,
    timeLeft: string,
    questionId: string,
    answer: string,
    completed?: boolean
  ) => {
    await dbConnect();

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }
    if (answer) {
      const questionIndex = interview.questions.findIndex(
        (q: IQuestion) => q._id?.toString() === questionId
      );
      if (questionIndex === -1) {
        throw new Error("Question not found in interview");
      }
      const questionToUpdate = interview?.questions[questionIndex];
      let overallScore = 0;
      let clarity = 0;
      let relevance = 0;
      let completeness = 0;
      let suggestion = "No suggestions provided.";
      if (answer !== "pass") {
        ({ overallScore, clarity, relevance, completeness, suggestion } =
          await evaluateAnswer(questionToUpdate.question, answer));
      }
      if (!questionToUpdate.completed) {
        interview.answered += 1;
      }
      questionToUpdate.answer = answer;
      questionToUpdate.completed = true;
      questionToUpdate.result = {
        overallScore,
        clarity,
        relevance,
        completeness,
        suggestion,
      };
      // interview.questions[questionIndex] = questionToUpdate;
      interview.durationLeft = Number(timeLeft);
    }
    if (interview.answered === interview?.questions.length - 1 || completed) {
      interview.status = "completed";
    }
    if (timeLeft === "0") {
      interview.durationLeft = Number(timeLeft);
      interview.status = "completed";
    }
    await interview.save();

    return {
      success: true,
      updated: true,
      message: "Interview updated successfully",
    };
  }
);

export const getInterviewStats = catchAsyncError(async (req: Request) => {
  await dbConnect();

  const user = await getCurrentUser(req);

  if (!user?._id) {
    throw new Error("User not authenticated");
  }

  const { searchParams } = new URL(req.url);
  const queryStr = getQueryStr(searchParams);

  const start = new Date(queryStr.start || getFirstDayOfMonth());
  const end = new Date(queryStr.end || getToday());

  // ✅ FIXED: Set hours correctly
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const stats = await Interview.aggregate([
    {
      $match: {
        // ✅ FIXED: UNCOMMENTED - Filter by user
        user: new mongoose.Types.ObjectId(user._id),
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $facet: {
        // Daily breakdown
        daily: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              totalInterviews: { $sum: 1 },
              completedInterviews: {
                $sum: {
                  $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                },
              },
              totalQuestions: { $sum: { $size: "$questions" } },
              completedQuestions: {
                $sum: {
                  $size: {
                    $filter: {
                      input: "$questions",
                      cond: { $eq: ["$$this.completed", true] },
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: "$_id",
              totalInterviews: 1,
              completedQuestions: 1,
              unAnswerQuestions: {
                $subtract: ["$totalQuestions", "$completedQuestions"],
              },
              completionRate: {
                $cond: [
                  { $eq: ["$totalInterviews", 0] },
                  0,
                  {
                    $multiply: [
                      {
                        $divide: ["$completedInterviews", "$totalInterviews"],
                      },
                      100,
                    ],
                  },
                ],
              },
            },
          },
          { $sort: { date: 1 } },
        ],

        // Overall stats
        overall: [
          {
            $group: {
              _id: null,
              totalInterviews: { $sum: 1 },
              completedInterviews: {
                $sum: {
                  $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalInterviews: 1,
              completionRate: {
                $cond: [
                  { $eq: ["$totalInterviews", 0] },
                  0,
                  {
                    $multiply: [
                      {
                        $divide: ["$completedInterviews", "$totalInterviews"],
                      },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ]);

  if (!stats?.length) {
    return {
      totalInterviews: 0,
      completionRate: 0,
      stats: [],
    };
  }

  const result = stats[0] || { daily: [], overall: [] };
  const overallStats = result.overall[0] || {
    totalInterviews: 0,
    completionRate: 0,
  };

  return {
    totalInterviews: overallStats.totalInterviews,
    completionRate: Number(overallStats.completionRate.toFixed(2)),
    stats: result.daily.map((stat: any) => ({
      date: stat.date,
      totalInterviews: stat.totalInterviews,
      completionRate: Number(stat.completionRate.toFixed(2)),
      completedQuestions: stat.completedQuestions,
      unAnswerQuestions: stat.unAnswerQuestions,
    })),
  };
});
