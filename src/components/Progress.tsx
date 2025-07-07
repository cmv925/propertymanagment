import React from 'react';
import { TrendingUp, Calendar, Trophy, Target, BookOpen, Clock } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressProps {
  userProgress: UserProgress;
}

const Progress: React.FC<ProgressProps> = ({ userProgress }) => {
  const accuracyRate = userProgress.totalQuestionsAnswered > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  const averageTestScore = userProgress.testScores.length > 0
    ? Math.round(userProgress.testScores.reduce((sum, test) => sum + test.score, 0) / userProgress.testScores.length)
    : 0;

  const recentSessions = userProgress.studySessions.slice(-5).reverse();
  const recentTests = userProgress.testScores.slice(-5).reverse();

  const categoryStats = Object.entries(userProgress.categoryProgress).map(([category, progress]) => ({
    category,
    ...progress,
    accuracy: progress.questionsAnswered > 0 ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) : 0
  })).sort((a, b) => b.questionsAnswered - a.questionsAnswered);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100';
    if (accuracy >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-lg text-gray-600">Track your learning journey and performance</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
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
              <p className="text-sm font-medium text-gray-600">Overall Accuracy</p>
              <p className={`text-2xl font-bold ${getAccuracyColor(accuracyRate)}`}>{accuracyRate}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAccuracyBg(accuracyRate)}`}>
              <Target className="w-6 h-6" />
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
              <p className="text-sm font-medium text-gray-600">Avg Test Score</p>
              <p className={`text-2xl font-bold ${getAccuracyColor(averageTestScore)}`}>{averageTestScore}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAccuracyBg(averageTestScore)}`}>
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Category Performance</h3>
          {categoryStats.length > 0 ? (
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{stat.category}</h4>
                    <span className={`font-semibold ${getAccuracyColor(stat.accuracy)}`}>
                      {stat.accuracy}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{stat.correctAnswers}/{stat.questionsAnswered} correct</span>
                    <span>{new Date(stat.lastStudied).toLocaleDateString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        stat.accuracy >= 80 ? 'bg-green-500' :
                        stat.accuracy >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No study data yet</p>
              <p className="text-sm text-gray-400">Start studying to see your progress</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          {recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{session.category}</p>
                    <p className="text-sm text-gray-600">
                      {session.correctAnswers}/{session.questionsAnswered} correct • {Math.round(session.timeSpent / 60)}m
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getAccuracyColor(Math.round((session.correctAnswers / session.questionsAnswered) * 100))}`}>
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
              <p className="text-gray-500">No recent sessions</p>
              <p className="text-sm text-gray-400">Start studying to see your activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Test History */}
      {recentTests.length > 0 && (
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Questions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 font-medium text-gray-900">{test.category}</td>
                    <td className={`py-3 px-4 font-semibold ${getAccuracyColor(test.score)}`}>
                      {test.score}%
                    </td>
                    <td className="py-3 px-4 text-gray-600">{test.questionsCount}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(test.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certification Readiness */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Certification Readiness</h3>
            <p className="text-blue-100 mb-4">
              {accuracyRate >= 80 
                ? "Excellent! You're ready for the certification exam."
                : accuracyRate >= 70
                ? "Good progress! Keep studying to improve your accuracy."
                : "Keep practicing! Focus on your weaker categories."
              }
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span>Target: 80% accuracy</span>
              <span>•</span>
              <span>Current: {accuracyRate}%</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
