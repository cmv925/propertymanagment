import React from 'react';
import { BookOpen, Trophy, TrendingUp, Clock, Target, Award, ChevronRight } from 'lucide-react';
import { UserProgress } from '../types';

interface DashboardProps {
  userProgress: UserProgress;
  onNavigate: (view: 'study' | 'test' | 'progress') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress, onNavigate }) => {
  const accuracyRate = userProgress.totalQuestionsAnswered > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  const recentSessions = userProgress.studySessions.slice(-3).reverse();
  const averageScore = userProgress.testScores.length > 0
    ? Math.round(userProgress.testScores.reduce((sum, test) => sum + test.score, 0) / userProgress.testScores.length)
    : 0;

  const categories = [
    'Landlord-Tenant Law',
    'Property Management Basics',
    'Fair Housing Laws',
    'Lease Agreements',
    'Maintenance & Repairs',
    'Financial Management',
    'Marketing & Advertising',
    'Legal Compliance',
    'Emergency Procedures',
    'Tenant Relations',
    'Property Inspections',
    'Eviction Process'
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-blue-100 text-lg">Ready to continue your Florida Property Manager certification journey?</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Questions Answered</p>
              <p className="text-2xl font-bold text-gray-900">{userProgress.totalQuestionsAnswered}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{accuracyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{userProgress.studySessions.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Test Score</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('study')}
              className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Mode</h3>
              <p className="text-gray-600">Practice questions by category with detailed explanations</p>
            </button>

            <button
              onClick={() => onNavigate('test')}
              className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Test</h3>
              <p className="text-gray-600">Take timed practice exams to test your knowledge</p>
            </button>

            <button
              onClick={() => onNavigate('progress')}
              className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Progress</h3>
              <p className="text-gray-600">Track your learning progress and performance</p>
            </button>

            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Certification Ready?</h3>
              <p className="text-orange-100">Aim for 80%+ accuracy across all categories</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl p-6 card-shadow">
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{session.category}</p>
                      <p className="text-sm text-gray-500">
                        {session.correctAnswers}/{session.questionsAnswered} correct
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {Math.round((session.correctAnswers / session.questionsAnswered) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Start studying to see your progress here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
