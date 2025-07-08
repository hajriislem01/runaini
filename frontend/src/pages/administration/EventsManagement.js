import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiCalendar, FiMapPin, FiUsers, FiFilter, FiX, FiTarget } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EventsManagement = ({ events, addEvent, updateEvent, deleteEvent, groups }) => {
  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    group: '',
    date: '',
    searchTerm: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Update filtered events when events or filters change
  useEffect(() => {
    let filtered = [...events];
    
    if (filters.searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.group) {
      filtered = filtered.filter(event => 
        event.group === filters.group
      );
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }

    if (filters.type) {
      filtered = filtered.filter(event => event.type === filters.type);
    }
    
    // Sort by date (soonest first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      group: '',
      date: '',
      searchTerm: '',
      type: ''
    });
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getEventStatus = (event) => {
    if (event.status === 'completed') return 'Completed';
    if (event.winner) return 'Winner Selected';
    if (event.participants?.every(p => p.status === 'accepted')) return 'All Accepted';
    if (event.participants?.some(p => p.status === 'pending')) return 'Pending Approvals';
    return 'Open';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Winner Selected':
        return 'bg-purple-100 text-purple-800';
      case 'All Accepted':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Approvals':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredEvents.length} upcoming event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FiFilter />
            Filters
          </button>
          <button
            onClick={() => navigate('/administration/create-event')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus />
            Create Event
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="Match Friendly">Match Friendly</option>
                    <option value="Tournament">Tournament</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Filter by location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group
                  </label>
                  <select
                    name="group"
                    value={filters.group}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Groups</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <FiX size={18} />
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  event.type === 'Tournament' ? 'bg-purple-100 text-purple-800' :
                  event.type === 'Match Friendly' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.type}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="flex-shrink-0" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="flex-shrink-0" />
                  <span className="text-sm">{event.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUsers className="flex-shrink-0" />
                  <span className="text-sm">{event.group}</span>
                  {event.subgroup && (
                    <span className="text-sm text-gray-500">- {event.subgroup}</span>
                  )}
                </div>

                {event.targetAcademy && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiTarget className="flex-shrink-0" />
                    <span className="text-sm">Target: {event.targetAcademy}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getEventStatus(event))}`}>
                    {getEventStatus(event)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.participants?.length || 0} participant{event.participants?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/administration/event/${event.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Manage Event
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 mb-4">No events found</div>
            <button
              onClick={() => navigate('/administration/create-event')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto"
            >
              <FiPlus className="text-sm" />
              Create your first event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagement; 