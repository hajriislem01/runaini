import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiCalendar, FiPlus, FiX, FiClock, FiMapPin, FiUsers, 
  FiUserCheck, FiUserX, FiEdit, FiTrash2, FiChevronLeft, 
  FiChevronRight, FiFilter, FiCheck 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isSameMonth, eachDayOfInterval, 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths } from 'date-fns';

const AgendaManagement = ({ events, addEvent, updateEvent, deleteEvent, players, coaches }) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedSubgroups, setSelectedSubgroups] = useState([]);
  const [playerAbsences, setPlayerAbsences] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'training',
    subType: 'physique-A',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '12:00',
    location: '',
    description: '',
    assignedGroups: [],
    assignedSubgroups: [],
    coachId: '',
  });
  
  // Initialize absences
  useEffect(() => {
    const absences = {};
    events.forEach(event => {
      absences[event.id] = event.absences || [];
    });
    setPlayerAbsences(absences);
  }, [events]);
  
  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'type') {
      setEventForm(prev => {
        let newSubType = '';
        if (value === 'training') {
          newSubType = 'physique-A';
        } else if (value === 'match') {
          newSubType = eventTypes.match[0];
        } else {
          newSubType = eventTypes.meeting[0];
        }
        return { ...prev, subType: newSubType };
      });
    }
  };

  // Handle subtype change
  const handleSubTypeChange = (e) => {
    setEventForm(prev => ({ ...prev, subType: e.target.value }));
  };
  
  // Handle group toggle with subgroups
  const handleGroupToggle = (groupId) => {
    setEventForm(prev => {
      const newAssignedGroups = prev.assignedGroups.includes(groupId)
        ? prev.assignedGroups.filter(id => id !== groupId)
        : [...prev.assignedGroups, groupId];

      const group = groupsWithSubgroups.find(g => g.id === groupId);
      const newAssignedSubgroups = prev.assignedGroups.includes(groupId)
        ? prev.assignedSubgroups.filter(sub => !group.subgroups.includes(sub))
        : prev.assignedSubgroups;

      return {
        ...prev,
        assignedGroups: newAssignedGroups,
        assignedSubgroups: newAssignedSubgroups
      };
    });
  };
  
  // Handle subgroup toggle
  const handleSubgroupToggle = (subgroup) => {
    setEventForm(prev => ({
      ...prev,
      assignedSubgroups: prev.assignedSubgroups.includes(subgroup)
        ? prev.assignedSubgroups.filter(sub => sub !== subgroup)
        : [...prev.assignedSubgroups, subgroup]
    }));
  };
  
  // Handle absence toggle
  const handleAbsenceToggle = (eventId, playerId) => {
    setPlayerAbsences(prev => {
      const eventAbsences = prev[eventId] || [];
      const newAbsences = eventAbsences.includes(playerId)
        ? eventAbsences.filter(id => id !== playerId)
        : [...eventAbsences, playerId];
      
      return { ...prev, [eventId]: newAbsences };
    });
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateEventForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const newEvent = {
        ...eventForm,
        id: selectedEvent ? selectedEvent.id : Date.now().toString(),
        absences: playerAbsences[selectedEvent?.id] || []
      };

      if (selectedEvent) {
        await updateEvent(newEvent);
        addToast('Event updated successfully!');
      } else {
        await addEvent(newEvent);
        addToast('Event created successfully!');
      }

      resetForm();
    } catch (error) {
      addToast('Error saving event: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setEventForm({
      title: '',
      type: 'training',
      subType: 'physique-A',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '10:00',
      endTime: '12:00',
      location: '',
      description: '',
      assignedGroups: [],
      assignedSubgroups: [],
      coachId: '',
    });
    setSelectedEvent(null);
    setShowEventModal(false);
  };
  
  // Handle edit event
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventForm({
      ...event,
      assignedGroups: event.assignedGroups || [],
      assignedSubgroups: event.assignedSubgroups || []
    });
    setShowEventModal(true);
  };
  
  // Filter events based on selected groups and subgroups
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (!event) return false;
      if (selectedGroups.length === 0 && selectedSubgroups.length === 0) return true;
      
      const hasSelectedGroup = event.assignedGroups?.some(groupId => 
        selectedGroups.includes(groupId)
      );
      
      const hasSelectedSubgroup = event.assignedSubgroups?.some(subgroup => 
        selectedSubgroups.includes(subgroup)
      );

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
  }, [events, selectedGroups, selectedSubgroups]);
  
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
  
  // Create new event for selected day
  const createEventForDay = (date) => {
    setEventForm(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd')
    }));
    setSelectedEvent(null);
    setShowEventModal(true);
    setShowDayEventsModal(false);
  };

  // Handle delete confirmation
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete.id);
        addToast('Event deleted successfully!');
      } catch (error) {
        addToast('Error deleting event: ' + error.message, 'error');
      } finally {
        setShowDeleteConfirm(false);
        setEventToDelete(null);
      }
    }
  };

  // Validate event form
  const validateEventForm = () => {
    if (!eventForm.title?.trim()) {
      addToast('Please enter an event title', 'error');
      return false;
    }
    if (!eventForm.date) {
      addToast('Please select a date', 'error');
      return false;
    }
    if (!eventForm.startTime) {
      addToast('Please select a start time', 'error');
      return false;
    }
    if (!eventForm.endTime) {
      addToast('Please select an end time', 'error');
      return false;
    }
    if (!eventForm.coachId) {
      addToast('Please select a coach', 'error');
      return false;
    }
    if (eventForm.assignedGroups.length === 0 && eventForm.assignedSubgroups.length === 0) {
      addToast('Please select at least one group or subgroup', 'error');
      return false;
    }
    return true;
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
    const typeConfig = {
      training: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '⚽' },
      match: { color: 'bg-green-100 text-green-800 border-green-200', icon: '🏆' },
      meeting: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '👥' }
    };
    
    const config = typeConfig[event.type] || typeConfig.training;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg">
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl shadow-lg ${
                toast.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FiCheck className="flex-shrink-0" />
                <span>{toast.message}</span>
              </div>
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
            Agenda Management
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage training sessions and matches
          </p>
        </div>
        
        <button 
          onClick={() => {
            resetForm();
            setShowEventModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          <FiPlus className="text-lg" />
          <span className="hidden sm:inline">New Event</span>
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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
      <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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
      <div className="grid grid-cols-7 gap-1 mb-4">
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
            <div className="space-y-1 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1">
              {day.events.slice(0, 3).map(event => (
                <motion.div 
                  key={event.id} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2 rounded-lg truncate ${
                    event.type === 'training' ? 'bg-blue-50 border border-blue-100' : 
                    event.type === 'match' ? 'bg-green-50 border border-green-100' : 
                    'bg-purple-50 border border-purple-100'
                  }`}
                >
                  <div className="font-medium text-xs truncate">{event.title}</div>
                  <div className="text-[0.65rem] opacity-75 mt-1 flex items-center">
                    <FiClock className="mr-1" size={10} />
                    {event.startTime}
                  </div>
                </motion.div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-gray-500 pl-1 italic">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && (
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
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedEvent ? 'Edit Event' : 'Create Event'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={eventForm.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                      placeholder="Event name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={eventForm.date}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                      <select
                        name="type"
                        value={eventForm.type}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm bg-white"
                        required
                      >
                        <option value="training">Training</option>
                        <option value="match">Match</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Subtype selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {eventForm.type === 'training' ? 'Training Type' : 
                       eventForm.type === 'match' ? 'Match Type' : 
                       'Meeting Type'}
                    </label>
                    
                    {eventForm.type === 'training' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                          <select
                            value={eventForm.subType.split('-')[0]}
                            onChange={(e) => {
                              const newCategory = e.target.value;
                              const currentLevel = eventForm.subType.split('-')[1] || 'A';
                              setEventForm(prev => ({
                                ...prev, 
                                subType: `${newCategory}-${currentLevel}`
                              }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                          >
                            <option value="physique">Physique</option>
                            <option value="tactique">Tactique</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
                          <select
                            value={eventForm.subType.split('-')[1]}
                            onChange={(e) => {
                              const currentCategory = eventForm.subType.split('-')[0] || 'physique';
                              const newLevel = e.target.value;
                              setEventForm(prev => ({
                                ...prev, 
                                subType: `${currentCategory}-${newLevel}`
                              }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                          >
                            <option value="A">A (Beginner)</option>
                            <option value="B">B (Intermediate)</option>
                            <option value="C">C (Advanced)</option>
                            <option value="D">D (Elite)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={eventForm.subType}
                        onChange={handleSubTypeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                      >
                        {eventTypes[eventForm.type].map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={eventForm.location}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                      placeholder="Training field, stadium, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Coach *</label>
                    <select
                      name="coachId"
                      value={eventForm.coachId}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm bg-white"
                      required
                    >
                      <option value="">Select coach</option>
                      {coaches.map(coach => (
                        <option key={coach.id} value={coach.id}>
                          {coach.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Groups</label>
                    <div className="space-y-3">
                      {groupsWithSubgroups.map(group => (
                        <div key={group.id} className="space-y-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`group-${group.id}`}
                              checked={eventForm.assignedGroups.includes(group.id)}
                              onChange={() => handleGroupToggle(group.id)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label 
                              htmlFor={`group-${group.id}`}
                              className="font-medium text-gray-700"
                            >
                              {group.name}
                            </label>
                            {group.subgroups.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                                className="ml-auto text-gray-500 hover:text-gray-700"
                              >
                                <FiChevronRight 
                                  className={`transition-transform ${expandedGroup === group.id ? 'rotate-90' : ''}`}
                                />
                              </button>
                            )}
                          </div>

                          {expandedGroup === group.id && group.subgroups.length > 0 && (
                            <div className="ml-7 space-y-2">
                              {group.subgroups.map(subgroup => (
                                <div key={subgroup} className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    id={`subgroup-${subgroup}`}
                                    checked={eventForm.assignedSubgroups.includes(subgroup)}
                                    onChange={() => handleSubgroupToggle(subgroup)}
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <label 
                                    htmlFor={`subgroup-${subgroup}`}
                                    className="text-sm text-gray-600"
                                  >
                                    {subgroup}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={eventForm.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                      placeholder="Event details, objectives, special instructions..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-3">
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
                      {isSubmitting ? 'Saving...' : (selectedEvent ? 'Update' : 'Create')}
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
                
                <div className="space-y-4 mb-6">
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
                          <div className="flex flex-wrap justify-between items-start gap-3">
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
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  handleEditEvent(event);
                                  setShowDayEventsModal(false);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Edit event"
                              >
                                <FiEdit size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(event)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete event"
                              >
                                <FiTrash2 size={20} />
                              </button>
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
                            {event.assignedSubgroups?.map(subgroup => {
                              // Try to find subgroup name from the event data first
                              const subgroupName = event.subgroupName || subgroup;
                              return (
                                <span 
                                  key={subgroup} 
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
                
                <div className="flex justify-center">
                  <button
                    onClick={() => createEventForDay(selectedDay)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiPlus className="text-lg" />
                    Add Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Event</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setEventToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
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

export default AgendaManagement;