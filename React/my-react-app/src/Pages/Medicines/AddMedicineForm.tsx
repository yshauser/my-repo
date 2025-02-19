import React, { useState, useEffect } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import {Medicine, MedicineType, TargetAudience, SuspensionEntry, SuspensionMedicine, CapletEntry, CapletMedicine} from '../../types';
import { constrainPoint } from '@fullcalendar/core/internal';

interface AddMedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
  editingMedicine: Medicine | null;
}

const createEmptySuspensionEntry = (): SuspensionEntry => ({
  w_low: 0,
  w_high: 0,
  dos: 0,
  perDay_low: 0,
  perDay_high: 0,
  maxDay: 0,
  maxDayPerKg: 0
});

const createEmptyCapletEntry = (): CapletEntry => ({
  age_low: 0,
  age_high: undefined,
  dos_low: 0,
  dos_high: 0,
  hoursInterval_low: 0,
  hoursInterval_high: 0,
  maxDay: 0
});

const createEmptySuspensionMedicine = (id: string): SuspensionMedicine => ({
  id,
  type: MedicineType.Suspension,
  name: '',
  hebName: '',
  activeIngredient: '',
  targetAudience: TargetAudience.Kids,
  concentration: '',
  entries: [createEmptySuspensionEntry()]
});

const createEmptyCapletMedicine = (id: string): CapletMedicine => ({
  id,
  type: MedicineType.Caplets,
  name: '',
  hebName: '',
  activeIngredient: '',
  targetAudience: TargetAudience.Kids,
  strength: '',
  entries: [createEmptyCapletEntry()]
});

