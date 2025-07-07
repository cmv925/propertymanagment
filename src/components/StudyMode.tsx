import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen, Clock, RotateCcw } from 'lucide-react';
import { Question, StudySession } from '../types';

interface StudyModeProps {
  questions: Question[];
  onUpdateProgress: (session: StudySession) => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ questions, onUpdateProgress }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    startTime: Date.now()
  });
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);

  const categories = Array.from(new Set(questions.map(q => q.category))).sort();

  useEffect(() => {
    if (selectedCategory) {
      const filtered = questions.filter(q => q.category === selectedCategory);
      setCategoryQuestions(filtered);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setSessionStats({
        questionsAnswered: 0,
        correctAnswers: 0,
        startTime: Date.now()
      });
    }
  }, [selectedCategory, questions]);

  const currentQuestion = categoryQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // End of session
      const session: StudySession = {
        category: selectedCategory,
        questionsAnswered: sessionStats.questionsAnswered,
        correctAnswers: sessionStats.correctAnswers,
        timeSpent: Math.round((Date.now() - sessionStats.startTime) / 1000),
        date: new Date().toISOString()
      };
      onUpdateProgress(session);
      setSelectedCategory('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetSession = () => {
    setSelectedCategory('');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionStats({
      questionsAnswered: 0,
      correctAnswers: 0,
      startTime: Date.now()
    });
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Mode</h1>
          <p className="text-lg text-gray-600">Choose a category to start practicing questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryQuestionCount = questions.filter(q => q.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">{categoryQuestionCount} questions</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                <p className="text-gray-600">Practice questions and review explanations</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions available for this category.</p>
        <button onClick={resetSession} className="btn-primary mt-4">
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetSession}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Categories</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {Math.round((Date.now() - sessionStats.startTime) / 1000 / 60)}m
            </span>
          </div>
          <button
            onClick={resetSession}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Reset Session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{selectedCategory}</h2>
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {categoryQuestions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / categoryQuestions.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progress: {Math.round(((currentQuestionIndex + 1) / categoryQuestions.length) * 100)}%</span>
          <span>
            Accuracy: {sessionStats.questionsAnswered > 0 
              ? Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)
              : 0}%
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-8 card-shadow">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
            
            if (selectedAnswer === null) {
              buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
            } else if (index === currentQuestion.correctAnswer) {
              buttonClass += "border-green-500 bg-green-50 text-green-900";
            } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
              buttonClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={buttonClass}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="btn-primary flex items-center space-x-2"
            >
              <span>
                {currentQuestionIndex === categoryQuestions.length - 1 ? 'Finish Session' : 'Next Question'}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyMode;
