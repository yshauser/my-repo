import React, { useState, useEffect } from 'react';
import { TaskManager } from '../../services/TaskManager';
import { TaskEntry } from '../../types';
import AddScheduledTaskForm from './AddScheduledTaskForm';

const ScheduledPage = () => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    taskUser: '',
    taskLabel: '',
    taskStartDate: '',
    taskEndDate: '',
    taskDays: 0,
    timesPerDay: 0,
    timeInDay: '', 
    dose: 0,
    doseUnits: '',
    medicine: '',
    withFood: '',
    comment: ''
  });

  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  const loadTasksFromStorage = () => {
    const storedTasks = localStorage.getItem('scheduledTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  };

  const saveTasksToStorage = (updatedTasks: TaskEntry[]) => {
    localStorage.setItem('TaskEntry', JSON.stringify(updatedTasks));
  };

  const saveTasksToFile = async (updatedTasks: TaskEntry[]) => {
    try {
      await fetch('/api/saveToJsonFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'tasks',
          data: updatedTasks,
          type: 'scheduled', 
        })
      });
    } catch (error) {
      console.error('Error saving tasks to file:', error);
    }
  };  

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TaskEntry = {
      id: Date.now().toString(),
      ...formData,
      taskStartDate: formData.taskStartDate
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    await saveTasksToFile(updatedTasks);
    setIsDialogOpen(false);
    setFormData({
      taskUser: '',
      taskLabel: '',
      taskStartDate: '',
      taskEndDate: '',
      taskDays: 0,
      timesPerDay: 0,
      timeInDay: '', 
      dose: 0,
      doseUnits: '',
      medicine: '',
      withFood: '',
      comment: ''
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">משימות מתוזמנות</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          הוסף תרופה תקופתית
        </button>
      </div>

      {isDialogOpen && (
        <AddScheduledTaskForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => setIsDialogOpen(false)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תווית משימה
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם התרופה
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                מינון
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תאריך התחלה
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ימים לנטילה
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעמים ביום
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.taskLabel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.medicine}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.dose}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(task.taskStartDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.taskDays}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.timesPerDay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledPage;