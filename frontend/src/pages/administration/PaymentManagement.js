import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiDownload, FiEye, FiXCircle, FiFilter, FiPrinter, FiDollarSign, FiCalendar, FiUser, FiUsers, FiCreditCard, FiCheckCircle, FiX } from 'react-icons/fi';
import { format, parseISO, isBefore, isAfter } from 'date-fns';

const PaymentManagement = ({ players = [], groups = [] }) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [showPaidPlayers, setShowPaidPlayers] = useState(false);
  const [showUnpaidPlayers, setShowUnpaidPlayers] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(() => {
    const saved = localStorage.getItem('paymentHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showPlayerListModal, setShowPlayerListModal] = useState(false);
  const [playerListType, setPlayerListType] = useState('all');
  const [errors, setErrors] = useState({});
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receipt, setReceipt] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [viewReceipt, setViewReceipt] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState({ title: '', players: [] });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
  const [filters, setFilters] = useState({
    method: 'all',
    startDate: '',
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [paymentSummary, setPaymentSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedAmount: 0,
    pendingAmount: 0
  });
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPlayers, setModalPlayers] = useState([]);

  // Save to localStorage whenever paymentHistory changes
  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  // Get subgroups for a group
  const getSubgroupsForGroup = (groupId) => {
    if (!groupId || !groups) return [];
    const group = groups.find(g => g.id === groupId);
    return group ? group.subgroups : [];
  };

  // Get paid player IDs from payment history
  const paidPlayerIds = (paymentHistory || []).map(payment => payment?.playerId);

  // Safely get players in selected group and subgroup with payment status filter
  const groupPlayers = selectedGroup
    ? (players || []).filter(player => {
      const matchesGroup = player?.groupId === selectedGroup;
      const matchesSubgroup = !selectedSubgroup || player?.subgroupId === selectedSubgroup;
      const matchesPaymentStatus =
        (showPaidPlayers && paidPlayerIds.includes(player?.id)) ||
        (showUnpaidPlayers && !paidPlayerIds.includes(player?.id)) ||
        (!showPaidPlayers && !showUnpaidPlayers);

      return matchesGroup && matchesSubgroup && matchesPaymentStatus;
    })
    : (players || []).filter(player => {
      const matchesPaymentStatus =
        (showPaidPlayers && paidPlayerIds.includes(player?.id)) ||
        (showUnpaidPlayers && !paidPlayerIds.includes(player?.id)) ||
        (!showPaidPlayers && !showUnpaidPlayers);

      return matchesPaymentStatus;
    });

  // Filter players based on payment status
  const paidPlayers = groupPlayers.filter(player =>
    paidPlayerIds.includes(player?.id)
  );

  const unpaidPlayers = groupPlayers.filter(player =>
    !paidPlayerIds.includes(player?.id)
  );

  // Handle showing players based on status
  const handleShowPlayers = (type) => {
    let title = '';
    let players = [];

    switch (type) {
      case 'all':
        title = 'All Players';
        players = groupPlayers;
        break;
      case 'paid':
        title = 'Paid Players';
        players = paidPlayers;
        break;
      case 'unpaid':
        title = 'Unpaid Players';
        players = unpaidPlayers;
        break;
      default:
        return;
    }

    setModalTitle(title);
    setModalPlayers(players);
    setShowPlayersModal(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!selectedPlayer) {
      newErrors.selectedPlayer = 'Please select a player';
    }

    if (!amountPaid || parseFloat(amountPaid) <= 0) {
      newErrors.amountPaid = 'Please enter a valid amount';
    }

    if (!paymentDate) {
      newErrors.paymentDate = 'Please select a payment date';
    } else if (isAfter(new Date(paymentDate), new Date())) {
      newErrors.paymentDate = 'Payment date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment submission
  const handleAddPayment = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const player = (players || []).find(p => p?.id === selectedPlayer);
    const newPayment = {
      id: `PAY-${Date.now()}`,
      playerId: selectedPlayer,
      playerName: player?.name,
      playerEmail: player?.email,
      groupId: player?.groupId,
      groupName: player?.group,
      subgroupId: player?.subgroupId,
      subgroupName: player?.subgroup,
      amount: parseFloat(amountPaid),
      date: paymentDate,
      method: paymentMethod,
      receipt: receipt,
      status: 'Completed',
      timestamp: new Date().toISOString()
    };

    setPaymentHistory(prev => [newPayment, ...(prev || [])]);
    setNotification({
      message: `Payment of $${newPayment.amount.toFixed(2)} recorded for ${newPayment.playerName}`,
      type: 'success'
    });

    // Reset form
    setSelectedPlayer('');
    setAmountPaid('');
    setPaymentMethod('cash');
    setReceipt(null);
  };

  // Handle payment deletion
  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPaymentHistory(prev => (prev || []).filter(payment => payment?.id !== paymentId));
      setNotification({
        message: 'Payment record deleted',
        type: 'info'
      });
    }
  };

  // Handle receipt download
  const handleDownloadReceipt = (payment) => {
    // In a real app, this would generate/download a receipt
    alert(`Downloading receipt for payment ${payment?.id}`);
  };

  const handleRequestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash': return '💰';
      case 'card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'check': return '📝';
      default: return '';
    }
  };

  // Update the filtering useEffect
  useEffect(() => {
    let filtered = [...paymentHistory];

    // First apply group and subgroup filters
    if (selectedGroup) {
      filtered = filtered.filter(payment => payment.groupId === selectedGroup);
    }
    if (selectedSubgroup) {
      filtered = filtered.filter(payment => payment.subgroupId === selectedSubgroup);
    }

    // Then apply payment status filters
    // If no explicit status filter is set and a group/subgroup is selected, show paid players
    if (!showPaidPlayers && !showUnpaidPlayers && (selectedGroup || selectedSubgroup)) {
      filtered = filtered.filter(payment => payment.status === 'Completed');
    } else {
      if (showPaidPlayers) {
        filtered = filtered.filter(payment => payment.status === 'Completed');
      }
      if (showUnpaidPlayers) {
        filtered = filtered.filter(payment => payment.status !== 'Completed');
      }
    }

    // Apply method and date filters
    if (filters.method !== 'all') {
      filtered = filtered.filter(payment => payment.method === filters.method);
    }
    if (filters.startDate) {
      filtered = filtered.filter(payment => new Date(payment.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(payment => new Date(payment.date) <= new Date(filters.endDate));
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === 'playerName') {
          return sortConfig.direction === 'asc'
            ? a.playerName.localeCompare(b.playerName)
            : b.playerName.localeCompare(a.playerName);
        }
        return 0;
      });
    }

    setFilteredPaymentHistory(filtered);
  }, [paymentHistory, selectedGroup, selectedSubgroup, showPaidPlayers, showUnpaidPlayers, sortConfig, filters]);

  // Add this useEffect to calculate payment summary
  useEffect(() => {
    const summary = filteredPaymentHistory.reduce((acc, payment) => {
      acc.totalPayments++;
      acc.totalAmount += payment.amount || 0;
      if (payment.status === 'Completed') {
        acc.completedAmount += payment.amount || 0;
      } else {
        acc.pendingAmount += payment.amount || 0;
      }
      return acc;
    }, {
      totalPayments: 0,
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0
    });

    setPaymentSummary(summary);
  }, [filteredPaymentHistory]);

  // Handle view receipt
  const handleViewReceipt = (payment) => {
    setViewReceipt(payment);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Add this function to handle print modal
  const handlePrintModal = (title, players) => {
    setPrintData({ title, players });
    setShowPrintModal(true);
  };

  // Update the Payment History section title to show current filters
  const getPaymentHistoryTitle = () => {
    let title = 'Payment History';
    if (selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup);
      title += ` - ${group?.name || ''}`;
      if (selectedSubgroup) {
        const subgroup = group?.subgroups?.find(sg => sg.id === selectedSubgroup);
        title += ` > ${subgroup?.name || ''}`;
      }
    }
    return title;
  };

  // Update the group selection handler
  const handleGroupChange = (e) => {
    const newGroupId = e.target.value;
    setSelectedGroup(newGroupId);
    setSelectedSubgroup('');
    setSelectedPlayer('');
    // Don't reset payment status filters here
  };

  // Update the subgroup selection handler
  const handleSubgroupChange = (e) => {
    const newSubgroupId = e.target.value;
    setSelectedSubgroup(newSubgroupId);
    setSelectedPlayer('');
    // Don't reset payment status filters here
  };

  // Update the payment status toggle buttons
  const handlePaymentStatusToggle = (type) => {
    if (type === 'all') {
      setShowPaidPlayers(false);
      setShowUnpaidPlayers(false);
    } else if (type === 'paid') {
      setShowPaidPlayers(true);
      setShowUnpaidPlayers(false);
    } else if (type === 'unpaid') {
      setShowPaidPlayers(false);
      setShowUnpaidPlayers(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiCreditCard className="text-blue-600" />
            Payment Management
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Manage player payments, track payment history, and generate receipts
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 rounded-xl shadow-md">
          <p className="text-white font-medium flex items-center gap-2">
            <FiDollarSign size={20} />
            Total Payments: ${paymentSummary.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Group Selection */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FiUsers className="text-blue-500" />
              Select Group
            </label>
            <select
              value={selectedGroup}
              onChange={handleGroupChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            >
              <option value="">All Groups</option>
              {(groups || []).map(group => (
                <option key={group?.id} value={group?.id}>
                  {group?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subgroup Selection */}
          {selectedGroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiUsers className="text-blue-500" />
                Select Subgroup
              </label>
              <select
                value={selectedSubgroup}
                onChange={handleSubgroupChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              >
                <option value="">All Subgroups</option>
                {getSubgroupsForGroup(selectedGroup).map(subgroup => (
                  <option key={subgroup.id} value={subgroup.id}>
                    {subgroup.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Player Status Toggles */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => handlePaymentStatusToggle('all')}
          className={`py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${!showPaidPlayers && !showUnpaidPlayers
              ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-inner'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiUsers className="text-lg" />
            <span>All Players</span>
          </div>
        </button>

        <button
          onClick={() => handlePaymentStatusToggle('paid')}
          className={`py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${showPaidPlayers
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-inner'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiCheckCircle className="text-lg" />
            <span>Paid Players</span>
          </div>
        </button>

        <button
          onClick={() => handlePaymentStatusToggle('unpaid')}
          className={`py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${showUnpaidPlayers
              ? 'bg-rose-50 border border-rose-200 text-rose-700 shadow-inner'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiXCircle className="text-lg" />
            <span>Unpaid Players</span>
          </div>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          {selectedGroup ? (
            selectedSubgroup ? (
              `Subgroup Summary: ${getSubgroupsForGroup(selectedGroup).find(sg => sg.id === selectedSubgroup)?.name || ''}`
            ) : (
              `Group Summary: ${groups.find(g => g.id === selectedGroup)?.name || ''}`
            )
          ) : (
            'All Players Summary'
          )}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-light text-gray-800">{groupPlayers.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Players</p>
            <button
              onClick={() => handleShowPlayers('all')}
              className="mt-2 w-full py-1.5 px-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
            >
              <FiEye size={14} />
              <span className="text-xs">Show All</span>
            </button>
          </div>

          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-light text-emerald-700">{paidPlayers.length}</p>
            <p className="text-xs text-emerald-600 mt-1">Paid Players</p>
            <button
              onClick={() => handleShowPlayers('paid')}
              className="mt-2 w-full py-1.5 px-2 bg-white border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1"
            >
              <FiCheckCircle size={14} />
              <span className="text-xs">Show Paid</span>
            </button>
          </div>

          <div className="text-center p-3 bg-rose-50 rounded-lg">
            <p className="text-2xl font-light text-rose-700">{unpaidPlayers.length}</p>
            <p className="text-xs text-rose-600 mt-1">Unpaid Players</p>
            <button
              onClick={() => handleShowPlayers('unpaid')}
              className="mt-2 w-full py-1.5 px-2 bg-white border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1"
            >
              <FiXCircle size={14} />
              <span className="text-xs">Show Unpaid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white p-7 rounded-2xl mb-8 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-3 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiPlus className="text-blue-600" />
            Record New Payment
          </h2>
          <div className="text-sm text-gray-500">
            {selectedGroup ? `Group: ${groups.find(g => g.id === selectedGroup)?.name || ''}` : 'All Groups'}
            {showPaidPlayers && ' - Paid Players Only'}
            {showUnpaidPlayers && ' - Unpaid Players Only'}
          </div>
        </div>

        <form onSubmit={handleAddPayment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiUsers className="text-blue-500" />
                Select Group
              </label>
              <select
                value={selectedGroup}
                onChange={handleGroupChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              >
                <option value="">All Groups</option>
                {(groups || []).map(group => (
                  <option key={group?.id} value={group?.id}>
                    {group?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subgroup Selection - Only show if a group is selected */}
            {selectedGroup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiUsers className="text-blue-500" />
                  Select Subgroup
                </label>
                <select
                  value={selectedSubgroup}
                  onChange={handleSubgroupChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value="">All Subgroups</option>
                  {getSubgroupsForGroup(selectedGroup).map(subgroup => (
                    <option key={subgroup.id} value={subgroup.id}>
                      {subgroup.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Player Selection - Only show if a group is selected */}
            {selectedGroup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiUser className="text-blue-500" />
                  Select Player <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPlayer}
                  onChange={(e) => {
                    setSelectedPlayer(e.target.value);
                    if (errors.selectedPlayer) {
                      setErrors(prev => ({ ...prev, selectedPlayer: '' }));
                    }
                  }}
                  className={`w-full p-3 border ${errors.selectedPlayer ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm`}
                >
                  <option value="">Select a player</option>
                  {groupPlayers.map((player) => {
                    const isPaid = paidPlayerIds.includes(player?.id);
                    return (
                      <option key={player?.id} value={player?.id}>
                        {player?.name}
                        {isPaid ? ' - ✅ Paid' : ' - ❌ Unpaid'}
                      </option>
                    );
                  })}
                </select>
                {errors.selectedPlayer && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <FiXCircle className="inline" /> {errors.selectedPlayer}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiDollarSign className="text-blue-500" />
                Amount Paid <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                  <FiDollarSign />
                </span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => {
                    setAmountPaid(e.target.value);
                    if (errors.amountPaid) {
                      setErrors(prev => ({ ...prev, amountPaid: '' }));
                    }
                  }}
                  className={`pl-12 w-full p-3 border ${errors.amountPaid ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                />
              </div>
              {errors.amountPaid && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FiXCircle className="inline" /> {errors.amountPaid}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                Payment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => {
                    setPaymentDate(e.target.value);
                    if (errors.paymentDate) {
                      setErrors(prev => ({ ...prev, paymentDate: '' }));
                    }
                  }}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className={`w-full p-3 border ${errors.paymentDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                />
              </div>
              {errors.paymentDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FiXCircle className="inline" /> {errors.paymentDate}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiCreditCard className="text-blue-500" />
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 transition-colors">
                    {receipt ? (
                      <div className="text-center p-3">
                        <div className="font-medium text-gray-700">{receipt.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {Math.round(receipt.size / 1024)} KB
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <FiDownload className="mx-auto text-gray-400 text-2xl mb-2" />
                        <p className="text-sm text-gray-600">Click to upload receipt</p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG, PDF (Max 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => setReceipt(e.target.files[0])}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </label>
                {receipt && (
                  <button
                    type="button"
                    onClick={() => setReceipt(null)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <FiXCircle size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedPlayer('');
                setAmountPaid('');
                setPaymentDate(format(new Date(), 'yyyy-MM-dd'));
                setPaymentMethod('cash');
                setReceipt(null);
                setErrors({});
              }}
              className="px-5 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl hover:from-gray-300 hover:to-gray-400 shadow-md transition-all flex items-center gap-2"
            >
              <FiXCircle size={18} /> Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <FiPlus size={18} /> Record Payment
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter className="text-blue-600" />
            {getPaymentHistoryTitle()}
          </h2>

          <div className="flex flex-wrap gap-3">
            <div className="bg-gray-50 p-1 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1 px-2">Method</label>
              <select
                value={filters.method}
                onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="online">Online</option>
              </select>
            </div>

            <div className="bg-gray-50 p-1 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1 px-2">From</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div className="bg-gray-50 p-1 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1 px-2">To</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl shadow border border-blue-100">
            <p className="text-gray-600 text-sm mb-1">Total Payments</p>
            <p className="text-2xl font-bold text-blue-700">{paymentSummary.totalPayments}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl shadow border border-green-100">
            <p className="text-gray-600 text-sm mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-700">${paymentSummary.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl shadow border border-emerald-100">
            <p className="text-gray-600 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-700">${paymentSummary.completedAmount.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-2xl shadow border border-amber-100">
            <p className="text-gray-600 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-700">${paymentSummary.pendingAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRequestSort('playerName')}
                >
                  <div className="flex items-center gap-1">
                    Player
                    {sortConfig.key === 'playerName' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRequestSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig.key === 'date' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPaymentHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center py-8">
                      <FiFilter className="text-gray-400 text-3xl mb-3" />
                      <p className="text-lg">No payment records found</p>
                      <p className="text-gray-500 mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPaymentHistory.map((payment) => (
                  <tr key={payment?.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {payment?.playerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment?.playerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-green-700">
                      ${payment?.amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">
                        {format(new Date(payment?.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(payment?.timestamp), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMethodIcon(payment?.method)}</span>
                        <span className="capitalize font-medium">
                          {payment?.method?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(payment?.status)}`}>
                        {payment?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setViewReceipt(payment)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={20} />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment?.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Payment"
                        >
                          <FiXCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player List Modal */}
      {showPlayersModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiUsers className="text-blue-600" />
                  {modalTitle}
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FiPrinter size={16} />
                    Print List
                  </button>
                  <button
                    onClick={() => setShowPlayersModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="print:block hidden">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">{modalTitle}</h1>
                  <p className="text-gray-600 mt-2">
                    Generated on {format(new Date(), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {modalPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <FiUsers className="mx-auto text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-500">No players found</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {modalPlayers.map((player, index) => {
                    const group = (groups || []).find(g => g?.id === player?.groupId);
                    const isPaid = paidPlayerIds.includes(player?.id);
                    return (
                      <div
                        key={player?.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 print:border-gray-300"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500 print:text-gray-700">{index + 1}.</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{player?.name}</h3>
                            <p className="text-sm text-gray-500">{player?.email}</p>
                            {group && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full print:bg-gray-100 print:text-gray-800">
                                {group.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPaid
                            ? 'bg-emerald-100 text-emerald-800 print:bg-gray-100 print:text-gray-800'
                            : 'bg-rose-100 text-rose-800 print:bg-gray-100 print:text-gray-800'
                          }`}>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FiCreditCard className="text-blue-600" />
                  Payment Receipt
                </h2>
                <button
                  onClick={() => setViewReceipt(null)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="py-4 my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="font-medium">{viewReceipt?.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">
                      {format(parseISO(viewReceipt?.timestamp), 'MMM dd, yyyy hh:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Player</p>
                    <p className="font-medium">{viewReceipt?.playerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium">${viewReceipt?.amount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">
                      {viewReceipt?.method?.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewReceipt?.status)}`}>
                      {viewReceipt?.status}
                    </span>
                  </div>
                </div>
              </div>

              {viewReceipt?.receipt ? (
                <div>
                  <h3 className="font-medium mb-2">Receipt Image</h3>
                  <img
                    src={URL.createObjectURL(viewReceipt.receipt)}
                    alt="Payment receipt"
                    className="max-w-full h-auto border rounded-lg"
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No receipt attached</p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <FiPrinter size={16} /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiPrinter className="text-blue-600" />
                  {printData.title}
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FiPrinter size={16} />
                    Print List
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="print:block hidden">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">{printData.title}</h1>
                  <p className="text-gray-600 mt-2">
                    Generated on {format(new Date(), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {printData.players.length === 0 ? (
                <div className="text-center py-8">
                  <FiUsers className="mx-auto text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-500">No players found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {printData.players.map((player, index) => {
                    const group = (groups || []).find(g => g?.id === player?.groupId);
                    const isPaid = paidPlayerIds.includes(player?.id);
                    return (
                      <div
                        key={player?.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 print:border-gray-300"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500 print:text-gray-700">{index + 1}.</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{player?.name}</h3>
                            <p className="text-sm text-gray-500">{player?.email}</p>
                            {group && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full print:bg-gray-100 print:text-gray-800">
                                {group.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPaid
                            ? 'bg-emerald-100 text-emerald-800 print:bg-gray-100 print:text-gray-800'
                            : 'bg-rose-100 text-rose-800 print:bg-gray-100 print:text-gray-800'
                          }`}>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;