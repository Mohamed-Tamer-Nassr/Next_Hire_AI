import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateInterviewQuestions = async (
  industry: string,
  topic: string,
  type: string,
  role: string,
  numOfQuestions: number,
  duration: number,
  difficulty: string
) => {
  const tokenPerQuestion = 250;
  const maxTokens = numOfQuestions * tokenPerQuestion;
  const questionPrompt = `
    Generate total "${numOfQuestions}" "${difficulty}" "${type}" interview questions for the topic "${topic}" in the "${industry}" industry.
    The interview is for a candidate applying for the role of "${role}" and total duration of interview is "${duration}" minutes.
    
    **Ensure the following:**
    - The questions are well-balanced, including both open-ended and specific questions.
    - Each question is designed to evaluate a specific skill or knowledge area relevant to the role.
    - The questions are clear, concise and engaging for the candidate.
    - The questions are suitable for a "${difficulty}" interview in the "${industry}" industry.
    - Ensure the questions are directly aligned with "${difficulty}" responsibilities and expertise in "${role}".
    
    **Instructions:**
    - Always follow same format for questions.
    - Provide all question without any prefix.
    - No question number or bullet points or hypen - is required.
    `;
  const question_system_content = `
      You are a professional interview question generator for AI-powered hiring platforms. 
      You create questions tailored to a specific role, topic, difficulty, and industry. 
      Your questions must be clear, relevant, and realistic for real interview scenarios.
      `;
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: question_system_content,
      },
      {
        role: "user",
        content: questionPrompt,
      },
    ],
    max_tokens: maxTokens, // Limit the response length
    temperature: 0.65, // creativity of output
    top_p: 0.9, // control diversity of output
    frequency_penalty: 0.2, // Reduce repetition
    presence_penalty: 0.4, // Slightly encourage new topics
  });
  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to generate interview questions");
  }
  //   console.log(content);
  const questions = content
    .split("\n")
    .filter((q) => q)
    .map((q) => ({ question: q.trim() }));

  return questions;
};

const extractScoreAndSuggestion = (content: string) => {
  const overallScoreMatch = content.match(/Overall score=(\d+)/);
  const relevanceScoreMatch = content.match(/Relevance score=(\d+)/);
  const clarityScoreMatch = content.match(/Clarity score=(\d+)/);
  const completenessScoreMatch = content.match(/Completeness score=(\d+)/);
  const suggestionsMatch = content.match(/Suggestions=(.*)/);
  const overallScore = overallScoreMatch ? overallScoreMatch[1] : 0;
  const relevance = relevanceScoreMatch ? relevanceScoreMatch[1] : 0;
  const clarity = clarityScoreMatch ? clarityScoreMatch[1] : 0;
  const completeness = completenessScoreMatch ? completenessScoreMatch[1] : 0;
  const suggestion = suggestionsMatch ? suggestionsMatch[1].trim() : "";
  return {
    overallScore: parseInt(overallScore as string, 10),
    relevance: parseInt(relevance as string, 10),
    clarity: parseInt(clarity as string, 10),
    completeness: parseInt(completeness as string, 10),
    suggestion,
  };
};

export const evaluateAnswer = async (question: string, answer: string) => {
  const answerPrompt = `
    Evaluate the following answer to the question based on the evaluation criteria and provide the scores for relevance, clarity, and completeness, followed by suggestions in text format.
    
    **Evaluation Criteria:**
        1. Overall Score: Provide an overall score out of 10 based on the quality of the answer.
        2. Relevance: Provide a score out of 10 based on how relevant the answer is to the question.
        3. Clarity: Provide a score out of 10 based on how clear and easy to understand the explanation is.
        4. Completeness: Provide a score out of 10 based on how well the answer covers all aspects of the question.
        5. Suggestions: Provide any suggestions or improvements to the answer in text.

    **Question:** ${question}
    **Answer:** ${answer}

    **Instructions:**
        - Always follow same format for providing scores and suggestions.
        - Provide the score only like "Overall score=5", "Relevance score=7", "Clarity =9", "Completeness score=1", for following:
            - Overall score
            - Relevance score
            - Clarity score
            - Completeness score
        -Provide text only for following only like "Suggestions=your_answer_here":  
            - Suggestions or improved answer in text.
    `;
  const answer_system_content = `You are an expert evaluator with a strong understanding of assessing answers to interview questions.`;
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: answer_system_content,
      },
      {
        role: "user",
        content: answerPrompt,
      },
    ],
    max_tokens: 300, // Limit the response length
    temperature: 0.8, // creativity of output
    top_p: 0.9, // control diversity of output
    frequency_penalty: 0.2, // Reduce repetition
    presence_penalty: 0.8, // Slightly encourage new topics
  });
  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to evaluate answer");
  }
  const result = extractScoreAndSuggestion(content);
  return {
    overallScore: result.overallScore,
    relevance: result.relevance,
    clarity: result.clarity,
    completeness: result.completeness,
    suggestion: result.suggestion,
  };
};
