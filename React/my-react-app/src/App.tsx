import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Pill, Calendar, Users, Menu, VaultIcon } from 'lucide-react';
import MedicinesPage from './Page-Medicines';
import LogPage from './Page-Log';
import KidsPage from './Page-Kids';
import {NurofenKids, NovimolTipTipot, Acamol500,Ibufen200,Ibufen400,Medicine} from './medicinesData.ts';
import { calculateAge } from './Page-Kids'; // Adjust the path based on your file structure

// interface KidData{
//   KidID: string;
//   Name: string;
//   Weight: number|undefined;
//   Birthdate: string|undefined;
//   Age: number|undefined;
// }

interface KidData {
  [key: string]: string | number | undefined;
}

interface Kid {
  id: string;
  name: string;
  birthDate?: string;
  age?: number;
  weight?: number;
  favoriteMedicine?: string;
}

interface MedicineGroup {
  name: string;
  data: Medicine[];
}

// Define the interface for the props
  interface MedicineDialogProps {
  isOpen: boolean;           // isOpen should be a boolean
  onClose: () => void;       // onClose should be a function with no arguments and no return value
  kidName: string;           // kidName should be a string
  kidWeight: number|undefined;         // kidWeight should be a number
  kidAge: number|undefined;            // kidAge should be a number
}

// Dialog component for medicine administration
const MedicineDialog: React.FC<MedicineDialogProps> = ({ isOpen, onClose, kidName, kidWeight, kidAge }) => {
  const [temperature, setTemperature] = useState('37.0');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [dosage, setDosage] = useState('');

 // Define our medicine groups
 const medicineGroups: MedicineGroup[] = [
  { name: 'נורופן לילדים', data: [NurofenKids] },
  { name: 'נובימול טיפטיפות', data: [NovimolTipTipot] },
  { name: 'אקמול 500', data: [Acamol500] },
  { name: 'איבופרופן 200', data: [Ibufen200] },
  { name: 'איבופרופן 400', data: [Ibufen400] },
];

  console.log ('Yossi App', {medicineGroups});

   // Calculate recommended dosage based on selected medicine and kid's details
   
   const calculateDosage = (medicineName: string) => {
    console.log ('app calc dos', {medicineName}, medicineGroups);
  // Find the group that has the matching medicineName
  const medicineGroup = medicineGroups.find(group => group.name === medicineName);
  console.log('app calc dos group', medicineGroup);

 // If the group is found, use its data to find the medicine
  if (medicineGroup) {
    const medicine = medicineGroup.data[0]; // Assuming each group has only one medicine in its `data`
    console.log('app calc dos med', medicine);

    if (!medicine) return '';


    if (medicine.type === 'suspension') {
      const entry = medicine.entries.find(
        e => kidWeight as number>= e.w_low && kidWeight as number <= e.w_high
      );
      if (entry?.dos) {
        return `${entry.dos} מ"ל`;
      }
    } else if (medicine.type === 'caplets') {
      const entry = medicine.entries.find(
        e => kidAge as number >= e.age_low && (!e.age_high || kidAge as number <= e.age_high)
      );
      console.log('app calc dos caplets', {kidAge, kidName, kidWeight,entry});
      if (entry?.dos_low) {
        if (!entry.dos_high || entry.dos_high === entry.dos_low){
          return `${entry.dos_low} קפליות`;
        }else{
          return  `${entry.dos_low}-${entry.dos_high} קפליות`
        }
      }
    }
  }
    return '';
  };

  useEffect(() => {
    if (selectedMedicine) {
      const recommended = calculateDosage(selectedMedicine);
      setDosage(recommended);
    }
  }, [selectedMedicine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ kidName, temperature, selectedMedicine, dosage });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl mb-4 text-right">מתן תרופה - {kidName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
          <input
              type="number"
              step="0.1"
              min="34"
              max="43"
              className="w-full p-2 border rounded text-right"
              placeholder="חום"
              value={temperature}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= 34 && val <= 43) {
                  setTemperature(e.target.value);
                }
              }}
            />
            <span className="text-sm text-gray-500 mr-2">°C</span>
          </div>
          <div>
          <input
              list="medicines"
              className="w-full p-2 border rounded text-right"
              placeholder="תרופה"
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
            />
            <datalist id="medicines">
              {medicineGroups.map(group => (
                group.data.map(medicine => (
                  <option key={medicine.id} value={group.name} />
                ))
              ))}
            </datalist>
          </div>
          <div>
            <input
              className="w-full p-2 border rounded text-right"
              placeholder="מינון"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
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
      </div>
    </div>
  );
};

// Updated HomePage component
const HomePage = () => {
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kids, setKids] = useState<Kid[]>([]); // Type as Kid[] (array of Kid)

  React.useEffect(() => {
    const loadKids = async () => {
      try {
        const response = await fetch('/db/kids.txt');
        if (!response.ok) throw new Error('Failed to load kids file');
        const text = await response.text();
        const kidBlocks = text.split('// Kid #').filter(block => block.trim());
      
        const parsedKids = kidBlocks.map(block => {
          const lines = block.split('\n').filter(line => line.trim());
          // const kidData: KidData ={};// { KidID: '', Name: '', Weight: undefined, Age: undefined, Birthdate: undefined }; // Initialize with default values
          const kidData: { [key: string]: string } = {};
          lines.forEach(line => {
            const [key, value] = line.split(':').map(part => part.trim());
            if (key && value) {
              kidData[key.replace(' ', '')]=value;
            }
          });
      // Set default values and ensure properties have correct types
      const id = kidData['KidID'] || '';  // Fallback to empty string if undefined
      const name = kidData['Name'] || '';
      const birthDate = kidData['BirthDate'] || '';
      const weight = kidData['Weight'] ? parseFloat(kidData['Weight']) : undefined;
      const age = birthDate ? calculateAge(birthDate) : undefined;
      const favoriteMedicine = kidData['FavoriteMedicine'];

      // Return the final kid object
      return {
        id,
        name,
        birthDate,
        weight,
        age,
        favoriteMedicine
      };
    });
        setKids(parsedKids);
      } catch (error) {
        console.error('Error loading kids:', error);
      }
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
      
      <button className="bg-emerald-600 text-white w-32 h-32 rounded-full shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center text-xl">
        תן תרופה
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
      />
    </main>
  );
};


// Navigation component that will be shared across all pages
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

// Layout component that wraps all pages
const Layout = () => {
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
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogPage />} />
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