export const AddMedicineForm: React.FC<AddMedicineFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMedicine
  }) => {
  // const [medicineType, setMedicineType] = useState<MedicineType>(MedicineType.Suspension);
  const [formData, setFormData] = useState<Medicine>(createEmptySuspensionMedicine(generateId()));
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: '' });

  useEffect(() => {
    if (editingMedicine) {
      setFormData(editingMedicine);
    }
  },[editingMedicine]);

  // Function to generate a unique ID
  function generateId() {
      return 'med_' + Date.now().toString();
  }
  
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:value
    }));
  };

  const handleMedicineTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as MedicineType;
    // Reset form data with appropriate type specific fields
    setFormData(
      newType === MedicineType.Suspension
      ? createEmptySuspensionMedicine(generateId())
      : createEmptyCapletMedicine (generateId())
    );
  };

  const handleEntryChange = (index: number, field: string, value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => {
      if (prev.type === MedicineType.Suspension){
        const medicine = prev as SuspensionMedicine;
        const newEntries = [...prev.entries];
      newEntries[index] = {
        ...newEntries[index],
        [field]: numValue
      };
        return { ...medicine, entries: newEntries };
      }else{
        const medicine = prev as CapletMedicine;
        const newEntries = [...prev.entries];
        newEntries[index] = {
        ...newEntries[index],
        [field]: numValue
      };
       return { ...medicine, entries: newEntries };
      }
    });
  };

  const addEntry = () => {
    setFormData(prev => {
      if (prev.type === MedicineType.Suspension){
        const medicine = prev as SuspensionMedicine;
        return { ...medicine, entries: [...medicine.entries, createEmptySuspensionEntry()]};
      } else {
        const medicine = prev as CapletMedicine;
        return { ...medicine, entries: [...medicine.entries, createEmptyCapletEntry()]};
      }
    });
  };

  const removeEntry = (index: number) => {
    setFormData(prev => {
      if (prev.type === MedicineType.Suspension){
        const medicine = prev as SuspensionMedicine;
        return { ...medicine, entries: medicine.entries.filter((_, i) => i !== index)};
      } else {
        const medicine = prev as CapletMedicine;
        return { ...medicine, entries: medicine.entries.filter((_, i) => i !== index)};;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log ('handle submit', {formData});
    try {
      await fetch('/api/saveToJsonFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: formData,
          filename: 'medicines',
          type: formData.type
        })
      });
      
      setSubmitStatus({ success: true, error: '' });
      onSave(formData);

      // Reset form with appropriate type
      setFormData(
        formData.type === MedicineType.Suspension
        ? createEmptySuspensionMedicine(generateId())
        : createEmptyCapletMedicine (generateId())
      );    
    } catch (error) {
      if (error instanceof Error) {
        setSubmitStatus({ success: false, error: error.message });
      } else {
        setSubmitStatus({ success: false, error: 'An unknown error occurred' });
      }    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-emerald-600">
          {editingMedicine ? 'עריכת תרופה' : 'הוספת תרופה חדשה'}
        </h2>

      {submitStatus.success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>התרופה נוספה בהצלחה!</span>
          </div>
        </div>
      )}
      
      {submitStatus.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>שגיאה: {submitStatus.error}</span>
            </div>
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <select
            value={formData.type}
            onChange={handleMedicineTypeChange}
            className="w-full p-2 border rounded"
          >
            <option value="suspension">תרחיף</option>
            <option value="caplets">קפליות</option>
          </select>

          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border rounded"
            required
            >
              <option value="ילדים">ילדים</option>
              <option value="מבוגרים">מבוגרים</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="שם באנגלית"
            value={formData.name}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="hebName"
            placeholder="שם בעברית"
            value={formData.hebName}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="activeIngredient"
            placeholder="חומר פעיל"
            value={formData.activeIngredient}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border rounded"
            required
          />

          {formData.type === 'suspension' ? (
            <input
              type="text"
              name="concentration"
              placeholder="ריכוז (לדוגמה: 20mg/1ml)"
              value={formData.concentration}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          ) : (
            <input
              type="text"
              name="strength"
              placeholder="חוזק (לדוגמה: 500mg)"
              value={formData.strength}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">מינונים</h3>
            <button
              type="button"
              onClick={addEntry}
              className="p-2 text-emerald-600 hover:text-emerald-700"
            >
              <Plus size={20} />
            </button>
          </div>

          {formData.entries.map((entry, index) => (
            <div key={index} className="p-4 border rounded space-y-4">
              {formData.type === 'suspension' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="משקל מינימום"
                      value={formData.entries[0].w_low || ''}
                      onChange={(e) => handleEntryChange(index, 'w_low', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="משקל מקסימום"
                      value={formData.entries[0].w_high || ''}
                      onChange={(e) => handleEntryChange(index, 'w_high', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="מינון (מ״ל)"
                      value={formData.entries[0].dos || ''}
                      onChange={(e) => handleEntryChange(index, 'dos', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="מינימום ליום"
                        value={formData.entries[0].perDay_low || ''}
                        onChange={(e) => handleEntryChange(index, 'perDay_low', e.target.value)}
                        className="p-2 border rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="מקסימום ליום"
                        value={formData.entries[0].perDay_high || ''}
                        onChange={(e) => handleEntryChange(index, 'perDay_high', e.target.value)}
                        className="p-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="גיל מינימום"
                      value={formData.entries[0].age_low || ''}
                      onChange={(e) => handleEntryChange(index, 'age_low', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="גיל מקסימום"
                      value={formData.entries[0].age_high || ''}
                      onChange={(e) => handleEntryChange(index, 'age_high', e.target.value)}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="מינון מינימום"
                        value={formData.entries[0].dos_low || ''}
                        onChange={(e) => handleEntryChange(index, 'dos_low', e.target.value)}
                        className="p-2 border rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="מינון מקסימום"
                        value={formData.entries[0].dos_high || ''}
                        onChange={(e) => handleEntryChange(index, 'dos_high', e.target.value)}
                        className="p-2 border rounded"
                        required
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="מקסימום ליום"
                      value={entry.maxDay || ''}
                      onChange={(e) => handleEntryChange(index, 'maxDay', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="שעות מינימום בין מינונים"
                      value={formData.entries[0].hoursInterval_low || ''}
                      onChange={(e) => handleEntryChange(index, 'hoursInterval_low', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="שעות מקסימום בין מינונים"
                      value={formData.entries[0].hoursInterval_high || ''}
                      onChange={(e) => handleEntryChange(index, 'hoursInterval_high', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                </>
              )}
              
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Minus size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white p-3 rounded hover:bg-emerald-700 transition-colors"
          >
          {editingMedicine ? 'שמור שינויים' : 'הוסף תרופה'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddMedicineForm;