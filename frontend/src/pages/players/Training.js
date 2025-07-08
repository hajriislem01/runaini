import React from 'react';
import { FaDumbbell, FaRunning, FaCalendarAlt, FaChartLine, FaMedal, FaClock, FaFire, FaHeartbeat, FaArrowUp, FaChevronRight } from 'react-icons/fa';

const Training = () => {
  const trainingHistory = [
    {
      id: 1,
      date: '2024-07-20',
      type: 'Tactical Drills',
      focus: 'Offensive Strategies',
      duration: '90 minutes',
      intensity: 'High',
      calories: 580,
      coach: 'Coach Thompson',
      rating: 8.7,
      progress: '+12%'
    },
    {
      id: 2,
      date: '2024-07-15',
      type: 'Skill Development',
      focus: 'Dribbling and Passing',
      duration: '60 minutes',
      intensity: 'Medium',
      calories: 420,
      coach: 'Coach Rodriguez',
      rating: 7.9,
      progress: '+8%'
    },
    {
      id: 3,
      date: '2024-07-10',
      type: 'Fitness Training',
      focus: 'Endurance and Speed',
      duration: '75 minutes',
      intensity: 'High',
      calories: 650,
      coach: 'Coach Davis',
      rating: 9.2,
      progress: '+15%'
    },
    {
      id: 4,
      date: '2024-07-05',
      type: 'Strength & Conditioning',
      focus: 'Upper Body Strength',
      duration: '85 minutes',
      intensity: 'High',
      calories: 720,
      coach: 'Coach Wilson',
      rating: 8.4,
      progress: '+9%'
    },
    {
      id: 5,
      date: '2024-07-01',
      type: 'Agility Training',
      focus: 'Footwork and Coordination',
      duration: '55 minutes',
      intensity: 'Medium',
      calories: 380,
      coach: 'Coach Martinez',
      rating: 8.1,
      progress: '+11%'
    }
  ];

  const upcomingSessions = [
    {
      date: '2024-07-25',
      time: '10:00 AM',
      type: 'Tactical Analysis',
      focus: 'Defensive Positioning',
      duration: '75 mins',
      location: 'Training Field A'
    },
    {
      date: '2024-07-27',
      time: '3:00 PM',
      type: 'Strength Training',
      focus: 'Lower Body Power',
      duration: '90 mins',
      location: 'Gymnasium'
    },
    {
      date: '2024-07-29',
      time: '9:30 AM',
      type: 'Speed Drills',
      focus: 'Acceleration',
      duration: '60 mins',
      location: 'Track Field'
    }
  ];

  const trainingMetrics = [
    { name: 'Sessions Completed', value: 18, target: 25, icon: <FaDumbbell className="text-blue-500" /> },
    { name: 'Avg. Duration', value: '72 mins', icon: <FaClock className="text-purple-500" /> },
    { name: 'Calories Burned', value: '12,450', icon: <FaFire className="text-red-500" /> },
    { name: 'Avg. Rating', value: 8.5, target: 9.0, icon: <FaChartLine className="text-green-500" /> }
  ];

  const trainingProgress = [
    { skill: 'Speed', progress: 85, improvement: '+8%' },
    { skill: 'Agility', progress: 78, improvement: '+12%' },
    { skill: 'Strength', progress: 82, improvement: '+6%' },
    { skill: 'Endurance', progress: 88, improvement: '+10%' },
    { skill: 'Accuracy', progress: 76, improvement: '+9%' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Program</h1>
          <p className="text-gray-600 mt-1">Track your training sessions, progress, and upcoming workouts</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div>
              <p className="font-medium">Alex Morgan</p>
              <p className="text-xs text-gray-500">Forward • #13</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <FaCalendarAlt /> View Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personalized Training */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm">Today's Session</span>
                    <span className="text-blue-200 text-sm">Recommended</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Agility and Speed Drills</h2>
                  <p className="text-blue-100 mb-4">Focus on improving your agility and speed with personalized drills designed for forwards.</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-200" />
                      <span>75 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFire className="text-blue-200" />
                      <span>Estimated 520 calories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaHeartbeat className="text-blue-200" />
                      <span>High Intensity</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-3 bg-white text-blue-700 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2">
                      Start Session
                      <FaRunning />
                    </button>
                    <button className="px-5 py-3 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition flex items-center gap-2">
                      View Details
                      <FaChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                    alt="Training"
                    className="w-56 h-40 object-cover rounded-lg shadow-lg border-4 border-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Training Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Training Metrics</h2>
              <p className="text-gray-500 text-sm mt-1">Your overall training performance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
              {trainingMetrics.map((metric, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-gray-500 text-sm">{metric.name}</div>
                      <div className="text-2xl font-bold mt-1">{metric.value}</div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {metric.icon}
                    </div>
                  </div>
                  {metric.target && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target: {metric.target}</span>
                        <span className="font-medium">{Math.round((metric.value / metric.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-600" 
                          style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Training History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Training History</h2>
                <p className="text-gray-500 text-sm mt-1">Your recent training sessions</p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                View All History
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.date}</div>
                        <div className="text-sm text-gray-500">{item.coach}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.type}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaFire className={`mr-1 ${item.intensity === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
                          {item.intensity} Intensity
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{item.focus}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.duration}</div>
                        <div className="text-xs text-gray-500">{item.calories} cal</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span>10</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${i < Math.floor(item.rating / 2) ? 'text-amber-500' : 'text-gray-300'}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <FaArrowUp />
                          {item.progress}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Training Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Skill Progress</h2>
              <p className="text-gray-500 text-sm mt-1">Improvements in key skill areas</p>
            </div>
            
            <div className="p-5 space-y-4">
              {trainingProgress.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{skill.progress}%</span>
                      <span className="text-green-600 text-sm font-medium flex items-center">
                        <FaArrowUp className="mr-1" />
                        {skill.improvement}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        skill.progress >= 85 ? 'bg-green-500' : 
                        skill.progress >= 75 ? 'bg-blue-500' : 
                        'bg-amber-500'
                      }`} 
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
              <p className="text-gray-500 text-sm mt-1">Your scheduled training sessions</p>
            </div>
            
            <div className="p-5 space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">{session.type}</div>
                      <div className="text-sm text-gray-500">{session.focus}</div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {session.duration}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <div className="flex items-center text-gray-500">
                      <FaCalendarAlt className="mr-2" />
                      {session.date} • {session.time}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {session.location}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
                      Add to Calendar
                      <FaChevronRight className="ml-1 text-xs" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-4 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                View Full Schedule
                <FaCalendarAlt />
              </button>
            </div>
          </div>

          {/* Training Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Training Calendar</h2>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    &lt;
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    &gt;
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-1">July 2024</p>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-7 gap-1 text-center text-gray-500 mb-3 text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="font-medium">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Empty days before July 1st (July 1, 2024 is a Monday) */}
                <div></div>
                
                {/* July days */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const hasTraining = [5, 8, 12, 15, 19, 22, 25, 29].includes(day);
                  const isToday = day === 23;
                  
                  return (
                    <div 
                      key={day} 
                      className={`min-h-16 p-1 border rounded ${
                        isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className={`text-right text-sm p-1 ${
                        isToday ? 'font-bold text-blue-700' : ''
                      }`}>
                        {day}
                      </div>
                      
                      {hasTraining && (
                        <div className="text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5 mt-1 truncate">
                          Training
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Training Resources */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">Training Resources</h2>
              <p className="text-blue-200 text-sm mt-1">Tools to enhance your training</p>
              
              <div className="mt-6 space-y-3">
                <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition">
                  <div className="bg-blue-500 p-2 rounded-lg mr-3">
                    <FaRunning className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Drill Library</span>
                </a>
                
                <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition">
                  <div className="bg-amber-500 p-2 rounded-lg mr-3">
                    <FaChartLine className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Performance Reports</span>
                </a>
                
                <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition">
                  <div className="bg-green-500 p-2 rounded-lg mr-3">
                    <FaMedal className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Training Plans</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;