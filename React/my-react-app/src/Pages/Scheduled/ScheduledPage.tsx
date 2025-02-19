import React, { useState, useEffect } from 'react';
import { TaskManager, formatDateForUI, formatDateForCalc } from '../../services/TaskManager';
import { TaskEntry } from '../../types';
import TaskCalendar from './TaskCalendar';
import AddScheduledTaskForm from './AddScheduledTaskForm';
import { CalendarCheck, ChevronDown, ChevronUp,Pencil, Trash } from 'lucide-react';

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
  withFood: 'לא משנה',
  comment: '',
};


const ScheduledPage = () => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskEntry>();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState(initialFormData);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskEntry | null>(null);

  const handleEditTask = (task: TaskEntry) => {
    setTaskToEdit(task);
    if (!task.doseUnits){task.doseUnits = ''}
    if (!task.withFood){task.withFood = 'לא משנה'}
    if (!task.comment){task.comment = ''}
    const startDate = new Date(formatDateForCalc(task.taskStartDate));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + task.taskDays);
    console.log ('handle Edit', {startDate, endDate, task, taskToEdit})
    setFormData({
      taskUser: task.taskUser,
      taskLabel: task.taskLabel,
      taskStartDate: formatDateForUI(task.taskStartDate),
      taskEndDate: formatDateForUI(endDate.toString()),
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

  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await TaskManager.loadTasks();
      console.log ('ScheduledPage use effect loaded tasks', {loadedTasks});
      setTasks(loadedTasks);
    };
    fetchTasks().catch(error => console.error('Error in useEffect fetchTasks:', error));
  }, []);

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

  const handleUpdateTask = async (taskId: string, updatedData: Partial<TaskEntry>) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedData } : task
      );
      setTasks(updatedTasks);
      await saveTasksToFile(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log ('is delete task', {taskId, tasks});
      const updatedTasksData = tasks.filter(task => task.id !== taskId);
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
    } catch (error) {
      console.error('Error deleting task:', error);
      // You might want to show an error notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskCalendar = (task: TaskEntry) => {
    // Open the calendar modal or component
    console.log('handleTaskCalendar', {task});
    setShowCalendar(true);
    setSelectedTask(task); // Set the task in state to show the calendar for that task
  };
  const closeCalendar = () => {
    setShowCalendar(false); // Close the calendar when the user is done
  };

  const handleSubmit = async () => {
    const startDate = new Date (formatDateForCalc(formData.taskStartDate));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + formData.taskDays-1);
     console.log ('handle submit', {startDate, endDate}, formData.taskDays)
    if (taskToEdit) {
      // If editing, maintain the same ID
      const updatedTask: TaskEntry = {
        ...formData,
        id: taskToEdit.id,
        taskStartDate: formatDateForUI(startDate.toString()),
        taskEndDate: formatDateForUI(endDate.toString())
      };
      const updatedTasks = tasks.map(task => 
        task.id === taskToEdit.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      await saveTasksToFile(updatedTasks);
    } else {
      const newTask: TaskEntry = {
      id: Date.now().toString(),
      ...formData,
      taskStartDate: formatDateForUI(startDate.toString()),
      taskEndDate: formatDateForUI(endDate.toString())
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasksToFile(updatedTasks);
      // console.log ('submit new',{updatedTasks})
    }
    setIsFormOpen(false);
    handleClose();

  };
 
  const handleClose = () => {
    setIsFormOpen(false);
    setTaskToEdit(undefined);
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

  const calculateRemainingDays = (endDate: string): number => {
  if (!endDate) return 0;
  const [day, month, year] = endDate.split('/');
  const end = new Date(Number(year), Number(month) - 1, Number(day));
 
  // Get today's date (set time to 00:00:00 to avoid inconsistencies)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, remainingDays);
  };

  const handleTaskDataChange = (data: Partial<TaskEntry>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  
  return (
    <div className="flex-1 flex flex-col p-4 bg-white overflow-auto">

      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">משימות מתוזמנות</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          הוסף תרופה תקופתית
        </button>
      </div>

      <AddScheduledTaskForm
        isOpen={isFormOpen}
        isEditMode={isEditMode}
        formData={formData}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onTaskDataChange={handleTaskDataChange}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-1 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעולות
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תרופה
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
                  <td className="border p-2">
                   <div className="flex w-full h-full justify-center items-center gap-4">
                    <button 
                      onClick={() => handleTaskCalendar(task)}
                      className="hover:bg-gray-100 p-1 rounded-full transition-colors"
                      >
                      <CalendarCheck size={16} className="text-blue-500" />
                    </button>
                    {showCalendar && selectedTask && (
                      <div>
                          <h2 className="text-xl font-semibold mb-4 text-center">בחר תאריך</h2>
                          <TaskCalendar 
                            task={selectedTask}
                            onClose={closeCalendar}
                            onUpdateTask={handleUpdateTask}
                          />
                      </div>
                    )}
                   </div>
                  </td>
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
                </tr>
                {expandedRows.has(task.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        
                        <div className="flex flex-col items-right gap-2">
                          <p className="font-semibold mb-2">פעולות נוספות:</p>
                          <div className="flex gap-4">
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
                        </div>

                        <div>
                          <p className="font-semibold mb-2">מועדים:</p>
                          <p>מ: {formatDateForUI(task.taskStartDate)}</p>
                          <p>עד: {task.taskEndDate && formatDateForUI(task.taskEndDate)}</p>
                          <p>סך הכל <strong>{task.taskDays}</strong> ימים</p>
                          <p>נשארו <strong>{task.taskEndDate && calculateRemainingDays(task.taskEndDate)}</strong> ימים</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">זמני נטילה:</p>
                          <p>מינון: <strong>{task.dose}</strong>{task.doseUnits ? ` ${task.doseUnits}` : ''}</p>
                          <p>פעמים ביום: <strong>{task.timesPerDay}</strong></p>
                          <p>{task.timeInDay === "" ? "" : <strong>{task.timeInDay}</strong>}</p>
                          <p>{task.withFood === "לא משנה" ? "אין קשר לאוכל" : task.withFood}</p>
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