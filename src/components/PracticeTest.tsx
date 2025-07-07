import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, AlertCircle } from 'lucide-react';
import { Question } from '../types';

interface PracticeTestProps {
  questions: Question[];
  onTestComplete: (score: number, category: string, questionsCount: number) => void;
}

const PracticeTest: React.FC<PracticeTestProps> = ({ questions, onTestComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const categories = Array.from(new Set(questions.map(q => q.category))).sort();
  const QUESTIONS_PER_TEST = 20;
  const TIME_LIMIT = 30 * 60; // 30 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, timeLeft, testCompleted]);

  const startTest = (category: string) => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    const testSet = shuffled.slice(0, Math.min(QUESTIONS_PER_TEST, shuffled.length));
    
    setSelectedCategory(category);
    setTestQuestions(testSet);
    setAnswers(new Array(testSet.length).fill(null));
    setCurrentQuestionIndex(0);
    setTimeLeft(TIME_LIMIT);
    setTestStarted(true);
    setTestCompleted(false);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleTestComplete = () => {
    setTestCompleted(true);
    setTestStarted(false);
    
    const correctAnswers = testQuestions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / testQuestions.length) * 100);
    onTestComplete(score, selectedCategory, testQuestions.length);
    setShowResults(true);
  };

  const resetTest = () => {
    setSelectedCategory('');
    setTestQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(0);
    setTestStarted(false);
    setTestCompleted(false);
    setShowResults(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Category Selection Screen
  if (!testStarted && !testCompleted) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Test</h1>
          <p className="text-lg text-gray-600">Take a timed practice exam to test your knowledge</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Test Instructions</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Each test contains up to {QUESTIONS_PER_TEST} questions</li>
                <li>• You have {TIME_LIMIT / 60} minutes to complete the test</li>
                <li>• Questions are randomly selected from your chosen category</li>
                <li>• You can navigate between questions and change answers</li>
                <li>• The test will auto-submit when time runs out</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryQuestionCount = questions.filter(q => q.category === category).length;
            const availableQuestions = Math.min(QUESTIONS_PER_TEST, categoryQuestionCount);
            
            return (
              <button
                key={category}
                onClick={() => startTest(category)}
                className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">{availableQuestions} questions</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                <p className="text-gray-600">Timed practice test with instant results</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Test Results Screen
  if (showResults) {
    const correctAnswers = testQuestions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctAnswers / testQuestions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= 80 ? 'bg-green-100' : score >= 70 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Trophy className={`w-10 h-10 ${
              score >= 80 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
          <p className="text-lg text-gray-600">{selectedCategory}</p>
        </div>

        <div className={`rounded-xl p-8 border-2 ${getScoreBg(score)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
              {score}%
            </div>
            <p className="text-lg text-gray-700 mb-4">
              {correctAnswers} out of {testQuestions.length} questions correct
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span>Time Used: {formatTime(TIME_LIMIT - timeLeft)}</span>
              <span>•</span>
              <span>Accuracy: {score}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Question Review</h3>
          <div className="space-y-4">
            {testQuestions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Your answer: </span>
                          <span className={userAnswer !== null ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}>
                            {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Correct answer: </span>
                          <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                        </div>
                      </div>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={resetTest} className="btn-secondary">
            Take Another Test
          </button>
          <button onClick={() => startTest(selectedCategory)} className="btn-primary">
            Retake This Test
          </button>
        </div>
      </div>
    );
  }

  // Active Test Screen
  const currentQuestion = testQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testQuestions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Test Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedCategory}</h2>
            <p className="text-gray-600">Practice Test</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              timeLeft < 300 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={resetTest}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Exit Test"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {testQuestions.length}</span>
          <span>Answered: {answeredCount}/{testQuestions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl p-8 card-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                answers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  answers[currentQuestionIndex] === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentQuestionIndex < testQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="btn-primary"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleTestComplete}
                className="btn-primary bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h4 className="font-semibold text-gray-900 mb-4">Question Navigator</h4>
        <div className="grid grid-cols-10 gap-2">
          {testQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-500 text-white'
                  : answers[index] !== null
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeTest;
