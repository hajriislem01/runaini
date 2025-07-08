import React from 'react';

const coachFeedback = {
  name: 'Coach Sarah Thompson',
  title: 'Head Coach',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  date: '2024-07-12',
  rating: 4.8,
  feedback: 'Excellent performance in the last match, Alex. Your agility drills are showing great results. Focus on improving your passing accuracy in tight spaces during the next training session.',
  areas: [
    { name: 'Technical Skills', rating: 4.5, trend: 'up' },
    { name: 'Tactical Awareness', rating: 4.7, trend: 'up' },
    { name: 'Physical Conditioning', rating: 4.9, trend: 'steady' },
    { name: 'Mental Toughness', rating: 4.3, trend: 'up' }
  ],
  nextSteps: [
    'Increase long-range passing practice',
    'Focus on quick decision-making under pressure',
    'Improve weak foot accuracy'
  ]
};

const peerFeedback = [
  { 
    name: 'Jordan Miller', 
    position: 'Midfielder',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2024-07-14',
    comment: 'Your vision and passing were exceptional in the last game. That through ball in the 75th minute was perfect!',
    rating: 5.0
  },
  { 
    name: 'Sam Rodriguez', 
    position: 'Defender',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    date: '2024-07-13',
    comment: 'Your defensive support was crucial. Loved how you tracked back to cover my position when I pushed forward.',
    rating: 4.5
  },
  { 
    name: 'Chris Evans', 
    position: 'Forward',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    date: '2024-07-11',
    comment: 'Your energy in training sessions is contagious. The way you lead the pressing sets the tone for all of us.',
    rating: 4.7
  }
];

const feedbackSummary = {
  avgRating: 4.7,
  total: 18,
  distribution: [
    { rating: 5, count: 10, percentage: 56 },
    { rating: 4, count: 6, percentage: 33 },
    { rating: 3, count: 2, percentage: 11 },
    { rating: 2, count: 0, percentage: 0 },
    { rating: 1, count: 0, percentage: 0 }
  ],
  trends: [
    { month: 'Apr', rating: 4.2 },
    { month: 'May', rating: 4.4 },
    { month: 'Jun', rating: 4.6 },
    { month: 'Jul', rating: 4.7 }
  ]
};

const Feedback = () => (
  <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coach & Peer Feedback</h1>
          <p className="text-gray-600 mt-1">See what your coaches and teammates are saying about your performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div>
              <p className="font-medium">Alex Morgan</p>
              <p className="text-xs text-gray-500">Forward • #13</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
            Request Feedback
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Summary */}
      <div className="lg:col-span-1 space-y-8">
        {/* Feedback Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Feedback Summary</h2>
            <p className="text-gray-500 text-sm mt-1">Overall performance rating from coaches and peers</p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="text-5xl font-bold text-gray-900">{feedbackSummary.avgRating}</div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${star <= Math.floor(feedbackSummary.avgRating) ? 'text-amber-500' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mt-2">Based on {feedbackSummary.total} reviews</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Rating Distribution</h3>
              {feedbackSummary.distribution.map((dist, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-10 text-sm text-gray-500 flex items-center">
                    {dist.rating}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${dist.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm text-gray-500">{dist.percentage}%</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Rating Trend</h3>
              <div className="h-40">
                <svg viewBox="0 0 300 150" className="w-full">
                  <polyline 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="3" 
                    points={feedbackSummary.trends.map((t, i) => 
                      `${50 + i * 60},${130 - t.rating * 25}`
                    ).join(' ')} 
                  />
                  {feedbackSummary.trends.map((t, i) => (
                    <g key={i}>
                      <circle
                        cx={50 + i * 60}
                        cy={130 - t.rating * 25}
                        r="4"
                        fill="#3B82F6"
                      />
                      <text
                        x={50 + i * 60}
                        y={130 - t.rating * 25 - 10}
                        textAnchor="middle"
                        fill="#4B5563"
                        fontSize="12"
                      >
                        {t.rating}
                      </text>
                      <text
                        x={50 + i * 60}
                        y="145"
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="12"
                      >
                        {t.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feedback Actions */}
        <div className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">Feedback Resources</h2>
            <p className="text-blue-200 text-sm mt-1">Tools to help you improve based on feedback</p>
            
            <div className="mt-6 space-y-4">
              <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition">
                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-white font-medium">Personal Development Plan</span>
              </a>
              
              <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Improvement Checklists</span>
              </a>
              
              <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition">
                <div className="bg-amber-500 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Training Schedules</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Latest Coach Feedback */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Latest Coach Feedback</h2>
              <p className="text-gray-500 text-sm mt-1">Detailed assessment from your primary coach</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-5">
              <img
                src={coachFeedback.avatar}
                alt={coachFeedback.name}
                className="w-16 h-16 rounded-full border-2 border-blue-200"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{coachFeedback.name}</h3>
                    <p className="text-gray-500 text-sm">{coachFeedback.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-amber-500 font-bold">{coachFeedback.rating}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span>5</span>
                    </div>
                    <span className="text-gray-500 text-sm">{coachFeedback.date}</span>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-700">"{coachFeedback.feedback}"</p>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Skill Area Ratings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coachFeedback.areas.map((area, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{area.name}</span>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-900 mr-1">{area.rating}</span>
                            <span className="text-gray-400">/5</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              area.rating >= 4.5 ? 'bg-green-500' : 
                              area.rating >= 4 ? 'bg-blue-500' : 
                              area.rating >= 3.5 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${area.rating * 20}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Needs Work</span>
                          <span className="flex items-center">
                            {area.trend === 'up' ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                                Improving
                              </>
                            ) : area.trend === 'down' ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                </svg>
                                Declining
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                Steady
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
                  <ul className="space-y-2">
                    {coachFeedback.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                    Ask for Clarification
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                    Acknowledge Feedback
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Peer Feedback */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Peer Feedback</h2>
              <span className="text-sm text-gray-500">{peerFeedback.length} recent reviews</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Feedback from your teammates</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {peerFeedback.map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{f.name}</h3>
                        <p className="text-gray-500 text-sm">{f.position}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900">{f.rating}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span>5</span>
                        </div>
                        <span className="text-gray-500 text-sm">{f.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">"{f.comment}"</p>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                View All Peer Feedback
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Feedback;