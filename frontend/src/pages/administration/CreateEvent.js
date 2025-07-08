import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = ({ groups, addEvent }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matchFriendly');
  const [formData, setFormData] = useState({
    eventName: '',
    group: '',
    subgroup: '',
    date: '',
    time: '',
    location: '',
    // Add tournament-specific fields here if needed
    numParticipants: '', // for tournaments
    targetAcademy: '' // for friendly matches
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset subgroup when group changes
    setFormData(prev => ({ ...prev, subgroup: '' }));
  }, [formData.group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event Name is required';
    if (!formData.group) newErrors.group = 'Group is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (activeTab === 'tournament' && (!formData.numParticipants || formData.numParticipants < 2)) {
      newErrors.numParticipants = 'Number of participants must be at least 2 for a tournament';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: formData.eventName,
      type: activeTab === 'matchFriendly' ? 'Match Friendly' : 'Tournament',
      group: formData.group,
      subgroup: formData.subgroup || null,
      date: `${formData.date}T${formData.time}:00`, // Combine date and time
      location: formData.location,
      description: '', // You might want to add a description field
      creator: 'Academy A', // Placeholder for current user
      status: 'open',
      participants: [],
      createdAt: new Date().toISOString(),
      ...(activeTab === 'tournament' && { 
        maxParticipants: parseInt(formData.numParticipants, 10),
        tournamentStatus: 'pending'
      }),
      ...(activeTab === 'matchFriendly' && { 
        targetAcademy: formData.targetAcademy || null,
        matchStatus: 'scheduled'
      })
    };
    
    addEvent(newEvent); // Call addEvent from props
    navigate('/administration/events-management');
  };

  const getSubgroupsForGroup = (groupName) => {
    const selectedGroup = groups.find(g => g.name === groupName);
    return selectedGroup ? selectedGroup.subgroups : [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Event or Tournament</h1>
        <p className="text-gray-600 mt-1">Choose the type of event you want to create</p>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Event Section */}
        <div className={`w-1/2 p-8 transition-all duration-300 ${activeTab === 'matchFriendly' ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-xl mx-auto">
            <button
              className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-colors mb-8 ${
                activeTab === 'matchFriendly' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('matchFriendly')}
            >
              Create Match Friendly
            </button>

            {activeTab === 'matchFriendly' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    className={`w-full px-4 py-2 border ${errors.eventName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
                </div>

                {/* Group */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Group
                  </label>
                  <div className="relative">
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.group ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">Select group</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.name}>{group.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    {errors.group && <p className="text-red-500 text-sm mt-1">{errors.group}</p>}
                  </div>
                </div>

                {/* Subgroup */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Subgroup
                  </label>
                  <div className="relative">
                    <select
                      name="subgroup"
                      value={formData.subgroup}
                      onChange={handleChange}
                      disabled={!formData.group}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subgroup</option>
                      {getSubgroupsForGroup(formData.group).map(subgroup => (
                        <option key={subgroup.id} value={subgroup.name}>{subgroup.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Target Academy */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Target Academy (Optional)
                  </label>
                  <input
                    type="text"
                    name="targetAcademy"
                    value={formData.targetAcademy}
                    onChange={handleChange}
                    placeholder="Enter target academy name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className={`w-full px-4 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Create Match Friendly
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Tournament Section */}
        <div className={`w-1/2 p-8 transition-all duration-300 ${activeTab === 'tournament' ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-xl mx-auto">
            <button
              className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-colors mb-8 ${
                activeTab === 'tournament' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('tournament')}
            >
              Create Tournament
            </button>

            {activeTab === 'tournament' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tournament Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter tournament name"
                    className={`w-full px-4 py-2 border ${errors.eventName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
                </div>

                {/* Group */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Group
                  </label>
                  <div className="relative">
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.group ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">Select group</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.name}>{group.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    {errors.group && <p className="text-red-500 text-sm mt-1">{errors.group}</p>}
                  </div>
                </div>

                {/* Subgroup */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Subgroup
                  </label>
                  <div className="relative">
                    <select
                      name="subgroup"
                      value={formData.subgroup}
                      onChange={handleChange}
                      disabled={!formData.group}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subgroup</option>
                      {getSubgroupsForGroup(formData.group).map(subgroup => (
                        <option key={subgroup.id} value={subgroup.name}>{subgroup.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Number of Participants */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    name="numParticipants"
                    value={formData.numParticipants}
                    onChange={handleChange}
                    min="2"
                    placeholder="Enter number of participants"
                    className={`w-full px-4 py-2 border ${errors.numParticipants ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.numParticipants && <p className="text-red-500 text-sm mt-1">{errors.numParticipants}</p>}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className={`w-full px-4 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Create Tournament
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 