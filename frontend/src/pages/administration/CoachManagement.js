import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEye, FiEyeOff, FiX, FiEdit, FiTrash2, FiUser, FiClipboard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import API from './api';

const CoachManagement = ({ coaches, setCoaches }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [editCoachId, setEditCoachId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state matches your CustomUser model
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    club: '',
    role: 'coach' // Default role as per your serializer
  });

  // Fetch coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);
      try {
        const response = await API.get('coaches/');
        setCoaches(response.data);
      } catch (error) {
        setError('Failed to fetch coaches');
        console.error('Error:', error.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoaches();
  }, [setCoaches]);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // API functions
  const addCoachAPI = async (coachData) => {
    try {
      const response = await API.post('coaches/', coachData);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response?.data);
      throw error;
    }
  };

  const updateCoachAPI = async (id, coachData) => {
    try {
      const payload = { ...coachData };
      // Don't send password if it's empty (not being changed)
      if (!payload.password) delete payload.password;
      
      const response = await API.put(`coaches/${id}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response?.data);
      throw error;
    }
  };

  const deleteCoachAPI = async (id) => {
    try {
      await API.delete(`coaches/${id}/`);
    } catch (error) {
      console.error('Error:', error.response?.data);
      throw error;
    }
  };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!editCoachId && passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password.');
      setIsLoading(false);
      return;
    }

    try {
      if (editCoachId) {
        const updatedCoach = await updateCoachAPI(editCoachId, formData);
        setCoaches(coaches.map(c => (c.id === editCoachId ? updatedCoach : c)));
      } else {
        const newCoach = await addCoachAPI(formData);
        setCoaches(prev => [...prev, newCoach]);
      }
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.error ||
        'Failed to save coach'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (coach) => {
    setFormData({
      username: coach.username,
      email: coach.email,
      password: '',
      phone: coach.phone || '',
      club: coach.club || '',
      role: coach.role || 'coach'
    });
    setEditCoachId(coach.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    setIsLoading(true);
    try {
      await deleteCoachAPI(id);
      setCoaches(coaches.filter(coach => coach.id !== id));
    } catch (err) {
      setError('Failed to delete coach');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      club: '',
      role: 'coach'
    });
    setPasswordStrength(0);
    setEditCoachId(null);
    setShowPassword(false);
    setError(null);
  };

  // UI helpers
  const filteredCoaches = coaches.filter(coach => {
    const username = coach.username ? coach.username.toLowerCase() : '';
    const email = coach.email ? coach.email.toLowerCase() : '';
    const club = coach.club ? coach.club.toLowerCase() : '';
    const searchTermLower = searchTerm.toLowerCase();

    return (
      username.includes(searchTermLower) ||
      email.includes(searchTermLower) ||
      club.includes(searchTermLower)
    );
  });

  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600'
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiClipboard className="text-blue-600" />
            Coaches Management
          </h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `${coaches.length} coach${coaches.length !== 1 ? 'es' : ''} registered`}
          </p>
        </div>
        
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
          disabled={isLoading}
        >
          <FiPlus className="text-lg" />
          Add Coach
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coaches..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Coaches Table */}
      {isLoading && !coaches.length ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoaches.map((coach) => (
                <tr key={coach.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                        <FiUser className="text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{coach.username}</div>
                        <div className="text-xs text-gray-500">{coach.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{coach.email}</div>
                    <div className="text-gray-400">{coach.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coach.club || 'No club'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(coach)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coach.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCoaches.length === 0 && (
            <div className="bg-white py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-full">
                  <FiUser className="text-blue-500 text-3xl" />
                </div>
              </div>
              <div className="text-gray-500 mb-2 text-lg font-medium">No coaches found</div>
              <button 
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FiPlus className="text-sm" />
                Add your first coach
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editCoachId ? 'Edit Coach' : 'Add New Coach'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                        disabled={!!editCoachId}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                        disabled={!!editCoachId}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password {!editCoachId && '*'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          required={!editCoachId}
                          placeholder={editCoachId ? 'Leave blank to keep current' : ''}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {!editCoachId && formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 h-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full ${
                                  i < passwordStrength ? strengthColors[i] : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {strengthLabels[passwordStrength - 1]}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Club</label>
                      <input
                        type="text"
                        name="club"
                        value={formData.club}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="coach">Coach</option>
                        <option value="head_coach">Head Coach</option>
                        <option value="assistant_coach">Assistant Coach</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center min-w-24"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        editCoachId ? 'Update Coach' : 'Add Coach'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachManagement;