import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  paymentMethod?: string;
}

interface ExpenseStatsProps {
  expenses: ExpenseItem[];
  period: 'all' | 'month' | 'year';
}

const ExpenseStats = ({ expenses, period }: ExpenseStatsProps) => {
  const { darkMode } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const stats = useMemo(() => {
    // Calculate total amount
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Group by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort categories by amount (descending)
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalAmount) * 100
      }));
    
    // Calculate average expense
    const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
    
    // Find highest expense
    const highestExpense = expenses.length > 0 
      ? expenses.reduce((max, expense) => expense.amount > max.amount ? expense : max, expenses[0])
      : null;
    
    // Find most recent expense
    const mostRecentExpense = expenses.length > 0
      ? expenses.reduce((latest, expense) => 
          new Date(expense.date) > new Date(latest.date) ? expense : latest, expenses[0])
      : null;
    
    return {
      totalAmount,
      averageAmount,
      highestExpense,
      mostRecentExpense,
      sortedCategories
    };
  }, [expenses]);

  // Format the period label
  const getPeriodLabel = () => {
    switch(period) {
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'All Time';
    }
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">Expense Statistics ({getPeriodLabel()})</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Expense</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.averageAmount)}</p>
          </div>
        </div>
        
        <h3 className="font-medium mb-3">Expenses by Category</h3>
        <div className="space-y-3">
          {stats.sortedCategories.map(({ category, amount, percentage }) => (
            <div key={category}>
              <div className="flex justify-between mb-1">
                <span>{category}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {stats.highestExpense && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Highest Expense</h3>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-medium">{stats.highestExpense.title}</p>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(stats.highestExpense.date).toLocaleDateString('it-IT')}
                </span>
                <span className="font-medium">{formatCurrency(stats.highestExpense.amount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseStats;