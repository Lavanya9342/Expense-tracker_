import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: ''
  });
  useEffect(() => {
    if (initialData) {
      const formattedDate = new Date(initialData.date).toISOString().split('T')[0];
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
       
        date: formattedDate
      });
    } else {
      setFormData({ amount: '', category: 'Food', date: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); 
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition" >
            <FiX size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">
            {initialData ? 'Edit Expense ' : 'Add New Expense '}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
              {initialData ? 'Update Expense' : 'Save Expense'}
            </button>
          </form>
        </motion.div>
      </div>
  );
};

export default ExpenseModal;