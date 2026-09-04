export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export type Condition = {
  questionId: string;
  equals?: string;
  oneOf?: string[];
};

export type QuestionType =
  | "text"
  | "url"
  | "number"
  | "date"
  | "textarea"
  | "single"
  | "multi";

export type Question = {
  id: string;
  section: string;
  title: string;
  description?: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  maxSelections?: number;
  condition?: Condition;
};
