import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  FaEnvelope, FaPhone, FaUser, FaMedal, FaLinkedin,
  FaFacebook, FaInstagram, FaChartLine, FaTrophy,
  FaGraduationCap, FaCalendarAlt, FaUsers, FaGlobe
} from 'react-icons/fa';

const PlayerProfile = () => {
  const { player } = usePlayer();
  const {
    name, email, phone, location, profilePicture, bio,
    philosophy, methodology, experiences, certifications
  } = player;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Player Profile</h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-2 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-green-400 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-6xl text-white font-bold border-4 border-white shadow-xl">
                      {name ? name[0] : 'P'}
                    </div>
                  )}
                  <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full flex items-center text-sm font-bold shadow-lg">
                    <FaMedal className="mr-2" /> PLAYER
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1 flex items-center gap-2">
                  <FaUser className="text-green-500" /> {name || 'Not provided'}
                </h2>
                <div className="text-green-600 font-medium mb-3">Professional Football Player</div>
                <div className="flex flex-col gap-2 mb-4 text-gray-600 w-full max-w-xs">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-green-500 flex-shrink-0" />
                    <span className="truncate">{email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-green-500 flex-shrink-0" />
                    <span>{phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaGlobe className="text-green-500 flex-shrink-0" />
                    <span>{location || 'Not provided'}</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 mb-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:text-white hover:bg-green-700 transition">
                    <FaLinkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:text-white hover:bg-green-600 transition">
                    <FaFacebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-pink-500 hover:text-white hover:bg-pink-500 transition">
                    <FaInstagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Detailed Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                About & Bio
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Player Bio</label>
                <p className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                  {bio || 'Not provided'}
                </p>
              </div>
            </div>
            {/* Playing Philosophy */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Playing Philosophy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <label className="block text-sm font-medium text-green-700 mb-2">Personal Development</label>
                  <p className="w-full text-sm p-2 bg-white rounded border border-green-200">
                    {philosophy?.development || 'Not provided'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Playing Style</label>
                  <p className="w-full text-sm p-2 bg-white rounded border border-blue-200">
                    {philosophy?.tactical || 'Not provided'}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <label className="block text-sm font-medium text-amber-700 mb-2">Mental Approach</label>
                  <p className="w-full text-sm p-2 bg-white rounded border border-amber-200">
                    {philosophy?.mental || 'Not provided'}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <label className="block text-sm font-medium text-purple-700 mb-2">Team Values</label>
                  <p className="w-full text-sm p-2 bg-white rounded border border-purple-200">
                    {philosophy?.culture || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Playing Experience
              </h2>
              <div className="space-y-4 mb-6">
                {experiences && experiences.length > 0 ? experiences.map((exp, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FaUsers size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-lg text-gray-800">{exp.role || 'Not provided'}</h4>
                      </div>
                      <div className="text-green-600 font-medium">{exp.club || 'Not provided'}</div>
                      <div className="text-gray-500 text-sm">{exp.period || 'Not provided'}</div>
                      <p className="text-gray-700 mt-2 text-sm">
                        {exp.description || 'Not provided'}
                      </p>
                    </div>
                  </div>
                )) : <p className="text-gray-500">No experience provided.</p>}
              </div>
            </div>
            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Certifications & Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {certifications && certifications.length > 0 ? certifications.map((cert, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 group relative">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FaTrophy size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{cert.name || 'Not provided'}</h4>
                      <div className="text-gray-500 text-sm">{cert.year || 'Not provided'}</div>
                    </div>
                  </div>
                )) : <p className="text-gray-500">No certifications provided.</p>}
              </div>
            </div>
            {/* Training Methodology */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Training Approach
              </h2>
              <div className="space-y-4">
                {methodology && methodology.length > 0 ? methodology.map((method, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Training Method {index + 1}
                      </label>
                      <p className="w-full px-3 py-2 border rounded-lg bg-gray-50">
                        {method || 'Not provided'}
                      </p>
                    </div>
                  </div>
                )) : <p className="text-gray-500">No training methods provided.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile; 