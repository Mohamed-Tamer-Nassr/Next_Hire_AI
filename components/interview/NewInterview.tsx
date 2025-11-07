"use client";

import { NewInterview as TheNewInterview } from "@/actions/interview.action";
import { IUser } from "@/backend/config/models/user.model";
import { InterviewBody } from "@/backend/types/interview.types";
import {
  industryTopics,
  interviewDifficulties,
  interviewTypes,
} from "@/constants/data";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import Loader from "../layout/loader/loader";

const interviewIndustry = Object.keys(industryTopics);

export default function NewInterview() {
  const [selectedIndustry, setSelectedIndustry] = React.useState("");
  const [topics, setTopics] = React.useState<string[]>([]);
  const { data, status } = useSession();
  const user = data?.user as IUser;

  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const industry = e.target.value as keyof typeof industryTopics;
    setSelectedIndustry(industry);
    setTopics(industryTopics[industry] || []);
  };

  const { isLoading, handleSubmit } = useGenericSubmitHandler(async (data) => {
    // ✅ FIX: Validate authentication before proceeding
    if (status !== "authenticated" || !user) {
      toast.error("Please sign in to create an interview");
      return;
    }

    // ✅ FIX: Safely extract user ID with fallback
    const userId = user.id || user._id;

    if (!userId) {
      toast.error("User session invalid. Please sign in again.");
      return;
    }

    const interviewData: InterviewBody = {
      industry: data.industry,
      topic: data.topic,
      type: data.type,
      role: data.role,
      difficulty: data.difficulty,
      numOfQuestion: Number(data.numOfQuestion),
      duration: Number(data.duration),
      user: userId, // ✅ Now guaranteed to be defined
    };

    // console.log("📤 Submitting interview data:", interviewData);

    const res = await TheNewInterview(interviewData);

    // ✅ FIX: Better error checking
    if (!res || !res.success) {
      const errorMsg = res?.error || "Failed to create interview";
      console.error("❌ Interview creation failed:", errorMsg);
      toast.error(errorMsg);
      return;
    }

    toast.success("Interview created successfully ✅");

    router.push(`/app/interviews`);

    setTimeout(() => {
      formRef.current?.reset();
      setSelectedIndustry("");
      setTopics([]);
    }, 8000);
  });

  if (status === "loading") {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-4 flex items-center justify-center">
        <p>Please sign in to create an interview</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <Form ref={formRef} validationBehavior="native" onSubmit={handleSubmit}>
          {/* Header + Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="col-span-1">
              <h3 className="text-xl">Select all options below:</h3>
            </div>

            <div className="col-span-1">
              <div className="flex gap-4 justify-start md:justify-end items-center">
                <Button
                  type="submit"
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  color="primary"
                >
                  {isLoading ? "Creating..." : "Create Interview"}
                </Button>

                <Button
                  type="reset"
                  variant="bordered"
                  onPress={() => {
                    formRef.current?.reset();
                    setSelectedIndustry("");
                    setTopics([]);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 w-full">
            {/* LEFT COLUMN */}
            <div className="col-span-1">
              <div className="w-full flex flex-col space-y-4">
                <div className="flex flex-col gap-4 w-full">
                  {/* Industry */}
                  <Select
                    isRequired
                    label="Industry"
                    labelPlacement="outside"
                    name="industry"
                    placeholder="Select Industry"
                    onChange={handleIndustryChange}
                    selectedKeys={selectedIndustry ? [selectedIndustry] : []}
                  >
                    {interviewIndustry?.map((industry) => (
                      <SelectItem key={industry}>{industry}</SelectItem>
                    ))}
                  </Select>

                  {/* Topic */}
                  <Select
                    isRequired
                    label="Topic"
                    labelPlacement="outside"
                    name="topic"
                    placeholder="Select Topic"
                    isDisabled={!selectedIndustry}
                  >
                    {topics.map((topic) => (
                      <SelectItem key={topic}>{topic}</SelectItem>
                    ))}
                  </Select>

                  {/* Type */}
                  <Select
                    isRequired
                    label="Interview Type"
                    labelPlacement="outside"
                    name="type"
                    placeholder="Select interview type"
                  >
                    {interviewTypes?.map((type) => (
                      <SelectItem key={type}>{type}</SelectItem>
                    ))}
                  </Select>

                  {/* Role */}
                  <Input
                    isRequired
                    type="text"
                    label="Job Role"
                    labelPlacement="outside"
                    name="role"
                    placeholder="software developer, data scientist, etc."
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-1">
              <div className="w-full flex flex-col space-y-4">
                <div className="flex flex-col gap-4 w-full">
                  {/* Difficulty */}
                  <Select
                    isRequired
                    label="Difficulty"
                    labelPlacement="outside"
                    name="difficulty"
                    placeholder="Select difficulty"
                  >
                    {interviewDifficulties?.map((difficulty) => (
                      <SelectItem key={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </Select>

                  {/* Number of Questions */}
                  <Input
                    isRequired
                    type="number"
                    label="No of Questions"
                    labelPlacement="outside"
                    name="numOfQuestion"
                    placeholder="Enter no of questions"
                    min="1"
                    max="50"
                  />

                  {/* Duration */}
                  <Input
                    isRequired
                    type="number"
                    label="Duration (minutes)"
                    labelPlacement="outside"
                    name="duration"
                    placeholder="Enter duration"
                    min="2"
                    max="120"
                  />
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
