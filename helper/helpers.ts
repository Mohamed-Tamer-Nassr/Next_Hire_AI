// import { IQuestion } from "@/backend/config/models/interview.model";
// import { pageIcons } from "@/constants/page";

// export function getPageIconAndPath(pathName: string): {
//   icon: string;
//   color: string;
// } {
//   return pageIcons[pathName];
// }

// export const getFirstIncompletedQuestionIndex = (questions: IQuestion[]) => {
//   const firstIncompleteQuestion = questions.findIndex((q) => !q?.completed);
//   return firstIncompleteQuestion === -1 ? 0 : firstIncompleteQuestion;
// };

// export const formatTime = (totalSeconds: number) => {
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   const formattedMinutes = String(minutes).padStart(2, "0");
//   const formattedSeconds = String(seconds).padStart(2, "0");
//   return `${formattedMinutes}:${formattedSeconds}`;
// };

// export const saveAnswerToLocalStorage = (
//   interviewId: string,
//   questionId: string,
//   answer: string
// ) => {
//   const key = `interview_${interviewId}_answers`;
//   const savedAnswers = JSON.parse(localStorage.getItem(key) || "{}") || {};
//   savedAnswers[questionId] = answer;
//   // console.log("stored Answer", savedAnswers);
//   localStorage.setItem(key, JSON.stringify(savedAnswers));
// };

// export const getAnswerFromLocalStorage = (
//   interviewId: string,
//   questionId: string
// ): string => {
//   const key = `interview_${interviewId}_answers`;
//   const savedAnswers = JSON.parse(localStorage.getItem(key) || "{}") || {};
//   return savedAnswers[questionId] || "";
// };

// export const getAnswersFromLocalStorage = (interviewId: string) => {
//   const key = `interview_${interviewId}_answers`;
//   const savedAnswers = localStorage.getItem(key);
//   return savedAnswers ? JSON.parse(savedAnswers) : null;
// };

import { IQuestion } from "@/backend/config/models/interview.model";
import { pageIcons } from "@/constants/page";

export function getPageIconAndPath(pathName: string): {
  icon: string;
  color: string;
} {
  return pageIcons[pathName];
}

export const getFirstIncompletedQuestionIndex = (questions: IQuestion[]) => {
  const firstIncompleteQuestion = questions.findIndex((q) => !q?.completed);
  return firstIncompleteQuestion === -1 ? 0 : firstIncompleteQuestion;
};

export const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

// ============ Enhanced LocalStorage Functions ============

/**
 * Save an answer to localStorage
 */
export const saveAnswerToLocalStorage = (
  interviewId: string,
  questionId: string,
  answer: string
) => {
  const key = `interview_${interviewId}_answers`;
  const savedAnswers = JSON.parse(localStorage.getItem(key) || "{}") || {};
  savedAnswers[questionId] = answer;
  localStorage.setItem(key, JSON.stringify(savedAnswers));
};

/**
 * Get a specific answer from localStorage
 */
export const getAnswerFromLocalStorage = (
  interviewId: string,
  questionId: string
): string => {
  const key = `interview_${interviewId}_answers`;
  const savedAnswers = JSON.parse(localStorage.getItem(key) || "{}") || {};
  return savedAnswers[questionId] || "";
};

/**
 * Get all answers for an interview from localStorage
 */
export const getAnswersFromLocalStorage = (interviewId: string) => {
  const key = `interview_${interviewId}_answers`;
  const savedAnswers = localStorage.getItem(key);
  return savedAnswers ? JSON.parse(savedAnswers) : null;
};

// ============ Session Management Functions ============

/**
 * Save interview session state (question index, time left)
 */
export const saveInterviewSession = (
  interviewId: string,
  data: {
    currentQuestionIndex: number;
    timeLeft: number;
    lastUpdated: number;
  }
) => {
  const key = `interview_${interviewId}_session`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Get interview session state
 */
export const getInterviewSession = (interviewId: string) => {
  const key = `interview_${interviewId}_session`;
  const session = localStorage.getItem(key);
  return session ? JSON.parse(session) : null;
};

/**
 * Clear all interview data (session + answers)
 */
export const clearInterviewSession = (interviewId: string) => {
  const sessionKey = `interview_${interviewId}_session`;
  const answersKey = `interview_${interviewId}_answers`;
  localStorage.removeItem(sessionKey);
  localStorage.removeItem(answersKey);
};

/**
 * Check if session is still valid (within 24 hours)
 */
export const isSessionValid = (lastUpdated: number): boolean => {
  const sessionAge = Date.now() - lastUpdated;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return sessionAge < maxAge;
};

// ============ Utility Functions ============

/**
 * Get progress percentage
 */
export const getProgressPercentage = (
  currentIndex: number,
  totalQuestions: number
): number => {
  return ((currentIndex + 1) / totalQuestions) * 100;
};

/**
 * Count answered questions
 */
export const countAnsweredQuestions = (answers: {
  [key: string]: string;
}): number => {
  return Object.values(answers).filter(
    (answer) => answer && answer !== "" && answer !== "pass"
  ).length;
};

/**
 * Check if all questions are answered
 */
export const areAllQuestionsAnswered = (
  questions: IQuestion[],
  answers: { [key: string]: string }
): boolean => {
  return questions.every((q) => {
    const questionId = q._id.toString();
    return answers[questionId] && answers[questionId] !== "";
  });
};

export const calculateAverageScore = (questions: IQuestion[]) => {
  if (!questions || questions.length === 0) return 0;

  const totalScore = questions.reduce(
    (sum, question) => sum + (question?.result?.overallScore || 0),
    0
  );

  return (totalScore / questions.length).toFixed(1);
};

export const calculateDuration = (duration: number, durationLeft: number) => {
  const durationUsedMinutes = ((duration - durationLeft) / 60).toFixed(0);
  const totalDuration = (duration / 60).toFixed(0);
  return {
    total: parseInt(totalDuration),
    strValue: `${durationUsedMinutes} / ${totalDuration} min`,
    chartDataValue: parseFloat(durationUsedMinutes),
  };
};

export const getTotalPage = (
  totalQuestions: number,
  questionPerPage: number
) => {
  const totalPage = Math.ceil(totalQuestions / questionPerPage);
  return totalPage;
};

export const paginate = <T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data?.slice(startIndex, endIndex);
};
export const updateSearchParams = (
  queryParams: URLSearchParams,
  key: string,
  value: string
) => {
  if (queryParams.has(key)) {
    queryParams.set(key, value);
  } else {
    queryParams.append(key, value);
  }

  return queryParams;
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getFirstDayOfMonth = () => {
  const date = new Date();
  return formatDate(new Date(date?.getFullYear(), date?.getMonth(), 1));
};

export const getToday = () => {
  return formatDate(new Date());
};
