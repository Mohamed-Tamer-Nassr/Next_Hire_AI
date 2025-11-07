import {
  industries,
  industryTopics,
  interviewDifficulties,
  interviewTypes,
} from "@/constants/data";
import mongoose, { Document, Types } from "mongoose";

export interface IQuestion extends Document {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  completed: boolean;
  result: {
    overallScore: number;
    clarity: number;
    completeness: number;
    relevance: number;
    suggestion: string;
  };
}

export interface IInterview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  industry: string;
  type: string;
  topic: string;
  role: string;
  numOfQuestion: number;
  answered: number;
  difficulty: string;
  duration: number;
  durationLeft: number;
  status: string;
  questions: IQuestion[];
}

const questionSchema = new mongoose.Schema<IQuestion>({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  result: {
    overallScore: {
      type: Number,
      default: 0,
    },
    clarity: {
      type: Number,
      default: 0,
    },
    relevance: {
      type: Number,
      default: 0,
    },
    completeness: {
      type: Number,
      default: 0,
    },
    suggestion: {
      type: String,
      default: "",
    },
  },
});

const interviewSchema = new mongoose.Schema<IInterview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      enum: {
        values: industries,
        message: "{VALUE} is not a valid industry",
      },
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: interviewTypes,
        message: "{VALUE} is not a valid interview type",
      },
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      validate: {
        validator: function (value: string): boolean {
          const doc = this as any;
          const topics = (industryTopics as Record<string, string[]>)[
            doc.industry
          ];
          if (!topics) return true; // allow if no mapping found (avoids blocking)
          return topics.includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid topic for industry '${
            (props as any).instance.industry
          }'`,
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    numOfQuestion: {
      type: Number,
      required: [true, "Number of questions is required"],
      min: [1, "At least 1 question is required"],
      max: [50, "Cannot exceed 50 questions"],
      validate: {
        validator: Number.isInteger,
        message: "Number of questions must be an integer",
      },
    },

    answered: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: {
        values: interviewDifficulties,
        message: "{VALUE} is not a valid difficulty",
      },
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [2 * 60, "Duration must be at least 2 minutes"],
      max: [120 * 60, "Duration cannot exceed 2 hours"],
    },
    durationLeft: {
      type: Number,
      default: function (this: IInterview) {
        return this.duration;
      },
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// FIXED: Export the model, not the interface
const Interview =
  mongoose.models.Interview ||
  mongoose.model<IInterview>("Interview", interviewSchema);

export default Interview; // ✅ Fixed: Export the model
