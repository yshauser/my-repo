import React, { useState, useEffect } from 'react';

type ScheduledTask = {
  id: number;
  taskLabel: string;
  medicineName: string;
  dose: string;
  startDate: string;
  daysToTake: number;
  timesPerDay: number;
};


const ScheduledPage = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    taskLabel: '',
    medicineName: '',
    dose: '',
    startDate: '',
    daysToTake: 0,
    timesPerDay: 0
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

  const saveTasksToStorage = (updatedTasks: ScheduledTask[]) => {
    localStorage.setItem('scheduledTasks', JSON.stringify(updatedTasks));
  };

  const saveTasksToFile = async (updatedTasks: ScheduledTask[]) => {
    // try {
    //   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedTasks, null, 2));
    // } 
    console.log ('Schedule page - save Task', {updatedTasks});
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
    }catch (error) {
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
    const newTask: ScheduledTask = {
      id: Date.now(),
      ...formData,
      startDate: formData.startDate // Store original date value
    };
    // setTasks(prev => [...prev, newTask]);
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    console.log('scheduledTasks', {updatedTasks});
    await saveTasksToFile(updatedTasks);
    setIsDialogOpen(false);
    setFormData({
      taskLabel: '',
      medicineName: '',
      dose: '',
      startDate: '',
      daysToTake: 0,
      timesPerDay: 0
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

      {/* Modal/Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">הוספת תרופה תקופתית חדשה</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="taskLabel" className="block text-sm font-medium text-gray-700 mb-1">
                    תווית משימה
                  </label>
                  <input
                    id="taskLabel"
                    name="taskLabel"
                    type="text"
                    value={formData.taskLabel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 mb-1">
                    שם התרופה
                  </label>
                  <input
                    id="medicineName"
                    name="medicineName"
                    type="text"
                    value={formData.medicineName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dose" className="block text-sm font-medium text-gray-700 mb-1">
                    מינון
                  </label>
                  <input
                    id="dose"
                    name="dose"
                    type="text"
                    value={formData.dose}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    תאריך התחלה
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    placeholder="dd/mm/yy"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="daysToTake" className="block text-sm font-medium text-gray-700 mb-1">
                    מספר ימים לנטילה
                  </label>
                  <input
                    id="daysToTake"
                    name="daysToTake"
                    type="number"
                    value={formData.daysToTake}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timesPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                    מספר פעמים ביום
                  </label>
                  <input
                    id="timesPerDay"
                    name="timesPerDay"
                    type="number"
                    value={formData.timesPerDay}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                שמור
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.medicineName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.dose}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(task.startDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.daysToTake}</td>
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