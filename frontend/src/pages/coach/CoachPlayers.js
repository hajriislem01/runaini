import React, { useState, useEffect } from 'react';
import { FaChartLine, FaHistory, FaMagic } from 'react-icons/fa';

const positionMetrics = {
  Midfielder: [
    { key: 'assists', label: 'Assists' },
    { key: 'successfulPasses', label: 'Successful Passes' },
    { key: 'keyPasses', label: 'Key Passes' },
    { key: 'interceptions', label: 'Interceptions' },
    { key: 'tackles', label: 'Tackles' },
    { key: 'goals', label: 'Goals' },
  ],
  Defender: [
    { key: 'clearances', label: 'Clearances' },
    { key: 'blocks', label: 'Blocks' },
    { key: 'interceptions', label: 'Interceptions' },
    { key: 'duelsWon', label: 'Duels Won' },
    { key: 'marking', label: 'Marking Effectiveness' },
  ],
  Forward: [
    { key: 'goals', label: 'Goals Scored' },
    { key: 'shotsOnTarget', label: 'Shots on Target' },
    { key: 'dribbles', label: 'Dribbles Completed' },
    { key: 'assists', label: 'Assists' },
    { key: 'offTheBall', label: 'Off-the-ball Movements' },
  ],
  Goalkeeper: [
    { key: 'saves', label: 'Saves' },
    { key: 'cleanSheets', label: 'Clean Sheets' },
    { key: 'distribution', label: 'Distribution Accuracy' },
    { key: 'command', label: 'Command of Area' },
  ],
};

