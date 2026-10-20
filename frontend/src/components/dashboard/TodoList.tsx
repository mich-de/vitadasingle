import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todo/all');
        const data = await response.json();
        setTodos(data.filter((item: TodoItem) => !item.completed).sort((a: TodoItem, b: TodoItem) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">To do list</h2>
      <div className="space-y-3">
        {todos.length > 0 ? (
          todos.slice(0, 5).map(todo => (
            <div key={todo.id} className="flex items-center gap-3">
              <input type="checkbox" className="h-5 w-5 rounded text-primary-light focus:ring-primary-light" />
              <div>
                <p className="text-gray-800 dark:text-white">{todo.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scadenza: {format(new Date(todo.dueDate), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nessun task da completare.</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;