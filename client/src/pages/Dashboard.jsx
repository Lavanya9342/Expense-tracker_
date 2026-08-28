import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiPieChart, FiTrendingDown, FiTrendingUp, FiTrash2, FiEdit, FiFilter, FiTarget } from 'react-icons/fi';
import API from '../services/api';
import ExpenseModal from '../components/ExpenseModal';
import Charts from '../components/Charts';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [dateFilter, setDateFilter] = useState('All'); 
  const [categoryFilter, setCategoryFilter] = useState('All'); // 🔍 Puthu Category Filter

  const MONTHLY_INCOME = 5000; 

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get('/expenses');
      setExpenses(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await API.put(`/expenses/${editingExpense._id}`, expenseData);
      } else {
        await API.post('/expenses', expenseData);
      }
      fetchExpenses();
      setIsModalOpen(false);
      setEditingExpense(null);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await API.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        alert("Failed to delete expense");
      }
    }
  };


  const currentDate = new Date();
  
  const thisMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  }).reduce((acc, curr) => acc + Number(curr.amount), 0);

  const lastMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
    const lastYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  }).reduce((acc, curr) => acc + Number(curr.amount), 0);

  
  let percentageChange = 0;
  let isSpendingMore = false;
  if (lastMonthExpenses > 0) {
    percentageChange = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    isSpendingMore = percentageChange > 0;
  }


  const savingsThisMonth = MONTHLY_INCOME - thisMonthExpenses;
  const savingsPercentage = ((savingsThisMonth / MONTHLY_INCOME) * 100).toFixed(1);

  const filteredExpenses = expenses.filter((expense) => {
    const expDate = new Date(expense.date);
    let dateMatch = true;
    let categoryMatch = categoryFilter === 'All' ? true : expense.category === categoryFilter;

    if (dateFilter === 'This Month') {
      dateMatch = expDate.getMonth() === currentDate.getMonth() && expDate.getFullYear() === currentDate.getFullYear();
    } else if (dateFilter === 'Last Month') {
      const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const lastYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      dateMatch = expDate.getMonth() === lastMonth && expDate.getFullYear() === lastYear;
    } else if (dateFilter === 'This Year') {
      dateMatch = expDate.getFullYear() === currentDate.getFullYear();
    }

    return dateMatch && categoryMatch;
  });

  const totalFilteredExpense = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-[#0f172a] to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-white">
              Analytics Overview
            </h1>
            <p className="text-gray-400 mt-1">Track and manage your spending</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* 🔍 Category Filter */}
            <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2.5 rounded-xl border border-gray-700 shadow-lg">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-sm font-medium w-full"
              >
                <option value="All" className="bg-gray-800">All Categories</option>
                <option value="Food" className="bg-gray-800">Food</option>
                <option value="Travel" className="bg-gray-800">Travel</option>
                <option value="Shopping" className="bg-gray-800">Shopping</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2.5 rounded-xl border border-gray-700 shadow-lg">
              <FiFilter className="text-blue-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-sm font-medium"
              >
                <option value="All" className="bg-gray-800">All Time</option>
                <option value="This Month" className="bg-gray-800">This Month</option>
                <option value="Last Month" className="bg-gray-800">Last Month</option>
                <option value="This Year" className="bg-gray-800">This Year</option>
              </select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all whitespace-nowrap"
            >
              <FiPlus /> Add Expense
            </motion.button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 font-medium">This Month Expenses</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FiPieChart size={20} /></div>
            </div>
            <h2 className="text-4xl font-bold mb-2">${thisMonthExpenses.toFixed(2)}</h2>
            
            {lastMonthExpenses > 0 ? (
              <p className={`text-sm flex items-center gap-1 font-medium ${isSpendingMore ? 'text-red-400' : 'text-emerald-400'}`}>
                {isSpendingMore ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(percentageChange).toFixed(1)}% {isSpendingMore ? 'more' : 'less'} than last month
              </p>
            ) : (
              <p className="text-sm text-gray-500">No data for last month</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">
                {dateFilter === 'All' && categoryFilter === 'All' ? 'Total Spends' : 'Filtered Total'}
              </h3>
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><FiFilter size={20} /></div>
            </div>
            <h2 className="text-4xl font-bold text-white">${totalFilteredExpense.toFixed(2)}</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 font-medium">Savings Rate (This Month)</h3>
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><FiTarget size={20} /></div>
            </div>
            <h2 className="text-4xl font-bold text-emerald-400">{savingsPercentage}%</h2>
            <p className="text-sm text-gray-400 mt-2">Based on $5,000 monthly budget</p>
            
            <div className="w-full bg-gray-700 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${savingsPercentage > 20 ? 'bg-emerald-400' : 'bg-red-400'}`}
                style={{ width: `${Math.max(0, Math.min(100, savingsPercentage))}%` }}
              ></div>
            </div>
          </motion.div>
        </div>

        {filteredExpenses.length > 0 ? (
          <Charts expenses={filteredExpenses} />
        ) : (
          <div className="text-center p-10 bg-white/5 rounded-2xl border border-white/10 mb-6">
            <p className="text-gray-400">No expenses found for the selected filters.</p>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 mt-8 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-4">Transactions</h3>
          <div className="space-y-3">
            {filteredExpenses.length === 0 && <p className="text-gray-400 italic">No transactions found.</p>}
            
            {filteredExpenses.map((expense) => (
              <div key={expense._id} className="flex justify-between items-center p-4 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    {expense.category.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{expense.description}</h4>
                    <p className="text-sm text-gray-400">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-400 text-lg mr-4">-${expense.amount.toFixed(2)}</span>
                  <button onClick={() => openEditModal(expense)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <FiEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(expense._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }} 
        onSubmit={handleSaveExpense} 
        initialData={editingExpense} 
      />
    </div>
  );
};

export default Dashboard;