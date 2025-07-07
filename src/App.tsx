import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, BarChart3, Settings, Home, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StudyMode from './components/StudyMode';
import PracticeTest from './components/PracticeTest';
import Progress from './components/Progress';
import { Question, UserProgress, StudySession } from './types';
import { questions } from './data/questions';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'study' | 'test' | 'progress'>('dashboard');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    categoryProgress: {},
    studySessions: [],
    testScores: []
  });

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('florida-pm-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('florida-pm-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateProgress = (session: StudySession) => {
    setUserProgress(prev => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + session.questionsAnswered,
      correctAnswers: prev.correctAnswers + session.correctAnswers,
      studySessions: [...prev.studySessions, session],
      categoryProgress: {
        ...prev.categoryProgress,
        [session.category]: {
          questionsAnswered: (prev.categoryProgress[session.category]?.questionsAnswered || 0) + session.questionsAnswered,
          correctAnswers: (prev.categoryProgress[session.category]?.correctAnswers || 0) + session.correctAnswers,
          lastStudied: new Date().toISOString()
        }
      }
    }));
  };

  const addTestScore = (score: number, category: string, questionsCount: number) => {
    setUserProgress(prev => ({
      ...prev,
      testScores: [...prev.testScores, {
        score,
        category,
        questionsCount,
        date: new Date().toISOString()
      }]
    }));
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'study', label: 'Study Mode', icon: BookOpen },
    { id: 'test', label: 'Practice Test', icon: Trophy },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Florida Property Manager</h1>
                <p className="text-sm text-gray-500">Certification Training</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {userProgress.correctAnswers}/{userProgress.totalQuestionsAnswered} Correct
                </span>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <span className="font-semibold text-gray-900">{userProgress.totalQuestionsAnswered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className="font-semibold text-gray-900">
                    {userProgress.totalQuestionsAnswered > 0 
                      ? Math.round((userProgress.correctAnswers / userProgress.totalQuestionsAnswered) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <span className="font-semibold text-gray-900">{userProgress.studySessions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && (
            <Dashboard 
              userProgress={userProgress} 
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'study' && (
            <StudyMode 
              questions={questions}
              onUpdateProgress={updateProgress}
            />
          )}
          {currentView === 'test' && (
            <PracticeTest 
              questions={questions}
              onTestComplete={addTestScore}
            />
          )}
          {currentView === 'progress' && (
            <Progress userProgress={userProgress} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
