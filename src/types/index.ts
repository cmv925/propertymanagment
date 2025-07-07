export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CategoryProgress {
  questionsAnswered: number;
  correctAnswers: number;
  lastStudied: string;
}

export interface StudySession {
  category: string;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  date: string;
}

export interface TestScore {
  score: number;
  category: string;
  questionsCount: number;
  date: string;
}

export interface UserProgress {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  categoryProgress: Record<string, CategoryProgress>;
  studySessions: StudySession[];
  testScores: TestScore[];
}
