import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEye, FiEyeOff, FiX, FiEdit, FiTrash2, FiUser, FiCheck, FiUsers, FiChevronRight, FiUserPlus, FiMail, FiPhone, FiMapPin, FiCalendar, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import API from './api';
import axios from 'axios';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [editPlayerId, setEditPlayerId] = useState(null);
  const [errors, setErrors] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({
    id: '',
    name: '',
    subgroups: ['']
  });
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedSubgroup, setExpandedSubgroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state adapted to your backend model
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    status: 'Active',
    group: '',
    subgroup: '',
    height: '',
    weight: '',
    address: '',
    notes: ''
  });

  // API configuration
  // localStorage.setItem('authToken', '3813b5a28edda9181637e2931875742154d4cf8e');
  const API_URL = 'http://localhost:8000/api'; // Change to your Django server URL
  const authToken = localStorage.getItem('token'); // Assuming you use token auth

  // Fetch players from API
  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/players/`, {
  headers: { 'Authorization': `Token ${authToken}` }
});
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
      addNotification('Failed to fetch players', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups from API (if you have a groups endpoint)
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`, {
        headers: {
          'Authorization': `Token ${authToken}`
        }
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      addNotification('Failed to fetch groups', 'error');
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchGroups();
  }, []);

  // Add notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!editPlayerId && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.height && (formData.height < 100 || formData.height > 250)) {
      newErrors.height = 'Height must be between 100-250 cm';
    }

    if (formData.weight && (formData.weight < 30 || formData.weight > 200)) {
      newErrors.weight = 'Weight must be between 30-200 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let response;
      if (editPlayerId) {
        response = await API.put(`players/${editPlayerId}/`, formData);
        setPlayers(players.map(p => p.id === editPlayerId ? response.data : p));
        addNotification('Player updated successfully');
      } else {
        console.log('Sending to:', 'players/signup/');
        console.log('Payload:', formData);

        response = await API.post('players/signup/', formData);
        console.log('Signup response:', response.data);

        setPlayers([...players, response.data]);
        addNotification('Player added successfully');
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving player:', error);
      console.log('Error response:', error.response?.data);
      addNotification('Failed to save player', 'error');
    }
  };

  // Handle player edit
  const handleEdit = (player) => {
    setEditPlayerId(player.id);
    setFormData({
      username : player.username , 
      full_name: player.full_name,
      email: player.user.email, // Assuming your API returns user data nested
      password: '', // Don't populate password
      phone: player.phone || '',
      position: player.position || '',
      status: player.status || 'Active',
      group: player.group || '',
      subgroup: player.subgroup || '',
      height: player.height || '',
      weight: player.weight || '',
      address: player.address || '',
      notes: player.notes || ''
    });
    setShowModal(true);
  };

  // Handle player deletion
  const handleDelete = async (id) => {
    try {
      const playerName = players.find(p => p.id === id)?.full_name || 'Player';

      if (window.confirm(`Are you sure you want to delete ${playerName}?`)) {
        await axios.delete(`${API_URL}/players/${id}/`, {
          headers: {
            'Authorization': `Token ${authToken}`
          }
        });
        setPlayers(players.filter(player => player.id !== id));
        addNotification(`${playerName} deleted successfully`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      addNotification('Failed to delete player', 'error');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username : "" ,
      full_name: '',
      email: '',
      password: '',
      phone: '',
      position: '',
      status: 'Active',
      group: '',
      subgroup: '',
      height: '',
      weight: '',
      address: '',
      notes: ''
    });
    setPasswordStrength(0);
    setEditPlayerId(null);
    setShowPassword(false);
    setErrors({});
  };

  // Filter players
  const filteredPlayers = players.filter(player => {
    const matchesSearch = (
      player.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesGroup = !selectedGroup || player.group === selectedGroup;
    const matchesSubgroup = !selectedSubgroup || player.subgroup === selectedSubgroup;

    return matchesSearch && matchesGroup && matchesSubgroup;
  });

  // Password strength indicators
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs w-full">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-4 rounded-lg shadow-lg ${
                notification.type === 'success'
                  ? 'bg-green-100 border border-green-300 text-green-800'
                  : 'bg-red-100 border border-red-300 text-red-800'
              }`}
            >
              <div className="flex items-start">
                <FiCheck className={`flex-shrink-0 mt-0.5 mr-2 ${
                  notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`} />
                <div>{notification.message}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Players</h1>
          <p className="text-gray-600 mt-1">
            {players.length} player{players.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus />
            Add Player
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length > 0 ? filteredPlayers.map((player) => (
              <tr key={`${player.id}-${player.user?.id || 'nouser'}`} className="hover:bg-gray-50">


                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{player.full_name}</div>
                      <div className="text-xs text-gray-500">{player.group || 'No group'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  <div>{player.user?.email}</div>
                  <div className="text-gray-400">{player.phone || 'No phone'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.position || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {player.height && player.weight ? (
                    <div>{player.height} cm / {player.weight} kg</div>
                  ) : (
                    <div className="text-gray-400">No details</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    player.status === 'Active' ? 'bg-green-100 text-green-800' :
                    player.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {player.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                      title="Edit player"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors"
                      title="Delete player"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-gray-500 mb-2">No players found</div>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FiPlus className="text-sm" />
                    Add your first player
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Player Modal */}
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
                    {editPlayerId ? 'Edit Player' : 'Add New Player'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        required
                      />
                      {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        required
                      />
                      {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        required
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password {!editPlayerId && '*'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                          required={!editPlayerId}
                          placeholder={editPlayerId ? "Leave blank to keep current" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                      {!editPlayerId && formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 h-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full ${i < passwordStrength ? strengthColors[i] : 'bg-gray-200'}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter password'}
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
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      >
                        <option value="">Select position</option>
                        <option value="Midfielder">Midfielder</option>
                        <option value="Defender">Defender</option>
                        <option value="Forward">Forward</option>
                        <option value="Goalkeeper">Goalkeeper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
                      <input
                        type="text"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Team name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        min="100"
                        max="250"
                        placeholder="160-200"
                      />
                      {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        min="30"
                        max="200"
                        placeholder="50-100"
                      />
                      {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Injured">Injured</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editPlayerId ? 'Save Changes' : 'Add Player'}
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

export default PlayerManagement;