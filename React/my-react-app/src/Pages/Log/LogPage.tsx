import React, { useState, useMemo, useEffect } from 'react';
import { Trash2, Edit2, CheckCircle, XCircle, ArrowUpDown, Download, Upload, Save, FileX } from 'lucide-react';
import { LogManager } from '../../services/logManager';
import { LogEntry } from '../../types';


interface LogPageProps {
  logData: LogEntry[];
  setLogData: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export const LogPage: React.FC<LogPageProps> = ({ logData, setLogData }) => {
  const [filters, setFilters] = useState({ date: '', name: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEntry, setEditedEntry] = useState<LogEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [loadOption, setLoadOption] = useState('week'); // Default to week

  // Initial load of logs
  useEffect(() => {
        setLogData(logData);
  }, [setLogData]);
  
  // Sort and filter the data
  const sortedAndFilteredData = useMemo(() => {
    let filteredData = [...logData].filter(entry => {
      const dateMatch = !filters.date || entry.logDate.includes(filters.date);
      const nameMatch = !filters.name || entry.kidName.toLowerCase().includes(filters.name.toLowerCase());
      return dateMatch && nameMatch;
    });

    return filteredData.sort((a, b) => {
      const dateA = new Date(`20${a.logDate.split('/').reverse().join('/')} ${a.logHour}`);
      const dateB = new Date(`20${b.logDate.split('/').reverse().join('/')} ${b.logHour}`);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [logData, filters, sortOrder]);

  const filterLogsByDate = (logs: LogEntry[], option: string) => {
    const now = new Date();
    const getDateFromLog = (log: LogEntry) => {
      const [day, month, year] = log.logDate.split('/');
      const [hours, minutes] = log.logHour.split(':');
      return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    };

    return logs.filter(log => {
      const logDate = getDateFromLog(log);
      const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
      switch (option) {
        case '24h': return diffHours <= 24;
        case '48h': return diffHours <= 48;
        case 'week':return diffHours <= 168; // 7 days * 24 hours
        case 'all': return true;
        default:    return true;
      }
    });
  };

  // delete entry from table in page
  const handleDelete = (id: string) => {
      console.log ('Log delete', {setLogData, logData});
      setLogData(prevData =>prevData.filter(entry => entry.id !== id));
  };

  // edit entry from table in page
  const handleEdit = (id: string) => {
    console.log ('Log edit', logData);
    const entryToEdit = logData.find(entry => entry.id === id);
    if (entryToEdit) {
      setEditingId(id);
      setEditedEntry({ ...entryToEdit });
    }
  };

  // save changes of table's entry in page
  const handleSave = async (id: string) => {
    console.log ('Log save', logData);
    if (!editedEntry) return;
    setLogData(prevData => prevData.map(entry => entry.id === id ? { ...editedEntry, id } : entry));
    setEditingId(null);
    setEditedEntry(null);
  };

  // revert changes of table's entry in page
  const handleCancel = () => {
    console.log ('Log cancel', logData);
    setEditingId(null);
    setEditedEntry(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

// File Operations
const handleSaveToFile = async () => {
  try {
    await LogManager.saveLogs(logData);
    alert('data saved successfully');
  } catch (error) {
    alert('Error saving file: ' + error);
  }
};

const handleUpdateFile = async () => {
  try {
    await LogManager.saveLogs(logData);
    alert ('file updated successfully');
  } catch (error) {
    alert('Error updating file: ' + error);
  }
};

const handleLoadFromFile = () => {
  setIsLoadDialogOpen(true);
};

const handleLoadConfirm = async () => {
  try {
    const allData = await LogManager.loadLogs();
    const filteredData = filterLogsByDate(allData, loadOption);
    setLogData(filteredData);
    setIsLoadDialogOpen(false);
    // alert('נתונים נטענו בהצלחה');
  } catch (error) {
    alert('שגיאה בטעינת הנתונים: ' + error);
  }
};

const handleClearFile = async () => {
  if (window.confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים?')) {
    try {
      await LogManager.saveLogs([]);
      setLogData([]);
      alert('הנתונים נמחקו בהצלחה');
    } catch (error) {
      alert('שגיאה במחיקת הנתונים: ' + error);
    }
  }
};

  return (
    <main className="flex-1 flex flex-col p-5 bg-white overflow-auto">
      <h1 className="text-2xl text-emerald-600 mb-6 text-center">יומן</h1>
      
      {/* Filters */}
      <div className="mb-4 justify-center flex gap-4">
        <input
          type="text"
          placeholder="סנן לפי תאריך"
          className="p-2 border rounded text-right"
          value={filters.date}
          onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
        />
        <input
          type="text"
          placeholder="סנן לפי שם"
          className="p-2 border rounded text-right"
          value={filters.name}
          onChange={e => setFilters(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {sortedAndFilteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">
                  <div className="flex items-center justify-center gap-2">
                    תאריך ושעה
                    <button onClick={toggleSortOrder} className="hover:text-emerald-600">
                      <ArrowUpDown size={16} />
                    </button>
                  </div>
                </th>
                <th className="border border-gray-300 p-2">שם</th>
                <th className="border border-gray-300 p-2">חום</th>
                <th className="border border-gray-300 p-2">תרופה</th>
                <th className="border border-gray-300 p-2">מינון</th>
                <th className="border border-gray-300 p-2">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  {editingId === entry.id ? (
                    // Edit mode row
                    <>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="p-1 border rounded w-24 text-right"
                            value={editedEntry?.logDate}
                            onChange={e => setEditedEntry(prev => prev ? { ...prev, logDate: e.target.value } : null)}
                          />
                          <input
                            type="text"
                            className="p-1 border rounded w-16 text-right"
                            value={editedEntry?.logHour}
                            onChange={e => setEditedEntry(prev => prev ? { ...prev, logHour: e.target.value } : null)}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          className="p-1 border rounded w-full text-right"
                          value={editedEntry?.kidName}
                          onChange={e => setEditedEntry(prev => prev ? { ...prev, kidName: e.target.value } : null)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          className="p-1 border rounded w-full text-right"
                          value={editedEntry?.temperature}
                          onChange={e => setEditedEntry(prev => prev ? { ...prev, temperature: e.target.value } : null)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          className="p-1 border rounded w-full text-right"
                          value={editedEntry?.selectedMedicine}
                          onChange={e => setEditedEntry(prev => prev ? { ...prev, selectedMedicine: e.target.value } : null)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          className="p-1 border rounded w-full text-right"
                          value={editedEntry?.actualDosage}
                          onChange={e => setEditedEntry(prev => prev ? { ...prev, actualDosage: e.target.value } : null)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleSave(entry.id)} className="text-emerald-600 hover:text-emerald-700">
                            <CheckCircle size={20} />
                          </button>
                          <button onClick={handleCancel} className="text-red-600 hover:text-red-700">
                            <XCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode row
                    <>
                      <td className="border border-gray-300 p-2 text-center">{entry.logDate} {entry.logHour}</td>
                      <td className="border border-gray-300 p-2 text-center">{entry.kidName}</td>
                      <td className="border border-gray-300 p-2 text-center">{entry.temperature}</td>
                      <td className="border border-gray-300 p-2 text-center">{entry.selectedMedicine}</td>
                      <td className="border border-gray-300 p-2 text-center">{entry.actualDosage}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(entry.id)} className="text-blue-600 hover:text-blue-700">
                            <Edit2 size={20} />
                          </button>
                          <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">לא נמצאו רשומות</div>
      )}

      {/* Load Dialog */}
      {isLoadDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-right">בחר טווח זמן לטעינה</h2>
            
            <div className="space-y-3">
              {[
                { value: '24h', label: '24 שעות אחרונות' },
                { value: '48h', label: '48 שעות אחרונות' },
                { value: 'week', label: 'שבוע אחרון' },
                { value: 'all', label: 'הכל' }
              ].map((option) => (
                <label 
                  key={option.value} 
                  className="flex items-center justify-end space-x-2 space-x-reverse cursor-pointer"
                >
                  <span className="text-right">{option.label}</span>
                  <input
                    type="radio"
                    name="loadOption"
                    value={option.value}
                    checked={loadOption === option.value}
                    onChange={(e) => setLoadOption(e.target.value)}
                    className="ml-2"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleLoadConfirm}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                טען
              </button>
              <button
                onClick={() => setIsLoadDialogOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Operations Buttons */}
      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={handleSaveToFile}
          className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          <Save size={16} />
          שמור לקובץ
        </button>
        <button
          onClick={handleUpdateFile}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Upload size={16} />
          עדכן קובץ
        </button>
        <button
          onClick={handleLoadFromFile}
          className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <Download size={16} />
          טען מקובץ
        </button>
        <button
          onClick={handleClearFile}
          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FileX size={16} />
          נקה קובץ
        </button>
      </div>
    </main>
  );
};

export default LogPage; 