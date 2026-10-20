import React from 'react';

const TasksAssigned = () => {
  // Fetch and display assigned tasks from JSON
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tasks I've assigned</h2>
      {/* Assigned tasks content will be rendered here */}
    </div>
  );
};

export default TasksAssigned;