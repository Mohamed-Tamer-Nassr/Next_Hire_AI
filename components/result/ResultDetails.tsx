"use client";

import { IInterview } from "@/backend/config/models/interview.model";
import { getTotalPage } from "@/helper/helpers";
import { Chip, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import QuestionCard from "./QuestionCard";
import ResultStats from "./ResultStats";

export default function ResultDetails({
  interview,
}: {
  interview: IInterview;
}) {
  const [currPage, setCurrPage] = useState(1);
  const questionPerPage = 2;
  const totalPage = getTotalPage(interview?.questions?.length, questionPerPage);

  // Calculate the questions to display for the current page
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currPage - 1) * questionPerPage;
    const endIndex = startIndex + questionPerPage;
    return interview?.questions.slice(startIndex, endIndex) || [];
  }, [currPage, interview?.questions, questionPerPage]);

  const handlePageChange = (page: number) => {
    setCurrPage(page);
    // Optional: Scroll to top of questions when page changes
    // window.scrollTo({ top: 0.5, behavior: "smooth" });
  };

  return (
    <div>
      <div className="px-5">
        <ResultStats interview={interview} />

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-center my-5 gap-4">
            <div className="flex flex-wrap gap-4">
              <Chip
                color="primary"
                startContent={
                  <Icon icon="tabler:circle-check-filled" width={20} />
                }
                variant="faded"
              >
                {interview?.industry}
              </Chip>

              <Chip
                color="warning"
                startContent={
                  <Icon icon="tabler:circle-check-filled" width={20} />
                }
                variant="faded"
              >
                {interview?.type}
              </Chip>

              <Chip
                color="secondary"
                startContent={
                  <Icon icon="tabler:circle-check-filled" width={20} />
                }
                variant="faded"
              >
                {interview?.topic}
              </Chip>
            </div>

            {/* Question count indicator */}
            <div className="text-sm text-gray-500">
              Showing {(currPage - 1) * questionPerPage + 1} -{" "}
              {Math.min(
                currPage * questionPerPage,
                interview?.questions?.length
              )}{" "}
              of {interview?.questions?.length} questions
            </div>
          </div>

          {/* Render only paginated questions */}
          {paginatedQuestions.map((question, index) => (
            <QuestionCard
              key={index}
              // Calculate the actual index in the full array
              index={(currPage - 1) * questionPerPage + index}
              question={question}
            />
          ))}

          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-10">
            <Pagination
              isCompact
              showControls
              showShadow
              initialPage={1}
              total={totalPage}
              page={currPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
