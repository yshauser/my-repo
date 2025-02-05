import React, { useEffect } from 'react';
import { TaskEntry } from '../../types';
import {formatDate} from '../../services/TaskManager';

interface AddScheduledTaskFormProps {
  taskToEdit?: TaskEntry | null;
  formData: {
    taskUser: string;
    taskLabel: string;
    taskStartDate: string;
    taskEndDate: string;
    taskDays: number;
    timesPerDay: number;
    timeInDay: string;
    dose: number;
    doseUnits: string;
    medicine: string;
    withFood: string;
    comment: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const AddScheduledTaskForm: React.FC<AddScheduledTaskFormProps> = ({
    taskToEdit,
    formData,
    onInputChange,
    onSubmit,
    onClose,
}) => {

// Populate form when editing
useEffect(() => {
    if (taskToEdit) {
        
        // Your parent component should handle this now through the formData prop
        // Just keeping the useEffect to show where you'd add any additional edit-specific logic
    }
    }, [taskToEdit]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
            {taskToEdit ? 'עריכת תרופה תקופתית' : 'הוספת תרופה תקופתית חדשה'}
          </h2>          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="taskUser" className="block text-sm font-medium text-gray-700 mb-1">
                משתמש
              </label>
              <input
                id="taskUser"
                name="taskUser"
                type="text"
                value={formData.taskUser}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="taskLabel" className="block text-sm font-medium text-gray-700 mb-1">
                תווית משימה
              </label>
              <input
                id="taskLabel"
                name="taskLabel"
                type="text"
                value={formData.taskLabel}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-1">
                שם התרופה
              </label>
              <input
                id="medicine"
                name="medicine"
                type="text"
                value={formData.medicine}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="dose" className="block text-sm font-medium text-gray-700 mb-1">
                  מינון
                </label>
                <input
                  id="dose"
                  name="dose"
                  type="text"
                  value={formData.dose}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="doseUnits" className="block text-sm font-medium text-gray-700 mb-1">
                  יחידות
                </label>
                <input
                  id="doseUnits"
                  name="doseUnits"
                  type="text"
                  value={formData.doseUnits}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                //   required
                />
              </div>
            </div>

            <div>
              <label htmlFor="taskStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                תאריך התחלה
              </label>
              <input
                id="taskStartDate"
                name="taskStartDate"
                type="date"
                value={formData.taskStartDate}
                onChange={onInputChange}
                // min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rtl"
                required
              />
            </div>

            <div>
              <label htmlFor="taskDays" className="block text-sm font-medium text-gray-700 mb-1">
                מספר ימים לנטילה
              </label>
              <input
                id="taskDays"
                name="taskDays"
                type="number"
                min="1"
                value={formData.taskDays}
                onChange={onInputChange}
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
                min="1"
                value={formData.timesPerDay}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="timeInDay" className="block text-sm font-medium text-gray-700 mb-1">
                שעות ביום
              </label>
              <input
                id="timeInDay"
                name="timeInDay"
                type="text"
                value={formData.timeInDay}
                onChange={onInputChange}
                placeholder="לדוגמה: 8:00, 14:00, 20:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="withFood" className="block text-sm font-medium text-gray-700 mb-1">
                עם אוכל
              </label>
              <select
                id="withFood"
                name="withFood"
                value={formData.withFood}
                onChange={onInputChange}
                className="w-full p-2 border rounded"
                 >
                <option value="לא משנה"> לא משנה</option>
                <option value="לפני האוכל">לפני האוכל</option>
                <option value="עם האוכל">עם או אחרי האוכל</option>
            </select>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                הערות
              </label>
              <input
                id="comment"
                name="comment"
                type="text"
                value={formData.comment}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              {taskToEdit ? 'עדכן' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduledTaskForm;