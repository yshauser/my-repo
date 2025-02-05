import React, { useState, useEffect } from 'react';
import { TaskManager, formatDate } from '../../services/TaskManager';
import { TaskEntry } from '../../types';
import AddScheduledTaskForm from './AddScheduledTaskForm';
import { ChevronDown, ChevronUp,Pencil, Trash } from 'lucide-react';
import { parse, addDays, differenceInDays } from 'date-fns';
import { he } from 'date-fns/locale';

const initialFormData = {
  taskUser: '',
  taskLabel: '',
  taskStartDate: '',
  taskEndDate: '',
  taskDays: 1,
  timesPerDay: 1,
  timeInDay: '',
  dose: 0,
  doseUnits: '',
  medicine: '',
  withFood: '',
  comment: '',
};


const ScheduledPage = () => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskEntry | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState(initialFormData);

  const handleEditTask = (task: TaskEntry) => {
    setTaskToEdit(task);
    if (!task.doseUnits){task.doseUnits = ''}
    if (!task.withFood){task.withFood = ''}
    if (!task.comment){task.comment = ''}
    const startDate = new Date(formData.taskStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + formData.taskDays);
    setFormData({
      taskUser: task.taskUser,
      taskLabel: task.taskLabel,
      taskStartDate: formatDate(task.taskStartDate),
      taskEndDate: formatDate(endDate.toString()),
      taskDays: task.taskDays,
      timesPerDay: task.timesPerDay,
      timeInDay: task.timeInDay,
      dose: task.dose,
      doseUnits: task.doseUnits,
      medicine: task.medicine,
      withFood: task.withFood,
      comment: task.comment,
    });
    setIsFormOpen(true);
  };
  // useEffect(() => {
  //   loadTasksFromStorage();
  // }, []);
  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await TaskManager.loadTasks();
      console.log ('Page-kids use effect loaded tasjs', {loadedTasks});
      setTasks(loadedTasks);
    };
    fetchTasks().catch(error => console.error('Error in useEffect fetchTasks:', error));
  }, []);

  // const loadTasksFromStorage = () => {
  //   const storedTasks = localStorage.getItem('scheduledTasks');
  //   if (storedTasks) {
  //     setTasks(JSON.parse(storedTasks));
  //   }
  // };

  // const saveTasksToStorage = (updatedTasks: TaskEntry[]) => {
  //   localStorage.setItem('TaskEntry', JSON.stringify(updatedTasks));
  // };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDelete = async (taskId: string) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log ('is delete task', {taskId, tasks});
      const updatedTasksData = tasks.filter(task => task.id !== taskId);

      // Delete from backend/file
      // await TaskManager.deleteTask(taskId);
      await fetch(`/api/saveToJsonFile/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'tasks',
          data: updatedTasksData,
          type: 'tasks',
        })
      });
      // Update UI by filtering out the deleted task
      setTasks(tasks.filter(task => task.id !== taskId));
      console.log ('is deleting2', {taskId, tasks});

    } catch (error) {
      console.error('Error deleting task:', error);
      // You might want to show an error notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(formData.taskStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + formData.taskDays);
    console.log ('handle submit', {startDate, endDate}, formData.taskDays)
    const newTask: TaskEntry = {
      id: Date.now().toString(),
      ...formData,
      taskStartDate: formatDate(startDate.toString()),
      taskEndDate: formatDate(endDate.toString())
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    // saveTasksToStorage(updatedTasks);
    await saveTasksToFile(updatedTasks);
    setIsFormOpen(false);
    handleClose();

  };
 
  const handleClose = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
    setFormData(initialFormData);
  };

  const toggleRowExpansion = (taskId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(taskId)) {
      newExpandedRows.delete(taskId);
    } else {
      newExpandedRows.add(taskId);
    }
    setExpandedRows(newExpandedRows);
  };
console.log ('yo yo ', {tasks});
  const calculateRemainingDays = (endDate: string): number => {
  // Parse the date in dd/MM/yyyy format with Hebrew locale
  const end = parse(endDate, 'dd/MM/yyyy', new Date(), {locale: he});  
  // Get today's date (set time to 00:00:00 to avoid inconsistencies)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remainingDays = differenceInDays(end, today);
    console.log('calculateRemainingDays', { end, today, remainingDays });
  return Math.max(0, remainingDays);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">משימות מתוזמנות</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          הוסף תרופה תקופתית
        </button>
      </div>

      {isFormOpen && (
        <AddScheduledTaskForm
          taskToEdit={taskToEdit}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תרופה
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                מינון
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ימים שנשארו
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr 
                  onClick={() => toggleRowExpansion(task.id)}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    expandedRows.has(task.id) ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center justify-between">
                      <span>{`${task.taskUser} - ${task.taskLabel}`}</span>
                      <span className="ml-2">
                        {expandedRows.has(task.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.medicine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {`${task.dose} ${task.doseUnits}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.taskEndDate && calculateRemainingDays(task.taskEndDate)}
                  </td>
                  <td className="border p-2">
                   <div className="flex w-full h-full justify-center items-center gap-4">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="hover:bg-gray-100 p-1 rounded-full transition-colors"
                      >
                      <Pencil size={16} className="text-blue-500" />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="hover:bg-gray-100 p-1 rounded-full transition-colors"
                      disabled={isDeleting}
                      >
                      <Trash size={16} className="text-red-500" />
                    </button>
                   </div>
                  </td>
                </tr>
                {expandedRows.has(task.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">מועדים:</p>
                          <p>תאריך התחלה: {formatDate(task.taskStartDate)}</p>
                          <p>מספר ימים: {task.taskDays}</p>
                          <p>תאריך סיום: {task.taskEndDate && formatDate(task.taskEndDate)}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">זמני נטילה:</p>
                          <p>מספר פעמים ביום: {task.timesPerDay}</p>
                          <p>שעות ביום: {task.timeInDay}</p>
                          <p>עם אוכל: {task.withFood}</p>
                        </div>
                        {task.comment && (
                          <div className="col-span-2">
                            <p className="font-semibold mb-2">הערות:</p>
                            <p>{task.comment}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledPage;