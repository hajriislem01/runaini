import React, { useState, useEffect, useMemo } from 'react';

const CreateTraining = () => {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    groups: [],
    subgroups: [],
    player: '',
    description: '',
    date: '',
    startTime: '10:00',
    endTime: '12:00',
    category: 'physique',
    level: 'A',
    location: ''
  });

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(storedPlayers);
  }, []);

  // Derive groups and subgroups from players data (same logic as Coach Agenda)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle group toggle
  const handleGroupToggle = (groupId) => {
    setForm(prev => {
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

  // Handle subgroup toggle
  const handleSubgroupToggle = (subgroupId) => {
    setForm(prev => ({
      ...prev,
      subgroups: prev.subgroups.includes(subgroupId)
        ? prev.subgroups.filter(id => id !== subgroupId)
        : [...prev.subgroups, subgroupId],
      player: '' // Reset player when subgroups change
    }));
  };

  // Get all available subgroups from selected groups
  const availableSubgroups = useMemo(() => {
    return groupsWithSubgroups
      .filter(g => form.groups.includes(g.id))
      .flatMap(g => g.subgroups);
  }, [form.groups, groupsWithSubgroups]);

  // Filter players by selected groups and subgroups
  const filteredPlayers = form.groups.length > 0 ? players.filter((p) => {
    const matchesGroup = form.groups.includes(p.group);
    const matchesSubgroup = form.subgroups.length === 0 || (p.subgroup && form.subgroups.includes(p.subgroup));
    return matchesGroup && matchesSubgroup;
  }) : [];

  // Get group name for display
  const getGroupName = (groupId) => {
    const group = groupsWithSubgroups.find(g => g.id === groupId);
    return group ? group.name : groupId;
  };

  // Get subgroup name for display
  const getSubgroupName = (subgroupId) => {
    return subgroupId; // Subgroups are already strings from the Set
  };

  // Get player name for display
  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : playerId;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that at least one group is selected
    if (form.groups.length === 0) {
      alert('Please select at least one group for the training session.');
      return;
    }
    
    // Validate date - prevent past dates
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (selectedDate < today) {
      alert('Cannot create training sessions for past dates. Please select today or a future date.');
      return;
    }
    
    // Validate time - if date is today, prevent past times
    if (selectedDate.getTime() === today.getTime()) {
      const currentTime = new Date();
      const selectedStartTime = new Date(`${form.date}T${form.startTime}`);
      
      if (selectedStartTime < currentTime) {
        alert('Cannot create training sessions with past times for today. Please select a future time.');
        return;
      }
    }
    
    // Create a new training event
    const newTrainingEvent = {
      id: Date.now().toString(),
      title: form.name,
      type: 'training',
      subType: `${form.category}-${form.level}`,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location || 'Main Field',
      description: form.description,
      assignedGroups: form.groups,
      assignedSubgroups: form.subgroups,
      coachId: 'coach-1', // Default coach ID
      createdBy: 'coach', // Mark as created by coach
      playerId: form.player,
      groupName: form.groups.map(getGroupName).join(', '),
      subgroupName: form.subgroups.map(getSubgroupName).join(', '),
      playerName: form.player ? getPlayerName(form.player) : null
    };

    // Get existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
    
    // Add the new training event
    const updatedEvents = [...existingEvents, newTrainingEvent];
    
    // Save to localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    
    // Trigger storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'events',
      newValue: JSON.stringify(updatedEvents)
    }));
    
    // Reset form
    setForm({
      name: '',
      groups: [],
      subgroups: [],
      player: '',
      description: '',
      date: '',
      startTime: '10:00',
      endTime: '12:00',
      category: 'physique',
      level: 'A',
      location: ''
    });
    
    alert(`Training created and added to agenda!\nName: ${form.name}\nDate: ${form.date}\nTime: ${form.startTime} - ${form.endTime}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full bg-white">
        <div className="max-w-6xl mx-auto p-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400 mb-6">
            <span className="text-blue-500 font-medium">Training</span> / <span className="text-gray-500">Create Training</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Training</h1>
          <p className="text-gray-500 mb-8">Create a new training session for your players</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Training Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter training name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  required
                >
                  <option value="physique">Physique</option>
                  <option value="tactique">Tactique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  required
                >
                  <option value="A">A (Beginner)</option>
                  <option value="B">B (Intermediate)</option>
                  <option value="C">C (Advanced)</option>
                  <option value="D">D (Elite)</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Training field, stadium, etc."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Groups</label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {groupsWithSubgroups.map((group) => (
                    <label
                      key={group.id}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={form.groups.includes(group.id)}
                        onChange={() => handleGroupToggle(group.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{group.name}</span>
                    </label>
                  ))}
                </div>
                {form.groups.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">Please select at least one group</p>
                )}
              </div>
            </div>
            
            {/* Subgroups Field */}
            {form.groups.length > 0 && availableSubgroups.length > 0 && (
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
                          checked={form.subgroups.includes(subgroup)}
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
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Player (Optional)</label>
              <select
                name="player"
                value={form.player}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                disabled={form.groups.length === 0}
              >
                <option value="">Select player (optional)</option>
                {filteredPlayers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {form.groups.length > 0 && filteredPlayers.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No players found for the selected groups and subgroups</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter training description"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 min-h-[100px]"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Exercises</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium mb-2">No exercises added yet</p>
                <p className="text-gray-400 mb-4">Add exercises to this training session</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium shadow-sm hover:bg-gray-200 transition"
                  disabled
                >
                  Add Exercise
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition"
              >
                Create Training
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTraining; 