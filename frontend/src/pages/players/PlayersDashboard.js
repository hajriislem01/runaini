import React from 'react';
import { 
  FaDumbbell, 
  FaRunning, 
  FaChevronRight, 
  FaChartLine, 
  FaMedal, 
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaHeartbeat,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const PlayersDashboard = () => {
  // Performance data
  const performanceData = [
    { metric: 'Sprint Speed', value: '8.7 m/s', change: '+2.3%', icon: <FaRunning className="text-blue-500" /> },
    { metric: 'Vertical Jump', value: '68cm', change: '+5cm', icon: <FaArrowUp className="text-green-500" /> },
    { metric: 'Pass Accuracy', value: '89%', change: '+4%', icon: <FaChartLine className="text-purple-500" /> },
    { metric: 'Recovery Rate', value: '92%', change: '+8%', icon: <FaHeartbeat className="text-red-500" /> }
  ];
  
  // Training sessions
  const trainingSessions = [
    { 
      id: 1, 
      title: 'Strength & Conditioning', 
      type: 'Strength Training', 
      duration: '75 mins', 
      status: 'completed',
      progress: 100,
      icon: <FaDumbbell className="text-xl" />
    },
    { 
      id: 2, 
      title: 'Agility & Footwork', 
      type: 'Agility Drills', 
      duration: '60 mins', 
      status: 'scheduled',
      progress: 0,
      icon: <FaRunning className="text-xl" />
    },
    { 
      id: 3, 
      title: 'Tactical Session', 
      type: 'Team Strategy', 
      duration: '90 mins', 
      status: 'in-progress',
      progress: 45,
      icon: <FaMedal className="text-xl" />
    }
  ];
  
  // Upcoming events
  const upcomingEvents = [
    { title: 'Team Practice', date: 'Tomorrow, 10:00 AM', location: 'Main Field' },
    { title: 'Physio Appointment', date: 'Jul 18, 2:30 PM', location: 'Medical Center' },
    { title: 'Video Analysis Session', date: 'Jul 19, 4:00 PM', location: 'Meeting Room B' }
  ];
  
  // Latest achievements
  const achievements = [
    { title: 'Player of the Match', date: 'Jul 10, 2024', description: 'Vs Tigers' },
    { title: 'Fitness Milestone', date: 'Jul 8, 2024', description: 'Improved VO2 max by 12%' },
    { title: 'Skill Mastery', date: 'Jul 5, 2024', description: '90% passing accuracy' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Player Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Alex Morgan! Here's your performance overview and training plan.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div>
              <p className="font-medium">#13 • Forward</p>
              <p className="text-xs text-gray-500">Last login: Today, 09:42 AM</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
            View Calendar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Updated today</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              {performanceData.map((metric, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-gray-500 text-sm">{metric.metric}</div>
                      <div className="text-2xl font-bold mt-1">{metric.value}</div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {metric.icon}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <span className="text-green-600 text-sm font-medium">{metric.change}</span>
                    <span className="text-gray-500 text-sm ml-2">from last week</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Training */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Training Program</h2>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View All Sessions
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">Your personalized training plan for this week</p>
            </div>
            
            <div className="p-5 space-y-4">
              {trainingSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      {session.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between gap-2">
                        <h3 className="font-bold text-gray-900">{session.title}</h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {session.duration}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{session.type}</p>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{session.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              session.progress === 100 ? 'bg-green-500' : 
                              session.progress > 50 ? 'bg-blue-500' : 
                              'bg-amber-500'
                            }`} 
                            style={{ width: `${session.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    {session.status === 'completed' && (
                      <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2">
                        Completed
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    {session.status === 'scheduled' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                        Schedule
                        <FaCalendarAlt />
                      </button>
                    )}
                    {session.status === 'in-progress' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                        Continue
                        <FaChevronRight className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Performance Trends</h2>
              <p className="text-gray-500 text-sm mt-1">Your progress over the last 30 days</p>
            </div>
            <div className="p-5 h-64">
              <svg viewBox="0 0 500 250" className="w-full">
                <polyline 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  points="40,200 100,150 160,180 220,120 280,170 340,140 400,190 460,160"
                />
                <circle cx="40" cy="200" r="4" fill="#3B82F6" />
                <circle cx="100" cy="150" r="4" fill="#3B82F6" />
                <circle cx="160" cy="180" r="4" fill="#3B82F6" />
                <circle cx="220" cy="120" r="4" fill="#3B82F6" />
                <circle cx="280" cy="170" r="4" fill="#3B82F6" />
                <circle cx="340" cy="140" r="4" fill="#3B82F6" />
                <circle cx="400" cy="190" r="4" fill="#3B82F6" />
                <circle cx="460" cy="160" r="4" fill="#3B82F6" />
                
                <text x="40" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">1</text>
                <text x="100" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">5</text>
                <text x="160" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">10</text>
                <text x="220" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">15</text>
                <text x="280" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">20</text>
                <text x="340" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">25</text>
                <text x="400" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">30</text>
                <text x="460" y="240" textAnchor="middle" fill="#9CA3AF" fontSize="12">Today</text>
                
                <text x="10" y="30" textAnchor="middle" fill="#9CA3AF" fontSize="12" transform="rotate(-90,10,30)">Performance</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Calendar
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">Your schedule for the next 7 days</p>
            </div>
            
            <div className="p-5 space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <FaCalendarAlt className="h-4 w-4 mr-1 text-gray-400" />
                      {event.date}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-4 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                Add New Event
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Video Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Video Analysis</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Review your performance from the last game</p>
            </div>
            
            <div className="p-5">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80"
                  alt="Match Analysis"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <FaVideo className="text-2xl text-blue-600" />
                  </div>
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-gray-900">Match vs Tigers - Jul 10, 2024</h3>
                <p className="text-gray-600 mt-1">Defensive positioning and transition analysis</p>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <FaVideo /> Watch Analysis
                </button>
                <button className="py-2 px-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition">
                  <FaComments />
                </button>
              </div>
            </div>
          </div>

          {/* Latest Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Achievements</h2>
              <p className="text-gray-500 text-sm mt-1">Your accomplishments and milestones</p>
            </div>
            
            <div className="p-5 space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <FaMedal className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{achievement.title}</div>
                    <div className="text-sm text-gray-500">{achievement.date}</div>
                    <p className="text-sm text-gray-700 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-2 py-2 px-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2">
                View All Achievements
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          {/* Coach Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Coach Feedback</h2>
              <p className="text-gray-500 text-sm mt-1">Latest comments from your coach</p>
            </div>
            
            <div className="p-5">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Coach Sarah"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <div className="font-semibold text-gray-900">Coach Sarah Thompson <span className="text-gray-400 text-xs font-normal ml-2">2 days ago</span></div>
                  <div className="text-gray-700 mt-2">
                    "Great effort in the last match, Alex. Your agility drills are showing excellent results. Focus on improving your passing accuracy in tight spaces during the next training session."
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Reply
                    </button>
                    <button className="text-gray-600 text-sm font-medium hover:text-gray-800">
                      View Full Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersDashboard;