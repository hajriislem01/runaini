import React, { useState } from 'react';

const trainingMetrics = {
  totalSessions: 25,
  completedSessions: 22,
  avgIntensity: 7.5,
  avgDuration: 90,
  intensityChange: '+5%',
  drillPerformance: 85,
  drillChange: '+10%',
  caloriesBurned: 4200,
  mostImprovedDrill: 'Agility Ladder',
  mostImprovedValue: '+15%',
  topDays: [
    { day: 'Mon', count: 5 },
    { day: 'Wed', count: 7 },
    { day: 'Fri', count: 6 },
    { day: 'Sat', count: 7 },
    { day: 'Sun', count: 0 },
  ],
  personalBests: [
    { drill: 'Sprint 40m', value: '5.2s', improvement: '-0.4s' },
    { drill: 'Vertical Jump', value: '62cm', improvement: '+5cm' },
    { drill: 'Push-ups', value: '55 reps', improvement: '+8 reps' },
  ],
  intensityTrend: [6.8, 7.2, 7.1, 7.6, 7.8, 7.5, 7.9],
  drillTrend: [72, 78, 75, 82, 80, 85, 88],
};

const matchMetrics = {
  totalMatches: 12,
  wins: 7,
  draws: 2,
  losses: 3,
  avgRating: 8.2,
  avgMinutes: 78,
  ratingChange: '+3%',
  passAccuracy: 88,
  passChange: '+7%',
  goals: 6,
  assists: 4,
  cards: { yellow: 2, red: 0, fouls: 5 },
  highlights: [
    { match: 'vs Tigers', rating: 9.1, mvp: true, date: '2023-06-15' },
    { match: 'vs Eagles', rating: 8.8, mvp: false, date: '2023-06-22' },
    { match: 'vs Wolves', rating: 8.5, mvp: true, date: '2023-07-01' },
  ],
  positionHeatmap: [
    { x: 65, y: 30, value: 85 },
    { x: 70, y: 40, value: 92 },
    { x: 60, y: 35, value: 78 },
    { x: 75, y: 25, value: 88 },
  ],
};

