import React from 'react';
import { useCoach } from '../../context/CoachContext';
import { 
  FaEnvelope, FaPhone, FaUserTie, FaMedal, FaLinkedin, 
  FaFacebook, FaInstagram, FaChartLine, FaTrophy, 
  FaGraduationCap, FaCalendarAlt, FaUsers, FaGlobe , FaBrain
} from 'react-icons/fa';

const CoachProfile = () => {
  const { coach } = useCoach();

  // Sample data - replace with actual data from your context
  const stats = {
    winRate: 78,
    sessions: 245,
    players: 32
  };

  const experiences = [
    { id: 1, role: "Head Coach", club: "FC Barcelona", period: "2018-2021" },
    { id: 2, role: "Assistant Coach", club: "Real Madrid", period: "2015-2018" },
    { id: 3, role: "Youth Coach", club: "Atletico Madrid", period: "2012-2015" }
  ];

  const certifications = [
    { id: 1, name: "UEFA Pro License", year: "2018" },
    { id: 2, name: "FIFA Technical Director", year: "2016" },
    { id: 3, name: "Sports Science Diploma", year: "2014" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Coach Profile</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>
        
        {/* Main Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {coach.profilePicture ? (
                    <img
                      src={coach.profilePicture}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-6xl text-white font-bold border-4 border-white shadow-xl">
                      {coach.name[0]}
                    </div>
                  )}
                  <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full flex items-center text-sm font-bold shadow-lg">
                    <FaMedal className="mr-2" /> PRO COACH
                  </span>
                </div>
                
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1 flex items-center gap-2">
                  <FaUserTie className="text-blue-500" /> {coach.name}
                </h2>
                
                <div className="text-blue-600 font-medium mb-3">Senior Football Coach</div>
                
                <div className="flex flex-col gap-2 mb-4 text-gray-600 w-full max-w-xs">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <span className="truncate">{coach.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-blue-500 flex-shrink-0" />
                    <span>{coach.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaGlobe className="text-blue-500 flex-shrink-0" />
                    <span>Madrid, Spain</span>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-2 mb-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 hover:text-white hover:bg-blue-700 transition">
                    <FaLinkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:text-white hover:bg-blue-600 transition">
                    <FaFacebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-pink-500 hover:text-white hover:bg-pink-500 transition">
                    <FaInstagram size={18} />
                  </a>
                </div>
                
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" /> Stats
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-100">
                      <div className="text-2xl font-bold text-blue-700">{stats.winRate}%</div>
                      <div className="text-xs text-gray-600">Win Rate</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center border border-green-100">
                      <div className="text-2xl font-bold text-green-700">{stats.sessions}</div>
                      <div className="text-xs text-gray-600">Sessions</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center border border-amber-100">
                      <div className="text-2xl font-bold text-amber-700">{stats.players}</div>
                      <div className="text-xs text-gray-600">Players</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Detailed Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaUserTie className="text-blue-500" /> Professional Profile
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {coach.bio || "Dedicated football coach with 12+ years of experience in professional football academies. Specialized in youth development and tactical training. UEFA Pro License holder with a proven track record of developing players for professional leagues. Passionate about implementing modern training methodologies and data-driven approaches to maximize player potential."}
              </p>
            </div>
            
            {/* Coaching Philosophy */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaBrain className="text-blue-500" /> Coaching Philosophy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-700 mb-2">Player Development</h4>
                  <p className="text-sm text-gray-700">
                    Focus on individual growth through personalized training programs and continuous feedback.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-bold text-green-700 mb-2">Tactical Approach</h4>
                  <p className="text-sm text-gray-700">
                    Implement modern possession-based systems with high pressing and quick transitions.
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h4 className="font-bold text-amber-700 mb-2">Mental Conditioning</h4>
                  <p className="text-sm text-gray-700">
                    Build resilience and competitive mindset through psychological training techniques.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="font-bold text-purple-700 mb-2">Team Culture</h4>
                  <p className="text-sm text-gray-700">
                    Foster leadership, accountability and strong team cohesion through group activities.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" /> Professional Experience
              </h3>
              <div className="space-y-4">
                {experiences.map(exp => (
                  <div key={exp.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FaUsers size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{exp.role}</h4>
                      <div className="text-blue-600 font-medium">{exp.club}</div>
                      <div className="text-gray-500 text-sm">{exp.period}</div>
                      <p className="text-gray-700 mt-2 text-sm">
                        Led first team to 3 consecutive league titles and implemented youth academy restructuring.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" /> Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="flex gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FaTrophy size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{cert.name}</h4>
                      <div className="text-gray-500 text-sm">{cert.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Coaching Methodology */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Training Methodology
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Technical Drills</h4>
                    <p className="text-gray-700 text-sm">
                      Position-specific exercises focusing on ball control, passing accuracy, and shooting technique.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Tactical Sessions</h4>
                    <p className="text-gray-700 text-sm">
                      Video analysis and on-field scenarios to develop game intelligence and decision-making.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Physical Conditioning</h4>
                    <p className="text-gray-700 text-sm">
                      Customized fitness programs targeting endurance, strength, and injury prevention.
                    </p>
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

export default CoachProfile;