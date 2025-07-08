import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  FaEnvelope, FaPhone, FaUser, FaMedal, FaLinkedin, 
  FaFacebook, FaInstagram, FaChartLine, FaTrophy, 
  FaGraduationCap, FaCalendarAlt, FaUsers, FaGlobe,
  FaSave, FaPlus, FaTrash, FaUpload
} from 'react-icons/fa';

const PlayerSettings = () => {
  const { player, updatePlayer } = usePlayer();
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    philosophy: {
      development: '',
      tactical: '',
      mental: '',
      culture: ''
    },
    methodology: ['', '', '']
  });
  
  // State for experiences
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    role: '',
    club: '',
    period: '',
    description: ''
  });
  
  // State for certifications
  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState({
    name: '',
    year: ''
  });
  
  // State for profile picture
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  
  // Initialize form with player data
  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        email: player.email || '',
        phone: player.phone || '',
        location: player.location || 'Barcelona, Spain',
        bio: player.bio || '',
        philosophy: player.philosophy || {
          development: 'Always strive to improve and learn from every session.',
          tactical: 'Play smart, keep possession, and exploit spaces.',
          mental: 'Stay positive and resilient, even under pressure.',
          culture: 'Support teammates and build a winning spirit.'
        },
        methodology: player.methodology || [
          'Daily technical drills and ball mastery.',
          'Tactical video analysis and match review.',
          'Strength and conditioning routines.'
        ]
      });
      
      setExperiences(player.experiences || []);
      setCertifications(player.certifications || []);
      setProfilePreview(player.profilePicture || '');
    }
  }, [player]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle philosophy input changes
  const handlePhilosophyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy,
        [name]: value
      }
    }));
  };
  
  // Handle methodology input changes
  const handleMethodologyChange = (index, value) => {
    setFormData(prev => {
      const updatedMethodology = [...prev.methodology];
      updatedMethodology[index] = value;
      return { ...prev, methodology: updatedMethodology };
    });
  };
  
  // Handle experience input changes
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new experience
  const addExperience = () => {
    if (newExperience.role && newExperience.club && newExperience.period) {
      setExperiences(prev => [...prev, newExperience]);
      setNewExperience({
        role: '',
        club: '',
        period: '',
        description: ''
      });
    }
  };
  
  // Remove experience
  const removeExperience = (index) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle certification input changes
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setNewCertification(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new certification
  const addCertification = () => {
    if (newCertification.name && newCertification.year) {
      setCertifications(prev => [...prev, newCertification]);
      setNewCertification({ name: '', year: '' });
    }
  };
  
  // Remove certification
  const removeCertification = (index) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle profile picture upload
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare updated player data
    const updatedPlayer = {
      ...player,
      ...formData,
      experiences,
      certifications,
      profilePicture: profilePreview
    };
    
    // Update player in context and localStorage
    updatePlayer(updatedPlayer);
    
    // Show success message
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Player Settings</h1>
          <p className="text-gray-600 mt-2">Manage your player profile information</p>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-2 rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Personal Information
                </h2>
                
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-green-400 shadow-lg"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-6xl text-white font-bold border-4 border-white shadow-xl">
                        {formData.name[0] || 'P'}
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full flex items-center text-sm font-bold shadow-lg cursor-pointer">
                      <FaUpload className="mr-2" />
                      Change
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfileUpload}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 mb-4">
                    JPG, PNG or GIF (Max 5MB)
                  </div>
                </div>
                
                {/* Personal Info Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Social Links</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="url"
                        placeholder="Facebook URL"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
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
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe your playing background, skills, and achievements..."
                  ></textarea>
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
                    <textarea
                      name="development"
                      value={formData.philosophy.development}
                      onChange={handlePhilosophyChange}
                      rows={3}
                      className="w-full text-sm p-2 bg-white rounded border border-green-200"
                    ></textarea>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="block text-sm font-medium text-blue-700 mb-2">Playing Style</label>
                    <textarea
                      name="tactical"
                      value={formData.philosophy.tactical}
                      onChange={handlePhilosophyChange}
                      rows={3}
                      className="w-full text-sm p-2 bg-white rounded border border-blue-200"
                    ></textarea>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <label className="block text-sm font-medium text-amber-700 mb-2">Mental Approach</label>
                    <textarea
                      name="mental"
                      value={formData.philosophy.mental}
                      onChange={handlePhilosophyChange}
                      rows={3}
                      className="w-full text-sm p-2 bg-white rounded border border-amber-200"
                    ></textarea>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <label className="block text-sm font-medium text-purple-700 mb-2">Team Values</label>
                    <textarea
                      name="culture"
                      value={formData.philosophy.culture}
                      onChange={handlePhilosophyChange}
                      rows={3}
                      className="w-full text-sm p-2 bg-white rounded border border-purple-200"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Experience */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Playing Experience
                </h2>
                
                {/* Experience List */}
                <div className="space-y-4 mb-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <FaUsers size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-lg text-gray-800">{exp.role}</h4>
                          <button 
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="text-green-600 font-medium">{exp.club}</div>
                        <div className="text-gray-500 text-sm">{exp.period}</div>
                        <p className="text-gray-700 mt-2 text-sm">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Experience Form */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position/Role</label>
                      <input
                        type="text"
                        name="role"
                        value={newExperience.role}
                        onChange={handleExperienceChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Midfielder"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Club/Team</label>
                      <input
                        type="text"
                        name="club"
                        value={newExperience.club}
                        onChange={handleExperienceChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Barcelona Youth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                      <input
                        type="text"
                        name="period"
                        value={newExperience.period}
                        onChange={handleExperienceChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="2022-2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Key achievements"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                  >
                    <FaPlus /> Add Experience
                  </button>
                </div>
              </div>
              
              {/* Certifications */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Certifications & Achievements
                </h2>
                
                {/* Certifications List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 group relative">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <FaTrophy size={16} />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <h4 className="font-bold text-gray-800">{cert.name}</h4>
                          <button 
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition absolute top-2 right-2"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                        <div className="text-gray-500 text-sm">{cert.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Certification Form */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Certification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newCertification.name}
                        onChange={handleCertificationChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="UEFA Youth Training"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Obtained</label>
                      <input
                        type="text"
                        name="year"
                        value={newCertification.year}
                        onChange={handleCertificationChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="2023"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                  >
                    <FaPlus /> Add Certification
                  </button>
                </div>
              </div>
              
              {/* Training Methodology */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Training Approach
                </h2>
                <div className="space-y-4">
                  {formData.methodology.map((method, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Training Method {index + 1}
                        </label>
                        <textarea
                          value={method}
                          onChange={(e) => handleMethodologyChange(index, e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Describe your training approach..."
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition"
                  >
                    <FaSave /> Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerSettings; 