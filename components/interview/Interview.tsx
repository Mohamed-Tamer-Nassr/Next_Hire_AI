"use client";

import { updateInterview } from "@/actions/interview.action";
import { IInterview, IQuestion } from "@/backend/config/models/interview.model";
import {
  formatTime,
  getAnswerFromLocalStorage,
  getAnswersFromLocalStorage,
  saveAnswerToLocalStorage,
} from "@/helper/helpers";
import { Alert, Button, Chip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import PromptInputWithBottomActions from "./PromptInputWithBottomActions";

// Enhanced helper functions for session persistence
const saveInterviewSession = (
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

const getInterviewSession = (interviewId: string) => {
  const key = `interview_${interviewId}_session`;
  const session = localStorage.getItem(key);
  return session ? JSON.parse(session) : null;
};

const clearInterviewSession = (interviewId: string) => {
  const sessionKey = `interview_${interviewId}_session`;
  const answersKey = `interview_${interviewId}_answers`;
  localStorage.removeItem(sessionKey);
  localStorage.removeItem(answersKey);
};

export default function Interview({ interview }: { interview: IInterview }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize interview state with session recovery
  useEffect(() => {
    const interviewId = interview?._id.toString();

    // Check if interview is already completed
    if (interview?.status === "completed") {
      toast.error("This interview is already completed");
      router.push("/app/interviews");
      return;
    }

    // Try to recover previous session
    const savedSession = getInterviewSession(interviewId);
    const storedAnswers = getAnswersFromLocalStorage(interviewId);

    if (savedSession && storedAnswers) {
      // Check if session is still valid (within 24 hours)
      const sessionAge = Date.now() - savedSession.lastUpdated;
      const isSessionValid = sessionAge < 24 * 60 * 60 * 1000;

      // Also check if saved time is reasonable
      const hasValidTimeLeft =
        savedSession.timeLeft > 0 &&
        savedSession.timeLeft <= (interview?.durationLeft || 0);

      if (isSessionValid && hasValidTimeLeft) {
        // Recover session
        setCurrentQuestionIndex(savedSession.currentQuestionIndex);
        setTimeLeft(savedSession.timeLeft);
        setAnswers(storedAnswers);

        const currentQ =
          interview?.questions[savedSession.currentQuestionIndex];
        const savedAnswer = storedAnswers[currentQ?._id.toString()] || "";
        setAnswer(savedAnswer);

        toast.success("Welcome To Your Interview ");
      } else {
        // Session expired or invalid, use DB state
        initializeFreshSession();
        if (!isSessionValid) {
          toast("Starting fresh - previous session expired");
        }
      }
    } else {
      // No previous session, initialize fresh
      initializeFreshSession();
    }

    setIsInitialized(true);
  }, [interview?._id]);

  const initializeFreshSession = () => {
    const interviewId = interview._id.toString();

    // Use the duration from DB as source of truth
    const initialTimeLeft = interview?.durationLeft || 0;

    // If time is 0 or negative, interview should be completed
    if (initialTimeLeft <= 0) {
      toast.error("Interview time has expired");
      handleSaveAndExit();
      return;
    }

    // Find first incomplete question
    const firstIncomplete = interview?.questions.findIndex(
      (q: IQuestion) => !q?.answer || q?.answer === ""
    );
    const startIndex = firstIncomplete === -1 ? 0 : firstIncomplete;

    setCurrentQuestionIndex(startIndex);
    setTimeLeft(initialTimeLeft);

    // Initialize answers from database
    const initialAnswers: { [key: string]: string } = {};
    interview?.questions.forEach((q: IQuestion) => {
      const questionId = q?._id.toString();
      const existingAnswer = q?.answer || "";
      initialAnswers[questionId] = existingAnswer;
      saveAnswerToLocalStorage(interviewId, questionId, existingAnswer);
    });
    setAnswers(initialAnswers);

    // Set initial answer
    const currentQ = interview?.questions[startIndex];
    setAnswer(initialAnswers[currentQ?._id.toString()] || "");

    // Save initial session
    saveInterviewSession(interviewId, {
      currentQuestionIndex: startIndex,
      timeLeft: initialTimeLeft,
      lastUpdated: Date.now(),
    });
  };

  // Auto-save session state periodically
  useEffect(() => {
    if (!isInitialized) return;

    const interviewId = interview._id.toString();

    // Save session every 5 seconds
    autoSaveIntervalRef.current = setInterval(() => {
      saveInterviewSession(interviewId, {
        currentQuestionIndex,
        timeLeft,
        lastUpdated: Date.now(),
      });
    }, 5000);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [currentQuestionIndex, timeLeft, isInitialized, interview._id]);

  // Timer countdown
  useEffect(() => {
    if (!isInitialized || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast.error("Time is up! Saving your progress...");
          handleSaveAndExit();
          return 0;
        }
        if (prevTime === 10) {
          setShowAlert(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInitialized, timeLeft]);

  // Debounced save to database
  const debouncedSaveToDB = async (questionId: string, answerText: string) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await updateInterview(
          interview?._id.toString(),
          timeLeft?.toString(),
          questionId,
          answerText
        );
        if (res?.error) {
          console.error("Failed to save answer:", res?.error?.message);
        } else {
          console.log("Answer auto-saved to database");
        }
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    }, 2000); // Save 2 seconds after user stops typing
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);

    // Save to localStorage immediately
    const questionId =
      interview?.questions[currentQuestionIndex]?._id.toString();
    saveAnswerToLocalStorage(interview._id.toString(), questionId, value);

    // Update local state
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Debounced save to database
    debouncedSaveToDB(questionId, value);
  };

  const saveAnswerToDB = async (questionId: string, answerText: string) => {
    try {
      const res = await updateInterview(
        interview?._id.toString(),
        timeLeft?.toString(),
        questionId,
        answerText
      );
      if (res?.error) {
        toast.error(res?.error?.message || "Failed to save answer");
        return false;
      }
      return true;
    } catch (error) {
      toast.error("Failed to save answer");
      return false;
    }
  };

  const handleNextQuestion = async (answerToSave: string) => {
    setLoadingNext(true);
    try {
      const questionId =
        interview?.questions[currentQuestionIndex]?._id.toString();

      // Always save current answer
      await saveAnswerToDB(questionId, answerToSave);
      saveAnswerToLocalStorage(
        interview._id.toString(),
        questionId,
        answerToSave
      );

      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerToSave,
      }));

      // Navigate to next question
      if (currentQuestionIndex < interview?.numOfQuestion - 1) {
        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = interview?.questions[nextIndex];
        const nextQuestionId = nextQuestion._id.toString();
        const nextAnswer = getAnswerFromLocalStorage(
          interview._id.toString(),
          nextQuestionId
        );

        setAnswer(nextAnswer);
        setCurrentQuestionIndex(nextIndex);

        // Save session state
        saveInterviewSession(interview._id.toString(), {
          currentQuestionIndex: nextIndex,
          timeLeft,
          lastUpdated: Date.now(),
        });
      } else {
        // Complete interview
        await completeInterview();
      }
    } finally {
      setLoadingNext(false);
    }
  };

  const handlePassQuestion = async () => {
    setLoadingPass(true);
    try {
      const questionId =
        interview?.questions[currentQuestionIndex]?._id.toString();

      await saveAnswerToDB(questionId, "pass");
      saveAnswerToLocalStorage(interview._id.toString(), questionId, "pass");

      setAnswers((prev) => ({
        ...prev,
        [questionId]: "pass",
      }));

      if (currentQuestionIndex < interview?.numOfQuestion - 1) {
        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = interview?.questions[nextIndex];
        const nextQuestionId = nextQuestion._id.toString();
        const nextAnswer = getAnswerFromLocalStorage(
          interview._id.toString(),
          nextQuestionId
        );

        setAnswer(nextAnswer);
        setCurrentQuestionIndex(nextIndex);

        saveInterviewSession(interview._id.toString(), {
          currentQuestionIndex: nextIndex,
          timeLeft,
          lastUpdated: Date.now(),
        });
      } else {
        await completeInterview();
      }
    } finally {
      setLoadingPass(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = interview?.questions[prevIndex];
      const prevQuestionId = prevQuestion._id.toString();
      const prevAnswer = getAnswerFromLocalStorage(
        interview._id.toString(),
        prevQuestionId
      );

      setAnswer(prevAnswer);
      setCurrentQuestionIndex(prevIndex);

      saveInterviewSession(interview._id.toString(), {
        currentQuestionIndex: prevIndex,
        timeLeft,
        lastUpdated: Date.now(),
      });
    }
  };

  const completeInterview = async () => {
    setLoader(true);
    try {
      const currentQ = interview?.questions[currentQuestionIndex];
      const res = await updateInterview(
        interview?._id.toString(),
        "0",
        currentQ?._id.toString(),
        answer,
        true
      );

      if (res?.error) {
        toast.error(res?.error?.message || "Failed to complete interview");
        return;
      }

      // Clear session data
      clearInterviewSession(interview._id.toString());

      toast.success("Interview completed successfully!");
      router.push("/app/results");
    } catch (error) {
      toast.error("Failed to complete interview");
    } finally {
      setLoader(false);
    }
  };

  const handleSaveAndExit = async () => {
    setLoader(true);
    try {
      const currentQ = interview?.questions[currentQuestionIndex];
      const res = await updateInterview(
        interview?._id.toString(),
        timeLeft?.toString(),
        currentQ?._id.toString(),
        answer,
        true
      );

      if (res?.error) {
        toast.error(res?.error?.message || "Failed to save interview");
        return;
      }

      toast.success("Interview progress saved successfully");
      router.push("/app/interviews");
    } catch (error) {
      toast.error("Failed to save progress");
    } finally {
      setLoader(false);
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <Icon icon="svg-spinners:3-dots-fade" width={48} />
          <p className="mt-4 text-lg">Loading interview...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = interview?.questions[currentQuestionIndex];

  return (
    <div className="flex h-full w-full max-w-full flex-col gap-8">
      {showAlert && (
        <Alert
          color="danger"
          description="Interview is about to exit"
          title="Time up!"
        />
      )}

      <Progress
        aria-label="Interview Progress"
        className="w-full"
        color="default"
        label={`Question ${currentQuestionIndex + 1} of ${
          interview?.numOfQuestion
        }`}
        size="md"
        value={((currentQuestionIndex + 1) / interview?.numOfQuestion) * 100}
      />

      <div className="flex flex-wrap gap-1.5">
        {interview?.questions.map((question: IQuestion, index: number) => (
          <Chip
            key={question._id.toString()}
            color={answers[question._id.toString()] ? "success" : "default"}
            size="sm"
            variant="flat"
            className="font-bold cursor-pointer text-sm radius-full"
            onClick={() => {
              setCurrentQuestionIndex(index);
              const questionId = question._id.toString();
              const savedAnswer = getAnswerFromLocalStorage(
                interview._id.toString(),
                questionId
              );
              setAnswer(savedAnswer);

              saveInterviewSession(interview._id.toString(), {
                currentQuestionIndex: index,
                timeLeft,
                lastUpdated: Date.now(),
              });
            }}
          >
            {index + 1}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <span className="text-lg font-semibold text-right mb-2 sm:mb-0">
          Duration Left: {formatTime(timeLeft)}
        </span>
        <Button
          color="danger"
          startContent={<Icon icon="solar:exit-outline" fontSize={18} />}
          variant="solid"
          onPress={handleSaveAndExit}
          isDisabled={loader}
          isLoading={loader}
        >
          Save & Exit Interview
        </Button>
      </div>

      <span className="text-center">
        <span className="tracking-tight inline font-semibold text-[#C0C0C0] text-[1.4rem] lg:text-2.5xl flex items-center justify-center h-full">
          {currentQuestion?.question}
        </span>
      </span>

      <PromptInputWithBottomActions
        key={currentQuestionIndex}
        value={answer}
        onChange={handleAnswerChange}
      />

      <div className="flex justify-between items-center mt-5">
        <Button
          className="px-[18px] py-2 font-medium"
          radius="full"
          color="primary"
          variant="solid"
          startContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:arrow-left-linear"
              width={20}
            />
          }
          onPress={handlePreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Button
          className="px-[28px] py-2"
          radius="full"
          variant="flat"
          color="success"
          startContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:compass-big-bold"
              width={18}
            />
          }
          onPress={handlePassQuestion}
          isDisabled={loadingPass || loadingNext}
          isLoading={loadingPass}
        >
          Pass
        </Button>

        <Button
          className="px-[18px] py-2 font-medium"
          radius="full"
          color="primary"
          variant="solid"
          endContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:arrow-right-linear"
              width={20}
            />
          }
          onPress={() => handleNextQuestion(answer)}
          isDisabled={loadingNext || loadingPass}
          isLoading={loadingNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
