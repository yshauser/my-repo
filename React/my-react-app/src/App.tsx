import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Pill, Calendar, Users, Menu } from 'lucide-react';
import MedicinesPage from './Page-Medicines';
import LogPage from './Page-Log';
import KidsPage from './Page-Kids';
import { KidManager } from './kidManager';
import { MedicineManager } from './medicineManager';
import { LogEntry, Kid } from './types';


// Define the interface for the props

interface HomePageProps {
  logData: LogEntry[];
  setLogData: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}
interface MedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  kidName?: string;
  kidWeight?: number | undefined;
  kidAge?: number | undefined;
  logData: LogEntry[];
  setLogData: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  isQuickAdd?: boolean;  // A prop to differentiate between quick add and kid-specific dialog
}

// Dialog component for medicine administration
const MedicineDialog: React.FC<MedicineDialogProps > = ({
    isOpen, onClose, kidName: initialKidName, kidWeight: initialKidWeight, kidAge: initialKidAge, logData, setLogData, isQuickAdd = false }) => {
  const [temperature, setTemperature] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [recommendedDosage, setRecommendedDosage] = useState('');
  const [actualDosage, setActualDosage] = useState('');
  const [kidName, setKidName] = useState(initialKidName || '');
  const [weight, setWeight] = useState(initialKidWeight?.toString() || '');
  const [age, setAge] = useState(initialKidAge?.toString() || '');


  useEffect(() => {
    if (selectedMedicine && weight) {
      const weightNum = parseFloat(weight);
      const ageNum = age ? parseFloat(age) : undefined;
      const recommended = MedicineManager.calculateDosage(selectedMedicine, weightNum, ageNum);
      setRecommendedDosage(recommended);
      
      // Extract the higher value if it's a range, or use the single value
      const match = recommended.match(/(\d+(?:\.\d+)?)/g);
      if (match && match.length > 0) {
          // Get the last number in case it's a range (which will be the higher value)
          const highestValue = match[match.length - 1];
          setActualDosage(highestValue);
        } else {
          setActualDosage('');
        }
      } else {
        setRecommendedDosage('');
        setActualDosage('');
      }
      }, [selectedMedicine, weight, age]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input for better typing experience
    if (value === '') {setTemperature(''); return;}
    // Allow typing decimal point
    if (value === '.') {setTemperature('0.');return;}
    if (value === '3' || value === '4') {setTemperature(value);}
    
    // Parse the number for validation
    const numValue = parseFloat(value);
        
    // Check if it's a valid number and within range
    if (!isNaN(numValue)) {
      if (numValue >= 34 && numValue <= 43) {
        setTemperature(value);
      } else if (value.endsWith('.')) {
        // Allow typing decimal point even if the current number is out of range
        setTemperature(value);
      }
    }
  };
    
  const validateTemperature = () => {
    const numValue = parseFloat(temperature);
    if (!isNaN(numValue) && (numValue < 34 || numValue > 43)) {
      setTemperature('');
    }
  };
      
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const logHour = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    const logDate = String(now.getDate()).padStart(2,'0')+'/'+String(now.getMonth()+1).padStart(2,'0')+'/'+String(now.getFullYear()).slice(-2);
   
    const logEntry: LogEntry = {
      id: crypto.randomUUID(),  
      logDate, logHour, kidName, temperature, selectedMedicine, actualDosage
    };
    setLogData([...logData, logEntry]);
    console.log(' log entry:', {logEntry}); // For debugging
    // console.log(' log attributes:',{ logDate, logHour,kidName, temperature, selectedMedicine, recommendedDosage, actualDosage });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl mb-4 text-right">מתן תרופה{kidName && ` - ${kidName}`}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kid Name field - shown only in quick add mode or if no initial kid name */}
        {(isQuickAdd || !initialKidName) && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full p-2 border rounded text-right"
                  placeholder="שם הילד"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
           {/* Weight field - shown only in quick add mode or if no initial weight */}
           {(isQuickAdd || !initialKidWeight) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">ק"ג</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="150"
                  className="w-full p-2 border rounded text-right"
                  placeholder="משקל"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>
           )}
          {/* Age field - shown only in quick add mode or if no initial age */}
          {(isQuickAdd || !initialKidAge) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">שנים</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="120"
                  className="w-full p-2 border rounded text-right"
                  placeholder="גיל"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </div>
           )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">°C</span>
          <div className="relative flex-1">
              <input
                type="text"  // Changed to text type for better control
                inputMode="decimal"  // Shows numeric keyboard on mobile
                className="w-full p-2 border rounded text-right"
                placeholder="חום"
                value={temperature}
                onChange={handleTemperatureChange}
                onBlur={validateTemperature}  // Validate when focus is lost
                pattern="[0-9]*[.]?[0-9]+"  // Allow only numbers and one decimal point
              />
                {(parseFloat(temperature) < 34 || parseFloat(temperature) > 43) &&
                temperature !== "" ? (
                  'טמפרטורה חייבת להיות בין 34-43') : ('')
                }
            </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500"></span>
          <div className="relative flex-1">
            {/*Only show button when there's content */}
            {selectedMedicine && (
              <button
                type="button"
                className="absolute -right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedMedicine('')}
                aria-label="clear input"
              >
                ×
              </button>
            )}
            <input
              list="medicines"
              className="w-full p-2 border rounded text-right"
              placeholder="תרופה"
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
            />
            <datalist id="medicines">
              {MedicineManager.medicineGroups.map(group => (
                group.data.map(medicine => (
                  <option key={medicine.id} value={group.name} />
                ))
              ))}
            </datalist>
          </div>
        </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 text-right">מינון מומלץ</label>
            <input
              className="w-full p-2 border rounded text-right bg-gray-50"
              value={recommendedDosage}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 text-right">מינון</label>
            <input
              className="w-full p-2 border rounded text-right"
              type="number"
              step="0.5"
              min="0"
              value={actualDosage}
              onChange={(e) => setActualDosage(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              שמור
            </button>
          </div>
        </form>
        {/* <LogPage logData={logData} /> */}
      </div>
    </div>
  );
};

// Updated HomePage component . interfaces defined in the beginning of the page

const HomePage: React.FC<HomePageProps> = ({ logData, setLogData }) => {
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [kids, setKids] = useState<Kid[]>([]);

  useEffect(() => {
    const loadKids = async () => {
      const loadedKids = await KidManager.loadKids();
      setKids(loadedKids);
    };
    loadKids();
  }, []);

  const handleKidClick = (kid: Kid) => {
    setSelectedKid(kid);
    setIsDialogOpen(true);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-xs sm:max-w-md">
        {kids.map(kid => (
          <button
            key={kid.id}
            onClick={() => handleKidClick(kid)}
            className="bg-emerald-600 text-white p-4 rounded-lg shadow-md hover:bg-emerald-700 transition-colors text-center flex-1"
          >
            {kid.name}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => setIsQuickAddOpen(true)}
        className="bg-emerald-600 text-white w-32 h-32 rounded-full shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center text-xl"
      >
        תיעוד תרופה/חום
      </button>

      <MedicineDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedKid(null);
        }}
        kidName={selectedKid?.name ?? ''}
        kidWeight={selectedKid?.weight ?? undefined}
        kidAge={selectedKid?.age ?? undefined}
        logData={logData}
        setLogData={setLogData}
      />
      <MedicineDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        logData={logData}
        setLogData={setLogData}
        isQuickAdd={true}
        />
    </main>
  );
};

// Navigation component
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'בית', path: '/' },
    { icon: Calendar, label: 'יומן', path: '/log' },
    { icon: Pill, label: 'תרופות', path: '/medicines' },
    { icon: Users, label: 'ילדים', path: '/kids' }
  ];

  return (
    <footer className="border-t bg-white">
      <nav className="flex justify-between items-center p-4 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button 
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === path 
                ? 'text-emerald-700 font-medium' 
                : 'text-emerald-600 hover:text-emerald-700'
            }`}
            aria-label={label}
          >
            <Icon size={24} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

// Layout component
const Layout = () => {
  const [logData, setLogData] = useState<LogEntry[]>([]);
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto h-screen flex flex-col shadow-lg">
        <header className="p-4 border-b flex justify-between items-center bg-white">
          <div className="text-emerald-600">שם משתמש</div>
          <div className="text-emerald-600 text-xl font-medium">תרופותי</div>
          <button className="text-emerald-600" aria-label="תפריט">
            <Menu size={24} />
          </button>
        </header>

        <Routes>
          <Route path="/" element={<HomePage logData={logData} setLogData={setLogData} />} />
          <Route path="/log" element={<LogPage logData={logData} setLogData={setLogData}/>} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/kids" element={<KidsPage />} />
        </Routes>

        <Navigation />
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;