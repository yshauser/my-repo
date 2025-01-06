import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface Entry {
  w_low?: number;
  w_high?: number;
  dos?: number;
  perDay_low?: number;
  perDay_high?: number;
  maxDayPerKg?: number;
  age_low?: number;
  age_high?: number;
  dos_low?: number;
  dos_high?: number;
  hoursInterval_low?: number;
  hoursInterval_high?: number;
  maxDay?: number;
}

const AddMedicineForm = () => {
  const [medicineType, setMedicineType] = useState('suspension');
  const [formData, setFormData] = useState<{
    id: string;
    type: string;
    name: string;
    hebName: string;
    activeIngredient: string;
    targetAudiance: string;
    concentration: string;
    strength: string;
    entries: Entry[];
  }>({
    id: generateId(),
    type: 'suspension',
    name: '',
    hebName: '',
    activeIngredient: '',
    targetAudiance: 'ילדים',
    concentration: '',
    strength: '',
    entries: [{} as Entry] // Initialize with an empty Entry object
  });
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: '' });

  // Function to generate a unique ID
  function generateId() {
    // return 'med_' + Math.random().toString(36).substr(2, 9);
    return 'med_' + Date.now().toString();
  }
  
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleMedicineTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setMedicineType(newType);
    setFormData(prev => ({
      ...prev,
      type: newType
    }));
  };

  const handleEntryChange = (index: number, field: string, value: number|string) => {
    setFormData(prev => {
      const newEntries = [...prev.entries];
      newEntries[index] = {
        ...newEntries[index],
        [field]: typeof value === 'string' ? parseFloat(value) || value : value      };
      return { ...prev, entries: newEntries };
    });
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, {}]
    }));
  };

  const removeEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index)
    }));
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
          type: medicineType
        })
      });
      
      setSubmitStatus({ success: true, error: '' });
      // Reset form with new ID
      setFormData({
        id: generateId(),
        type: medicineType,
        name: '',
        hebName: '',
        activeIngredient: '',
        targetAudiance: '',
        concentration: '',
        strength: '',
        entries: [{}]
      });
    } catch (error) {
      if (error instanceof Error) {
        setSubmitStatus({ success: false, error: error.message });
      } else {
        setSubmitStatus({ success: false, error: 'An unknown error occurred' });
      }    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-600">הוספת תרופה חדשה</h2>
      
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
            value={medicineType}
            onChange={handleMedicineTypeChange}
            className="w-full p-2 border rounded"
          >
            <option value="suspension">תרחיף</option>
            <option value="caplets">קפליות</option>
          </select>

          <select
            name="targetAudiance"
            value={formData.targetAudiance}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border rounded"
            required
            >
              <option value="ילדים">ילדים</option>
              <option value="מבוגרים">מבוגרים</option>
          </select>

          {/* <input
            type="text"
            name="id"
            placeholder="מזהה (ID)"
            value={formData.id}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border rounded"
            required
          /> */}

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

          {medicineType === 'suspension' ? (
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
              {medicineType === 'suspension' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="משקל מינימום"
                      value={entry.w_low || ''}
                      onChange={(e) => handleEntryChange(index, 'w_low', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="משקל מקסימום"
                      value={entry.w_high || ''}
                      onChange={(e) => handleEntryChange(index, 'w_high', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="מינון (מ״ל)"
                      value={entry.dos || ''}
                      onChange={(e) => handleEntryChange(index, 'dos', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="מינימום ליום"
                        value={entry.perDay_low || ''}
                        onChange={(e) => handleEntryChange(index, 'perDay_low', e.target.value)}
                        className="p-2 border rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="מקסימום ליום"
                        value={entry.perDay_high || ''}
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
                      value={entry.age_low || ''}
                      onChange={(e) => handleEntryChange(index, 'age_low', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="גיל מקסימום"
                      value={entry.age_high || ''}
                      onChange={(e) => handleEntryChange(index, 'age_high', e.target.value)}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="מינון מינימום"
                        value={entry.dos_low || ''}
                        onChange={(e) => handleEntryChange(index, 'dos_low', e.target.value)}
                        className="p-2 border rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="מינון מקסימום"
                        value={entry.dos_high || ''}
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
                      value={entry.hoursInterval_low || ''}
                      onChange={(e) => handleEntryChange(index, 'hoursInterval_low', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="שעות מקסימום בין מינונים"
                      value={entry.hoursInterval_high || ''}
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
          הוסף תרופה
        </button>
      </form>
    </div>
  );
};

export default AddMedicineForm;