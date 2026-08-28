const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date} = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      date
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await expense.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
  
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
  
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};