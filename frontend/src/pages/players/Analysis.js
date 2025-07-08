import React from 'react';

const recentAnalyses = [
  { 
    title: 'Match vs Tigers', 
    date: '2024-07-10', 
    type: 'Video', 
    summary: 'Reviewed defensive positioning and transition play', 
    duration: '18:42',
    keyInsights: [
      'Improved defensive shape by 15% compared to previous match',
      'Identified 3 instances of poor transition positioning'
    ],
    coachComments: 'Excellent recovery runs but need quicker defensive transitions',
    rating: 7.8
  },
  { 
    title: 'Training Session 15', 
    date: '2024-07-08', 
    type: 'Tactical', 
    summary: 'Analyzed pressing strategy and high block', 
    duration: '12:15',
    keyInsights: [
      'Pressing success rate increased to 62%',
      'Identified optimal pressing triggers'
    ],
    coachComments: 'Effective pressing but need better coordination with midfield',
    rating: 8.2
  },
  { 
    title: 'Match vs Eagles', 
    date: '2024-07-03', 
    type: 'Video', 
    summary: 'Focused on attacking patterns and final third entries', 
    duration: '22:05',
    keyInsights: [
      'Created 12 scoring opportunities from wide areas',
      'Final third passing accuracy improved to 78%'
    ],
    coachComments: 'Excellent movement in attacking third but need better finishing',
    rating: 8.5
  },
];

const tacticalBoards = [
  {
    title: 'Defensive Shape 4-3-3',
    formation: '4-3-3',
    description: 'Mid-block defensive organization with pressing triggers',
    created: '2024-07-12'
  },
  {
    title: 'Attacking Pattern - Right Side',
    formation: '4-2-3-1',
    description: 'Overload right side with overlapping runs',
    created: '2024-07-05'
  },
  {
    title: 'Set Piece - Corner Defense',
    formation: 'Zonal Marking',
    description: 'Zone defense with specific player responsibilities',
    created: '2024-06-28'
  }
];

const upcomingAnalyses = [
  {
    match: 'vs Wolves',
    date: '2024-07-18',
    focus: 'Midfield transition and counter-pressing',
    assignedCoach: 'Coach Davis'
  },
  {
    match: 'Training Session 18',
    date: '2024-07-15',
    focus: 'Set piece execution and variations',
    assignedCoach: 'Coach Rodriguez'
  }
];

const Analysis = () => (
  <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video & Tactical Analysis</h1>
          <p className="text-gray-600 mt-1">Review matches and training sessions for deeper performance insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div>
              <p className="font-medium">Alex Morgan</p>
              <p className="text-xs text-gray-500">Forward • #13</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <select className="text-sm bg-transparent border-none focus:ring-0">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Season 2024</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Latest Video Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Latest Video Analysis</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Most recent match review with key insights</p>
          </div>
          
          <div className="p-6">
            <div className="relative rounded-lg overflow-hidden mb-4">
              <div className="aspect-video bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <p className="text-white text-lg font-bold">Match vs Tigers</p>
                  <p className="text-blue-200 text-sm">July 10, 2024 • 18:42 duration</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">VIDEO</span>
                      <span className="text-white text-sm">Defensive Analysis</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-white bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                    <button className="text-white bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Key Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Defensive shape improved by 15% compared to previous match</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Identified 3 critical transition moments needing improvement</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Coach Feedback</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-700">"Excellent recovery runs but need quicker defensive transitions. Focus on communication with midfielders during opponent build-up."</p>
                  <div className="flex items-center mt-3">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-500">Coach Thompson</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Overall Rating:</span>
                  <div className="flex items-center">
                    <span className="text-amber-500 font-bold">7.8</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span>10</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                  View Full Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Analyses</h2>
            <p className="text-gray-500 text-sm mt-1">Your last reviewed sessions and matches</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentAnalyses.map((a, i) => (
              <div key={i} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {a.type === 'Video' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900">{a.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-1">{a.type}</span>
                        <span className="text-xs text-gray-500">{a.duration}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-gray-500 text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {a.date}
                    </div>
                    
                    <p className="mt-2 text-gray-700">{a.summary}</p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium mr-2">Rating:</span>
                        <div className="flex items-center">
                          <span className="text-amber-500 font-bold">{a.rating}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span>10</span>
                        </div>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition flex items-center">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
              View All Analyses
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Tactical Board */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Tactical Boards</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition flex items-center">
                Create New
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-1">Team strategies and formations</p>
          </div>
          
          <div className="p-6">
            <div className="aspect-video bg-gradient-to-br from-green-700 to-green-900 rounded-lg overflow-hidden relative mb-6">
              {/* Soccer Field */}
              <div className="absolute inset-0 border-4 border-white rounded-lg">
                {/* Center line and circle */}
                <div className="absolute top-0 bottom-0 left-1/2 border-l-2 border-white border-dashed"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white"></div>
                
                {/* Penalty areas */}
                <div className="absolute top-0 bottom-0 left-0 w-1/4 border-r-2 border-white">
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-24 border-2 border-white rounded-l-lg"></div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-10 border-2 border-white rounded-l-lg"></div>
                </div>
                <div className="absolute top-0 bottom-0 right-0 w-1/4 border-l-2 border-white">
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-24 border-2 border-white rounded-r-lg"></div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-10 border-2 border-white rounded-r-lg"></div>
                </div>
                
                {/* Players */}
                {['35,25', '35,55', '35,85', '65,40', '65,70', '95,30', '95,70', '120,25', '120,55', '120,85'].map((pos, i) => (
                  <div 
                    key={i} 
                    className={`absolute rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 ${
                      i < 4 ? 'bg-blue-500 border-blue-700 text-white' : 
                      i < 6 ? 'bg-red-500 border-red-700 text-white' : 
                      'bg-gray-800 border-gray-900 text-white'
                    }`}
                    style={{ 
                      left: pos.split(',')[0] + 'px', 
                      top: pos.split(',')[1] + 'px',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {i < 4 ? 'D' : i < 6 ? 'M' : 'F'}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900">Defensive Shape 4-3-3</h3>
                <p className="text-gray-600 text-sm mt-1">Mid-block organization with pressing triggers in central areas</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Last updated: 2024-07-12
                </div>
                <button className="text-blue-600 font-medium hover:text-blue-800 transition">
                  Edit Board
                </button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4">
              {tacticalBoards.map((board, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer">
                  <div className="font-medium text-gray-900 truncate">{board.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{board.formation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Analyses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Analyses</h2>
            <p className="text-gray-500 text-sm mt-1">Scheduled reviews and sessions</p>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4">
              {upcomingAnalyses.map((item, i) => (
                <li key={i} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.match}</div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {item.date} • {item.assignedCoach}
                    </div>
                    <div className="mt-2 text-sm text-gray-700 flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      <span>Focus: {item.focus}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                Schedule New Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Resources */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">Analysis Resources</h2>
            <p className="text-blue-200 text-sm mt-1">Tools and tutorials to improve your analysis skills</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <a href="#" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="text-white font-medium">Tutorials</span>
                </div>
              </a>
              <a href="#" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <span className="text-white font-medium">Templates</span>
                </div>
              </a>
              <a href="#" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white font-medium">Calendar</span>
                </div>
              </a>
              <a href="#" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-white font-medium">Reports</span>
                </div>
              </a>
            </div>
            
            <button className="w-full mt-6 py-3 px-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition">
              Access Premium Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Analysis;