const CoachPlayers = () => {
  // Fetch players and groups from localStorage
  const [players, setPlayers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [search, setSearch] = useState('');
  const [showPerfModal, setShowPerfModal] = useState(false);
  const [perfPlayer, setPerfPlayer] = useState(null);
  const [perfData, setPerfData] = useState({});
  const [showPerfHistory, setShowPerfHistory] = useState(false);
  const [historyPlayer, setHistoryPlayer] = useState(null);
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [newPlayerData, setNewPlayerData] = useState({
    selectedGroup: '',
    selectedPlayer: '',
    // Initialize all metrics to empty strings
    ...Object.values(positionMetrics).flat().reduce((acc, metric) => {
      acc[metric.key] = '';
      return acc;
    }, {})
  });

  // Always fetch latest data from localStorage when page is shown or window regains focus
  const fetchData = () => {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const storedGroups = JSON.parse(localStorage.getItem('playerGroups')) || [];
    setPlayers(storedPlayers);
    setGroups(storedGroups);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  }, []);

  // Filter players by group and search
  const filteredPlayers = (players || []).filter(p =>
    (!selectedGroup || p.group === selectedGroup) &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) || p.position?.toLowerCase().includes(search.toLowerCase()))
  );

  // Get players for selected group in prediction modal
  const getPlayersForGroup = (groupId) => {
    if (!groupId) return [];
    const group = groups.find(g => g.id === groupId);
    return group ? (players || []).filter(p => p.group === group.name) : [];
  };

  // Add this function to open prediction modal for a specific player
  const openPredictModal = (player) => {
    setNewPlayerData({
      selectedGroup: '',
      selectedPlayer: player.id,
      // Initialize all metrics to empty strings
      ...Object.values(positionMetrics).flat().reduce((acc, metric) => {
        acc[metric.key] = '';
        return acc;
      }, {})
    });
    setShowPredictModal(true);
  };

  // Handle performance modal open
  const openPerfModal = (player) => {
    setPerfPlayer(player);
    setPerfData({});
    setShowPerfModal(true);
  };

  // Handle performance save (for demo, just alert)
  const savePerformance = () => {
    const date = new Date().toISOString();
    const updatedPlayers = players.map(p => {
      if (p.id === perfPlayer.id) {
        const performances = Array.isArray(p.performances) ? p.performances : [];
        return {
          ...p,
          performances: [
            ...performances,
            { date, ...perfData }
          ]
        };
      }
      return p;
    });
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    setShowPerfModal(false);
  };

  // View performance history
  const openPerfHistory = (player) => {
    // Find the latest player object by id
    const latest = (players || []).find(p => p.id === player.id) || player;
    setHistoryPlayer(latest);
    setShowPerfHistory(true);
  };

  // Add this function to predict position
  const predictPosition = () => {
    // Mock ML prediction - in a real app, you would call your ML model API here
    // This is a simplified example using weighted averages
    const metrics = newPlayerData;
    
    const positionScores = {
      Midfielder: 
        (parseFloat(metrics.assists || 0) * 0.3) +
        (parseFloat(metrics.successfulPasses || 0) * 0.2) +
        (parseFloat(metrics.keyPasses || 0) * 0.2) +
        (parseFloat(metrics.interceptions || 0) * 0.1) +
        (parseFloat(metrics.tackles || 0) * 0.1) +
        (parseFloat(metrics.goals || 0) * 0.1),
      
      Defender: 
        (parseFloat(metrics.clearances || 0) * 0.4) +
        (parseFloat(metrics.blocks || 0) * 0.3) +
        (parseFloat(metrics.interceptions || 0) * 0.1) +
        (parseFloat(metrics.duelsWon || 0) * 0.1) +
        (parseFloat(metrics.marking || 0) * 0.1),
      
      Forward: 
        (parseFloat(metrics.goals || 0) * 0.4) +
        (parseFloat(metrics.shotsOnTarget || 0) * 0.2) +
        (parseFloat(metrics.dribbles || 0) * 0.2) +
        (parseFloat(metrics.assists || 0) * 0.1) +
        (parseFloat(metrics.offTheBall || 0) * 0.1),
      
      Goalkeeper: 
        (parseFloat(metrics.saves || 0) * 0.5) +
        (parseFloat(metrics.cleanSheets || 0) * 0.3) +
        (parseFloat(metrics.distribution || 0) * 0.1) +
        (parseFloat(metrics.command || 0) * 0.1)
    };

    // Get position with highest score
    return Object.entries(positionScores)
      .sort((a, b) => b[1] - a[1])[0][0];
  };

  // Add this function to save the predicted player
  const savePredictedPlayer = () => {
    if (!newPlayerData.selectedPlayer) {
      alert('Please select a player first');
      return;
    }

    const position = predictPosition();
    
    // Find the selected player and update their position
    const updatedPlayers = players.map(p => {
      if (p.id === newPlayerData.selectedPlayer) {
        return {
          ...p,
          position: position,
          // Add the metrics as a new performance record
          performances: [
            ...(p.performances || []),
            {
              date: new Date().toISOString(),
              ...Object.keys(newPlayerData)
                .filter(key => !['selectedGroup', 'selectedPlayer'].includes(key))
                .reduce((acc, key) => {
                  acc[key] = newPlayerData[key];
                  return acc;
                }, {})
            }
          ]
        };
      }
      return p;
    });

    // Update players and localStorage
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    
    // Close modal and reset form
    setShowPredictModal(false);
    setNewPlayerData({
      selectedGroup: '',
      selectedPlayer: '',
      ...Object.values(positionMetrics).flat().reduce((acc, metric) => {
        acc[metric.key] = '';
        return acc;
      }, {})
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Players Management</h1>
              <p className="text-gray-600">Manage and track player performance data</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{filteredPlayers.length}</div>
              <div className="text-sm text-gray-500">Total Players</div>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Group</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
              >
                <option value="">All Groups</option>
                {(groups || []).map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Players</label>
              <input
                type="text"
                placeholder="Search by name or position..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
        
        {/* Players Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredPlayers || []).map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <span className="text-gray-600 font-semibold text-sm">
                              {p.name?.charAt(0)?.toUpperCase() || 'P'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-sm text-gray-500">{p.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        p.position === 'Forward' ? 'bg-red-100 text-red-800' :
                        p.position === 'Midfielder' ? 'bg-blue-100 text-blue-800' :
                        p.position === 'Defender' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {p.age || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                        {p.group || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openPerfModal(p)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          title={`Add training performance for ${p.name}`}
                        >
                          <FaChartLine className="text-xs" /> Add Performance
                        </button>
                        <button 
                          onClick={() => openPerfHistory(p)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          title={`View performance history for ${p.name}`}
                        >
                          <FaHistory className="text-xs" /> History
                        </button>
                        <button 
                          onClick={() => openPredictModal(p)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          title={`Predict position for ${p.name}`}
                        >
                          <FaMagic className="text-xs" /> Predict
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">👥</span>
                        </div>
                        <p className="text-lg font-medium">No players found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Modal */}
        {showPerfModal && perfPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Add Performance Data
                  </h2>
                  <button 
                    onClick={() => setShowPerfModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                      <span className="text-gray-600 font-semibold">
                        {perfPlayer.name?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{perfPlayer.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        perfPlayer.position === 'Forward' ? 'bg-red-100 text-red-800' :
                        perfPlayer.position === 'Midfielder' ? 'bg-blue-100 text-blue-800' :
                        perfPlayer.position === 'Defender' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {perfPlayer.position}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Position-Specific Metrics:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {positionMetrics[perfPlayer.position]?.map(metric => (
                      <li key={metric.key} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        {metric.label}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  {(positionMetrics[perfPlayer.position] || []).map(metric => (
                    <div key={metric.key}>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">{metric.label}</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={perfData[metric.key] || ''}
                        onChange={e => setPerfData(d => ({ ...d, [metric.key]: e.target.value }))}
                        min="0"
                        placeholder={`Enter ${metric.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={savePerformance}
                  >
                    <FaChartLine /> Save Performance
                  </button>
                  <button 
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => setShowPerfModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance History Modal */}
        {showPerfHistory && historyPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                      <span className="text-gray-600 font-semibold text-lg">
                        {historyPlayer.name?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Performance History</h2>
                      <p className="text-gray-600">{historyPlayer.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPerfHistory(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Position: </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    historyPlayer.position === 'Forward' ? 'bg-red-100 text-red-800' :
                    historyPlayer.position === 'Midfielder' ? 'bg-blue-100 text-blue-800' :
                    historyPlayer.position === 'Defender' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {historyPlayer.position}
                  </span>
                </div>
                
                {Array.isArray(positionMetrics[historyPlayer.position]) && Array.isArray(historyPlayer?.performances) && historyPlayer.performances.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Records</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                            {positionMetrics[historyPlayer.position].map(metric => (
                              <th key={metric.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{metric.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {historyPlayer.performances.map((perf, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {new Date(perf.date).toLocaleDateString()}
                              </td>
                              {positionMetrics[historyPlayer.position].map(metric => (
                                <td key={metric.key} className="px-4 py-3 text-sm text-gray-700">
                                  {perf[metric.key] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No performance data available</p>
                    <p className="text-gray-400 text-sm">Performance data for {historyPlayer.name} will appear here</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <button 
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => setShowPerfHistory(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Modal */}
        {showPredictModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Predict Player Position</h2>
                  <button 
                    onClick={() => setShowPredictModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Player Information</h3>
                  {(() => {
                    const selectedPlayer = players.find(p => p.id === newPlayerData.selectedPlayer);
                    if (!selectedPlayer) return null;
                    
                    return (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                          <span className="text-gray-600 font-semibold text-lg">
                            {selectedPlayer.name?.charAt(0)?.toUpperCase() || 'P'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{selectedPlayer.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">Group: {selectedPlayer.group || 'Unassigned'}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-600">Current Position: </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedPlayer.position === 'Forward' ? 'bg-red-100 text-red-800' :
                              selectedPlayer.position === 'Midfielder' ? 'bg-blue-100 text-blue-800' :
                              selectedPlayer.position === 'Defender' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedPlayer.position || 'No position'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Player Metrics</h3>
                  <p className="text-sm text-gray-600 mb-4">Enter the player's performance metrics to predict their optimal position</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(positionMetrics).flat().map(metric => (
                      <div key={metric.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{metric.label}</label>
                        <input
                          type="number"
                          placeholder={`Enter ${metric.label}`}
                          value={newPlayerData[metric.key]}
                          onChange={e => setNewPlayerData({...newPlayerData, [metric.key]: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                    onClick={savePredictedPlayer}
                  >
                    <FaMagic /> Predict & Update Position
                  </button>
                  <button 
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                    onClick={() => setShowPredictModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachPlayers;