import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiCalendar, FiPlus, FiX, FiClock, FiMapPin, FiUsers, 
  FiUserCheck, FiUserX, FiEdit, FiTrash2, FiChevronLeft, 
  FiChevronRight, FiFilter, FiCheck 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isSameMonth, eachDayOfInterval, 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths } from 'date-fns';

const CoachAgenda = () => {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedSubgroups, setSelectedSubgroups] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  
  // Event types structure
  const eventTypes = {
    training: {
      physique: ['A', 'B', 'C', 'D'],
      tactique: ['A', 'B', 'C', 'D']
    },
    match: ['Friendly', 'League', 'Tournament'],
    meeting: ['General', 'Staff', 'Players']
  };
  
  // Add toast notification
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(toasts => [...toasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(toasts => toasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
      const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
      const storedGroups = JSON.parse(localStorage.getItem('playerGroups')) || [];
      
      setEvents(storedEvents);
      setPlayers(storedPlayers);
      setGroups(storedGroups);
    };

    loadData();
    // Listen for storage changes to sync data
    window.addEventListener('storage', loadData);
    window.addEventListener('focus', loadData);
    
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  // Derive groups and subgroups from players
  const groupsWithSubgroups = useMemo(() => {
    const groupsMap = new Map();
    
    players.forEach(player => {
      if (player.group) {
        if (!groupsMap.has(player.group)) {
          groupsMap.set(player.group, {
            id: player.group,
            name: player.group,
            color: `bg-${['blue','green','purple','red','yellow'][groupsMap.size % 5]}-500`,
            subgroups: new Set()
          });
        }
        
        if (player.subgroup) {
          const group = groupsMap.get(player.group);
          group.subgroups.add(player.subgroup);
        }
      }
    });

    return Array.from(groupsMap.values()).map(group => ({
      ...group,
      subgroups: Array.from(group.subgroups)
    }));
  }, [players]);
  
  // Event form state (for editing training sessions)
  const [eventForm, setEventForm] = useState({
    date: '',
    startTime: '10:00',
    endTime: '12:00',
    groups: [],
    subgroups: [],
    player: ''
  });
  
  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle group toggle in edit modal
  const handleGroupToggle = (groupId) => {
    setEventForm(prev => {
      const newGroups = prev.groups.includes(groupId)
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId];
      
      // Clear subgroups that don't belong to selected groups
      const availableSubgroups = groupsWithSubgroups
        .filter(g => newGroups.includes(g.id))
        .flatMap(g => g.subgroups);
      
      const newSubgroups = prev.subgroups.filter(sub => availableSubgroups.includes(sub));
      
      return {
        ...prev,
        groups: newGroups,
        subgroups: newSubgroups,
        player: '' // Reset player when groups change
      };
    });
  };

  // Handle subgroup toggle in edit modal
  const handleSubgroupToggle = (subgroup) => {
    setEventForm(prev => ({
      ...prev,
      subgroups: prev.subgroups.includes(subgroup)
        ? prev.subgroups.filter(id => id !== subgroup)
        : [...prev.subgroups, subgroup],
      player: '' // Reset player when subgroups change
    }));
  };

  // Get all available subgroups from selected groups
  const availableSubgroups = useMemo(() => {
    return groupsWithSubgroups
      .filter(g => eventForm.groups.includes(g.id))
      .flatMap(g => g.subgroups);
  }, [eventForm.groups, groupsWithSubgroups]);

  // Filter players by selected groups and subgroups
  const filteredPlayers = useMemo(() => {
    return eventForm.groups.length > 0 ? players.filter((p) => {
      const matchesGroup = eventForm.groups.includes(p.group);
      const matchesSubgroup = eventForm.subgroups.length === 0 || (p.subgroup && eventForm.subgroups.includes(p.subgroup));
      return matchesGroup && matchesSubgroup;
    }) : [];
  }, [eventForm.groups, eventForm.subgroups, players]);
  
  // Handle form submit (update training session)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that at least one group is selected
      if (eventForm.groups.length === 0) {
        addToast('Please select at least one group for the training session.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Validate date - prevent past dates
      const selectedDate = new Date(eventForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate < today) {
        addToast('Cannot edit training sessions to past dates. Please select today or a future date.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Validate time - if date is today, prevent past times
      if (selectedDate.getTime() === today.getTime()) {
        const currentTime = new Date();
        const selectedStartTime = new Date(`${eventForm.date}T${eventForm.startTime}`);
        
        if (selectedStartTime < currentTime) {
          addToast('Cannot edit training sessions with past times for today. Please select a future time.', 'error');
          setIsSubmitting(false);
          return;
        }
      }

      // Get group and subgroup names for display
      const getGroupName = (groupId) => {
        const group = groupsWithSubgroups.find(g => g.id === groupId);
        return group ? group.name : groupId;
      };

      const getSubgroupName = (subgroupId) => {
        return subgroupId;
      };

      const getPlayerName = (playerId) => {
        const player = players.find(p => p.id === playerId);
        return player ? player.name : playerId;
      };

      const updatedEvent = {
        ...selectedEvent,
        date: eventForm.date,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        assignedGroups: eventForm.groups,
        assignedSubgroups: eventForm.subgroups,
        playerId: eventForm.player,
        groupName: eventForm.groups.map(getGroupName).join(', '),
        subgroupName: eventForm.subgroups.length > 0 ? eventForm.subgroups.map(getSubgroupName).join(', ') : null,
        playerName: eventForm.player ? getPlayerName(eventForm.player) : null
      };

      // Update the event in localStorage
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      );
      
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      // Trigger storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'events',
        newValue: JSON.stringify(updatedEvents)
      }));
      
      addToast('Training session updated successfully!');
      resetForm();
    } catch (error) {
      addToast('Error updating event: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setEventForm({
      date: '',
      startTime: '10:00',
      endTime: '12:00',
      groups: [],
      subgroups: [],
      player: ''
    });
    setSelectedEvent(null);
    setShowEventModal(false);
  };
  
  // Handle edit event (only for coach-created training sessions)
  const handleEditEvent = (event) => {
    if (event.type !== 'training') {
      addToast('You can only edit training sessions', 'error');
      return;
    }
    
    // Check if the event was created by a coach
    if (event.createdBy !== 'coach') {
      addToast('You can only edit training sessions that you created', 'error');
      return;
    }
    
    // Check if the event date has passed
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      addToast('Cannot edit training sessions that have already passed', 'error');
      return;
    }
    
    setSelectedEvent(event);
    setEventForm({
      date: event.date || '',
      startTime: event.startTime || '10:00',
      endTime: event.endTime || '12:00',
      groups: event.assignedGroups || [],
      subgroups: event.assignedSubgroups || [],
      player: event.playerName || ''
    });
    setShowEventModal(true);
  };
  
  // Handle delete event (only for coach-created training sessions)
  const handleDeleteEvent = (event) => {
    if (event.type !== 'training') {
      addToast('You can only delete training sessions', 'error');
      return;
    }
    
    // Check if the event was created by a coach
    if (event.createdBy !== 'coach') {
      addToast('You can only delete training sessions that you created', 'error');
      return;
    }
    
    // Check if the event date has passed
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      addToast('Cannot delete training sessions that have already passed', 'error');
      return;
    }
    
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };
  
  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        // Remove the event from localStorage
        const updatedEvents = events.filter(event => event.id !== eventToDelete.id);
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        
        // Trigger storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'events',
          newValue: JSON.stringify(updatedEvents)
        }));
        
        addToast('Training session deleted successfully!');
      } catch (error) {
        addToast('Error deleting training session: ' + error.message, 'error');
      } finally {
        setShowDeleteConfirm(false);
        setEventToDelete(null);
      }
    }
  };
  
  // Filter events based on selected groups and subgroups
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (!event) return false;
      if (selectedGroups.length === 0 && selectedSubgroups.length === 0) return true;
      
      // Check for group matches - try multiple field names for compatibility
      const hasSelectedGroup = selectedGroups.some(selectedGroupId => {
        // Check assignedGroups array
        if (event.assignedGroups?.some(groupId => groupId === selectedGroupId)) {
          return true;
        }
        // Check groupId field (for coach-created events)
        if (event.groupId === selectedGroupId) {
          return true;
        }
        // Check groupName field (for coach-created events)
        const selectedGroup = groupsWithSubgroups.find(g => g.id === selectedGroupId);
        if (selectedGroup && event.groupName === selectedGroup.name) {
          return true;
        }
        return false;
      });
      
      // Check for subgroup matches - try multiple field names for compatibility
      const hasSelectedSubgroup = selectedSubgroups.some(selectedSubgroup => {
        // Check assignedSubgroups array
        if (event.assignedSubgroups?.some(subgroup => subgroup === selectedSubgroup)) {
          return true;
        }
        // Check subgroupId field (for coach-created events)
        if (event.subgroupId === selectedSubgroup) {
          return true;
        }
        // Check subgroupName field (for coach-created events)
        if (event.subgroupName === selectedSubgroup) {
          return true;
        }
        return false;
      });

      // New logic: If both groups and subgroups are selected, event must match BOTH
      // If only groups are selected, event must match group
      // If only subgroups are selected, event must match subgroup
      if (selectedGroups.length > 0 && selectedSubgroups.length > 0) {
        // Both group and subgroup selected - must match BOTH
        return hasSelectedGroup && hasSelectedSubgroup;
      } else if (selectedGroups.length > 0) {
        // Only group selected - must match group
        return hasSelectedGroup;
      } else if (selectedSubgroups.length > 0) {
        // Only subgroup selected - must match subgroup
        return hasSelectedSubgroup;
      } else {
        return true;
      }
    });
  }, [events, selectedGroups, selectedSubgroups, groupsWithSubgroups]);
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const dayEvents = filteredEvents.filter(event => event.date === dateString);
      
      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        events: dayEvents
      };
    });
  }, [currentDate, filteredEvents]);
  
  // Handle day click
  const handleDayClick = (date) => {
    setSelectedDay(date);
    setShowDayEventsModal(true);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedGroups([]);
    setSelectedSubgroups([]);
    setExpandedGroup(null);
    addToast('Filters cleared');
  };

  // Render event type badge
  const renderEventTypeBadge = (event) => {
    const typeColors = {
      training: 'bg-blue-100 text-blue-800',
      match: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
        {event.type?.charAt(0).toUpperCase() + event.type?.slice(1)}
        {event.subType && ` - ${event.subType}`}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
                toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCalendar className="text-blue-700 text-xl" />
            </div>
            Coach Agenda
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage training sessions and events
          </p>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            Filter Events
          </h2>
          
          {(selectedGroups.length > 0 || selectedSubgroups.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Clear filters
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Groups Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Groups</h3>
            <div className="flex flex-wrap gap-2">
              {groupsWithSubgroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => {
                    setExpandedGroup(expandedGroup === group.id ? null : group.id);
                    setSelectedGroups(prev => 
                      prev.includes(group.id) 
                        ? prev.filter(id => id !== group.id) 
                        : [...prev, group.id]
                    );
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    selectedGroups.includes(group.id)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {group.name}
                  {group.subgroups.length > 0 && (
                    <FiChevronRight 
                      className={`transition-transform ${expandedGroup === group.id ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Subgroups Section */}
          {expandedGroup && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Subgroups</h3>
              <div className="flex flex-wrap gap-2">
                {groupsWithSubgroups
                  .find(g => g.id === expandedGroup)
                  ?.subgroups.map(subgroup => (
                    <button
                      key={subgroup}
                      onClick={() => setSelectedSubgroups(prev => 
                        prev.includes(subgroup) 
                          ? prev.filter(s => s !== subgroup) 
                          : [...prev, subgroup]
                      )}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        selectedSubgroups.includes(subgroup)
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {subgroup}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, -1))}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              Today
            </button>
          </div>
          
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day} 
              className="text-center font-medium text-gray-500 py-2 text-sm"
            >
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => (
            <motion.div 
              key={index} 
              whileHover={{ scale: 1.02 }}
              className={`min-h-24 border border-gray-200 p-2 rounded-lg cursor-pointer transition-all ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${
                isToday(day.date) ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
              onClick={() => handleDayClick(day.date)}
            >
              <div className={`text-right text-sm font-medium p-1 ${
                isToday(day.date) ? 'text-blue-600 font-bold' : ''
              }`}>
                {format(day.date, 'd')}
              </div>
              
              <div className="space-y-1">
                {day.events.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate flex items-center gap-1 ${
                      event.type === 'training' ? 
                        (event.createdBy === 'coach' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600') :
                      event.type === 'match' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}
                  >
                    <span className="truncate">{event.title}</span>
                    {event.type === 'training' && event.createdBy !== 'coach' && (
                      <span className="text-xs text-gray-500">(Admin)</span>
                    )}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Event Modal (Time Only) */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    Edit Training Session
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Location: {selectedEvent.location || 'Main Field'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                      <input
                        type="time"
                        name="startTime"
                        value={eventForm.startTime}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                      <input
                        type="time"
                        name="endTime"
                        value={eventForm.endTime}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Groups Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Groups *</label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {groupsWithSubgroups.map((group) => (
                          <label
                            key={group.id}
                            className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={eventForm.groups.includes(group.id)}
                              onChange={() => handleGroupToggle(group.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{group.name}</span>
                          </label>
                        ))}
                      </div>
                      {eventForm.groups.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">Please select at least one group</p>
                      )}
                    </div>
                  </div>

                  {/* Subgroups Selection */}
                  {eventForm.groups.length > 0 && availableSubgroups.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subgroups (Optional)</label>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableSubgroups.map((subgroup) => (
                            <label
                              key={subgroup}
                              className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={eventForm.subgroups.includes(subgroup)}
                                onChange={() => handleSubgroupToggle(subgroup)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm font-medium text-gray-700">{subgroup}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Select specific subgroups or leave empty for all subgroups</p>
                      </div>
                    </div>
                  )}

                  {/* Player Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Player (Optional)</label>
                    <select
                      name="player"
                      value={eventForm.player}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                      disabled={eventForm.groups.length === 0}
                    >
                      <option value="">Select player (optional)</option>
                      {filteredPlayers.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {eventForm.groups.length > 0 && filteredPlayers.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">No players found for the selected groups and subgroups</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md ${
                        isSubmitting 
                          ? 'opacity-70 cursor-not-allowed' 
                          : 'hover:from-blue-700 hover:to-indigo-700 transition-all'
                      }`}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Training'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day Events Modal */}
      <AnimatePresence>
        {showDayEventsModal && selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDayEventsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiCalendar className="text-blue-700 text-xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {format(selectedDay, 'EEEE, MMMM d, yyyy')}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowDayEventsModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {calendarDays
                    .find(d => d.date.getTime() === selectedDay.getTime())
                    ?.events?.map(event => (
                      <motion.div 
                        key={event.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className={`p-5 ${
                          event.type === 'training' ? 'bg-blue-50 border-l-4 border-blue-500' : 
                          event.type === 'match' ? 'bg-green-50 border-l-4 border-green-500' : 
                          'bg-purple-50 border-l-4 border-purple-500'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-800">
                                  {event.title}
                                </h3>
                                {renderEventTypeBadge(event)}
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FiClock className="text-gray-500 flex-shrink-0" />
                                  <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                                  <span>{event.location || 'Main Field'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {event.type === 'training' && event.createdBy === 'coach' && (
                                <>
                                  {/* Check if event date has passed */}
                                  {(() => {
                                    const eventDate = new Date(event.date);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const isPastEvent = eventDate < today;
                                    
                                    return (
                                      <>
                                        {!isPastEvent && (
                                          <button
                                            onClick={() => {
                                              handleEditEvent(event);
                                              setShowDayEventsModal(false);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                                            title="Edit training time"
                                          >
                                            <FiEdit size={20} />
                                          </button>
                                        )}
                                        {!isPastEvent && (
                                          <button
                                            onClick={() => {
                                              handleDeleteEvent(event);
                                              setShowDayEventsModal(false);
                                            }}
                                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Delete training"
                                          >
                                            <FiTrash2 size={20} />
                                          </button>
                                        )}
                                        {isPastEvent && (
                                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                            Completed
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </>
                              )}
                              
                              {event.type === 'training' && event.createdBy !== 'coach' && (
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                  Admin Event
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {/* Display Groups */}
                            {event.assignedGroups?.map(groupId => {
                              const group = groupsWithSubgroups.find(g => g.id === groupId);
                              return group ? (
                                <span 
                                  key={groupId} 
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-2 ${group.color} text-white shadow-sm`}
                                >
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                  {group.name}
                                </span>
                              ) : null;
                            })}
                            
                            {/* Display Subgroups */}
                            {event.assignedSubgroups?.map(subgroupId => {
                              // Try to find subgroup name from the event data first
                              const subgroupName = event.subgroupName || subgroupId;
                              return (
                                <span 
                                  key={subgroupId} 
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-2 bg-purple-500 text-white shadow-sm"
                                >
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                  {subgroupName}
                                </span>
                              );
                            })}
                            
                            {/* Display Player if specified */}
                            {event.playerName && (
                              <span 
                                className="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-2 bg-orange-500 text-white shadow-sm"
                              >
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                {event.playerName}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                  
                  {calendarDays.find(d => d.date.getTime() === selectedDay.getTime())?.events?.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl"
                    >
                      <FiCalendar className="mx-auto text-3xl text-gray-400 mb-3" />
                      <p className="text-lg">No events scheduled for this day</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && eventToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FiTrash2 className="text-red-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Delete Training Session
                  </h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the training session "<strong>{eventToDelete.title}</strong>"?
                  This action cannot be undone.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setEventToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachAgenda; 