const Performance = () => {
  const [tab, setTab] = useState('training');
  const completionRate = Math.round((trainingMetrics.completedSessions / trainingMetrics.totalSessions) * 100);

  // Win/Loss Pie Chart Data
  const totalResults = matchMetrics.wins + matchMetrics.draws + matchMetrics.losses;
  const winPct = (matchMetrics.wins / totalResults) * 100;
  const drawPct = (matchMetrics.draws / totalResults) * 100;
  const lossPct = (matchMetrics.losses / totalResults) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-1">Track and analyze player performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div>
                <p className="font-medium">Alex Morgan</p>
                <p className="text-xs text-gray-500">Forward • #13</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <select className="text-sm bg-transparent border-none focus:ring-0">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Season 2023</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-5 py-3 font-medium border-b-2 transition-all flex items-center gap-2 ${
            tab === 'training' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setTab('training')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Training Performance
        </button>
        <button
          className={`px-5 py-3 font-medium border-b-2 transition-all flex items-center gap-2 ${
            tab === 'match' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setTab('match')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Match Performance
        </button>
      </div>

      {tab === 'training' ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Completed Sessions</p>
                  <p className="text-2xl font-bold mt-1">{trainingMetrics.completedSessions}<span className="text-gray-400 font-normal text-base">/{trainingMetrics.totalSessions}</span></p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion Rate</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Avg. Intensity</p>
                  <p className="text-2xl font-bold mt-1">{trainingMetrics.avgIntensity}/10</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${trainingMetrics.intensityChange.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {trainingMetrics.intensityChange} from last month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Drill Performance</p>
                  <p className="text-2xl font-bold mt-1">{trainingMetrics.drillPerformance}%</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${trainingMetrics.drillChange.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {trainingMetrics.drillChange} from last month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Calories Burned</p>
                  <p className="text-2xl font-bold mt-1">{trainingMetrics.caloriesBurned}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Avg. Duration: {trainingMetrics.avgDuration} mins/session</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Intensity Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900">Intensity Trend</h3>
                  <p className="text-gray-500 text-sm">Last 7 sessions</p>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 text-sm font-medium mr-2">{trainingMetrics.intensityChange}</span>
                  <span className="text-gray-500 text-sm">vs prev. period</span>
                </div>
              </div>
              <div className="h-64">
                <svg viewBox="0 0 400 240" className="w-full">
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    points={trainingMetrics.intensityTrend.map((val, i) => 
                      `${40 + i * 50},${220 - val * 20}`
                    ).join(' ')}
                  />
                  {trainingMetrics.intensityTrend.map((val, i) => (
                    <g key={i}>
                      <circle
                        cx={40 + i * 50}
                        cy={220 - val * 20}
                        r="4"
                        fill="#3B82F6"
                      />
                      <text
                        x={40 + i * 50}
                        y={220 - val * 20 - 10}
                        textAnchor="middle"
                        fill="#4B5563"
                        fontSize="12"
                      >
                        {val}
                      </text>
                    </g>
                  ))}
                  <g transform="translate(0,220)">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <text
                        key={i}
                        x={40 + i * 50}
                        y="20"
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="12"
                      >
                        {day}
                      </text>
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            {/* Drill Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900">Drill Performance</h3>
                  <p className="text-gray-500 text-sm">Last 7 sessions</p>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 text-sm font-medium mr-2">{trainingMetrics.drillChange}</span>
                  <span className="text-gray-500 text-sm">vs prev. period</span>
                </div>
              </div>
              <div className="h-64">
                <svg viewBox="0 0 400 240" className="w-full">
                  {trainingMetrics.drillTrend.map((val, i) => (
                    <g key={i}>
                      <rect
                        x={50 + i * 45}
                        y={220 - val * 2}
                        width="30"
                        height={val * 2}
                        rx="4"
                        fill="#10B981"
                      />
                      <text
                        x={65 + i * 45}
                        y={220 - val * 2 - 10}
                        textAnchor="middle"
                        fill="#4B5563"
                        fontSize="12"
                      >
                        {val}%
                      </text>
                    </g>
                  ))}
                  <g transform="translate(0,220)">
                    {['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'].map((drill, i) => (
                      <text
                        key={i}
                        x={65 + i * 45}
                        y="20"
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="12"
                      >
                        {drill}
                      </text>
                    ))}
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Training Days */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Top Training Days</h3>
              <div className="space-y-4">
                {trainingMetrics.topDays.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-500 w-12">{day.day}</span>
                    <div className="flex-1 ml-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(day.count / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 ml-2 w-8">{day.count} sessions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Bests */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Personal Bests</h3>
              <div className="space-y-4">
                {trainingMetrics.personalBests.map((pb, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{pb.drill}</p>
                      <p className="text-sm text-gray-500">New record: {pb.value}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {pb.improvement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Improved */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900">Most Improved Drill</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {trainingMetrics.mostImprovedValue}
                </span>
              </div>
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-900">{trainingMetrics.mostImprovedDrill}</p>
                <p className="text-gray-500 mt-2">Significant improvement in speed and accuracy</p>
              </div>
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            View Detailed Training Report
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Matches</p>
                  <p className="text-2xl font-bold mt-1">{matchMetrics.totalMatches}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-medium text-green-600">{matchMetrics.wins}W</span>
                <span className="text-sm font-medium text-yellow-500">{matchMetrics.draws}D</span>
                <span className="text-sm font-medium text-red-600">{matchMetrics.losses}L</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Avg. Rating</p>
                  <p className="text-2xl font-bold mt-1">{matchMetrics.avgRating}/10</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${matchMetrics.ratingChange.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {matchMetrics.ratingChange} from last month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Goals & Assists</p>
                  <div className="flex gap-6 mt-2">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{matchMetrics.goals}</p>
                      <p className="text-xs text-gray-500">Goals</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{matchMetrics.assists}</p>
                      <p className="text-xs text-gray-500">Assists</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Avg. minutes: {matchMetrics.avgMinutes} per match</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Pass Accuracy</p>
                  <p className="text-2xl font-bold mt-1">{matchMetrics.passAccuracy}%</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${matchMetrics.passChange.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {matchMetrics.passChange} from last month
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Win/Loss Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Match Results</h3>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <circle r="16" cx="16" cy="16" fill="#eee" />
                    <path 
                      d={`M16 16 L16 0 A16 16 0 ${winPct > 50 ? 1 : 0} 1 ${16 + 16 * Math.sin((winPct/100)*2*Math.PI)} ${16 - 16 * Math.cos((winPct/100)*2*Math.PI)} Z`} 
                      fill="#22c55e" 
                    />
                    <path 
                      d={`M16 16 L${16 + 16 * Math.sin((winPct/100)*2*Math.PI)} ${16 - 16 * Math.cos((winPct/100)*2*Math.PI)} A16 16 0 ${drawPct > 50 ? 1 : 0} 1 ${16 + 16 * Math.sin(((winPct+drawPct)/100)*2*Math.PI)} ${16 - 16 * Math.cos(((winPct+drawPct)/100)*2*Math.PI)} Z`} 
                      fill="#eab308" 
                    />
                    <path 
                      d={`M16 16 L${16 + 16 * Math.sin(((winPct+drawPct)/100)*2*Math.PI)} ${16 - 16 * Math.cos(((winPct+drawPct)/100)*2*Math.PI)} A16 16 0 1 1 16 0 Z`} 
                      fill="#ef4444" 
                    />
                    <circle r="8" cx="16" cy="16" fill="white" />
                    <text x="16" y="16" textAnchor="middle" dy=".3em" fontSize="6" fill="#4B5563">
                      {totalResults} matches
                    </text>
                  </svg>
                  
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{Math.round(winPct)}%</p>
                      <p className="text-xs text-gray-500">Win Rate</p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-12 space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <div>
                      <span className="font-medium">{matchMetrics.wins} Wins</span>
                      <span className="text-gray-500 ml-2">{Math.round(winPct)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                    <div>
                      <span className="font-medium">{matchMetrics.draws} Draws</span>
                      <span className="text-gray-500 ml-2">{Math.round(drawPct)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <div>
                      <span className="font-medium">{matchMetrics.losses} Losses</span>
                      <span className="text-gray-500 ml-2">{Math.round(lossPct)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Heatmap */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900">Position Heatmap</h3>
                  <p className="text-gray-500 text-sm">Avg. position in last 5 matches</p>
                </div>
              </div>
              <div className="h-64 relative">
                <div className="w-full h-full border border-gray-300 rounded-lg bg-green-50 relative">
                  {/* Soccer field representation */}
                  <div className="absolute inset-0 border-r border-l border-gray-300" style={{ left: '25%', right: '25%' }}></div>
                  <div className="absolute inset-0 border-t border-b border-gray-300" style={{ top: '25%', bottom: '25%' }}></div>
                  <div className="absolute rounded-full border border-gray-300" style={{ top: '25%', left: '25%', right: '25%', bottom: '25%' }}></div>
                  
                  {/* Position markers */}
                  {matchMetrics.positionHeatmap.map((pos, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-blue-600 opacity-70"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        width: `${10 + pos.value/5}px`,
                        height: `${10 + pos.value/5}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                  ))}
                  
                  {/* Player marker */}
                  <div className="absolute rounded-full bg-red-500 border-2 border-white w-6 h-6 flex items-center justify-center"
                    style={{ left: '70%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                    <span className="text-xs text-white font-bold">13</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disciplinary Record */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Disciplinary Record</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">{matchMetrics.cards.yellow}</span>
                  </div>
                  <p className="font-medium">Yellow Cards</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">{matchMetrics.cards.red}</span>
                  </div>
                  <p className="font-medium">Red Cards</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">{matchMetrics.cards.fouls}</span>
                  </div>
                  <p className="font-medium">Fouls</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Fair Play Score</span>
                  <span className="font-medium">8.7/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>

            {/* Match Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Match Highlights</h3>
              <div className="space-y-4">
                {matchMetrics.highlights.map((match, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${match.mvp ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{match.match}</p>
                        <p className="text-sm text-gray-500">{match.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${match.rating > 8.5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {match.rating}/10
                        </span>
                        {match.mvp && (
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                            MVP
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {match.mvp ? 'Outstanding performance with 2 goals' : 'Solid performance with 1 assist'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            View Detailed Match Report
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Performance;