import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiUsers, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useProfileContext } from '../../context/ProfileContext';

const Contact = () => {
  const { getStatesForCountry } = useProfileContext();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: '',
    searchQuery: ''
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - Replace with API call in production
  useEffect(() => {
    const sampleTeams = [
      {
        id: 1,
        name: 'Academy United',
        country: 'TN',
        state: 'Tunis',
        city: 'Tunis',
        status: 'Professional Academy',
        avatar: 'https://via.placeholder.com/150',
        contact: {
          email: 'contact@academyunited.com',
          phone: '+216 00 000 000',
          whatsapp: '+216 00 000 000',
          website: 'www.academyunited.com'
        },
        achievements: ['National Champions 2023', 'Regional Cup Winners 2022'],
        players: 45,
        coaches: 5
      },
      // Add more sample teams here
    ];

    setTeams(sampleTeams);
    setFilteredTeams(sampleTeams);
    setIsLoading(false);
  }, []);

  // Filter teams based on selected criteria
  useEffect(() => {
    let filtered = [...teams];

    if (filters.country) {
      filtered = filtered.filter(team => team.country === filters.country);
    }
    if (filters.state) {
      filtered = filtered.filter(team => team.state === filters.state);
    }
    if (filters.city) {
      filtered = filtered.filter(team => team.city === filters.city);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(team => 
        team.name.toLowerCase().includes(query) ||
        team.status.toLowerCase().includes(query)
      );
    }

    setFilteredTeams(filtered);
  }, [filters, teams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const TeamCard = ({ team }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => setSelectedTeam(team)}
    >
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={team.avatar}
            alt={team.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <FiMapPin className="text-blue-500" />
            <span>{`${team.city}, ${team.state}`}</span>
          </div>
          <p className="text-gray-500 mt-2">{team.status}</p>
        </div>
      </div>
    </motion.div>
  );

  const TeamModal = ({ team, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={team.avatar}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <FiMapPin className="text-blue-500" />
              <span>{`${team.city}, ${team.state}, ${team.country}`}</span>
            </div>
            <p className="text-gray-500 mt-2">{team.status}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FiMail className="text-blue-500" />
                <a href={`mailto:${team.contact.email}`} className="hover:text-blue-600">
                  {team.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiPhone className="text-blue-500" />
                <a href={`tel:${team.contact.phone}`} className="hover:text-blue-600">
                  {team.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaWhatsapp className="text-green-500" />
                <a href={`https://wa.me/${team.contact.whatsapp}`} className="hover:text-green-600">
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiGlobe className="text-blue-500" />
                <a href={`https://${team.contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {team.contact.website}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Team Statistics</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers className="text-blue-500" />
                <span>{team.players} Players</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers className="text-blue-500" />
                <span>{team.coaches} Coaches</span>
              </div>
            </div>
          </div>
        </div>

        {team.achievements && team.achievements.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
            <div className="space-y-2">
              {team.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Directory</h1>
          <p className="mt-2 text-gray-600">Find and connect with other teams in your area</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                <option value="TN">Tunisia</option>
                <option value="DZ">Algeria</option>
                <option value="MA">Morocco</option>
                {/* Add more countries */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
              <select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!filters.country}
              >
                <option value="">All States</option>
                {filters.country && getStatesForCountry(filters.country).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search academy..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        {/* Team Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <TeamModal
              team={selectedTeam}
              onClose={() => setSelectedTeam(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contact; 