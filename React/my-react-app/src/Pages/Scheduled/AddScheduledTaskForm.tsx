//src/pages/Scheduled/AddScheduledTaskForm.tsx

import React from 'react';
import { TaskEntry } from '../../types';

interface AddScheduledTaskFormProps {
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const AddScheduledTaskForm: React.FC<AddScheduledTaskFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">הוספת תרופה תקופתית חדשה</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {/* taskUser */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
          <div>
              <label htmlFor="taskUser" className="block text-sm font-medium text-gray-700 mb-1">
                שם
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
        {/* taskLabel */}
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
        {/* medicine */}
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
        {/* dose */}
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
                  required
                />
              </div>
            </div>
            {/* startDate */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                תאריך התחלה
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                placeholder="dd/mm/yy"
                value={formData.taskStartDate}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Duration */}
            <div>
              <label htmlFor="daysToTake" className="block text-sm font-medium text-gray-700 mb-1">
                מספר ימים לנטילה
              </label>
              <input
                id="daysToTake"
                name="daysToTake"
                type="number"
                value={formData.taskDays}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* timesPerDay */}
            <div>
              <label htmlFor="timesPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                מספר פעמים ביום
              </label>
              <input
                id="timesPerDay"
                name="timesPerDay"
                type="number"
                value={formData.timesPerDay}
                onChange={onInputChange}
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
  );
};

export default AddScheduledTaskForm;
