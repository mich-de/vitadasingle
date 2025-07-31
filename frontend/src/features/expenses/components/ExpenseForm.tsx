import React, { useState, useEffect } from "react";
import type { Expense } from "../../../types";
import { Button } from "../../../components/ui/Button";

interface ExpenseFormProps {
  initialExpense?: Expense | null;
  onSubmit: (expense: Omit<Expense, "id"> | Expense) => void;
  onCancel: () => void;
}

const defaultExpense: Omit<Expense, "id"> = {
  title: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  category: "",
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialExpense, onSubmit, onCancel }) => {
  const [expense, setExpense] = useState<Omit<Expense, "id"> | Expense>(initialExpense || defaultExpense);

  useEffect(() => {
    if (initialExpense) {
      setExpense(initialExpense);
    } else {
      setExpense(defaultExpense);
    }
  }, [initialExpense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: name === "amount" ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(expense);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={expense.title}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={expense.category}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};