import React, { useState } from 'react';
import { Medicine, NurofenKids, NovimolTipTipot } from './medicinesData';


// Define a type for our medicine groups
type MedicineGroup = {
  name: string;
  data: Medicine[];
};

const Page_Medicines = () => {
  // State for selected medicine group
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineGroup | null>(null);

  // Define our medicine groups
  const medicineGroups: MedicineGroup[] = [
    { name: 'נורופן לילדים', data: NurofenKids },
    { name: 'נובימול טיפטיפות', data: NovimolTipTipot },
  ];

  // Helper function to check if all items in the data have equal low and high values
  const hasEqualValues = (data: Medicine[], key1: 'w_low' | 'perDay_low', key2: 'w_high' | 'perDay_high'): boolean => {
    return data.every(item => item[key1] === item[key2]);
  };

  return (
    <main className="flex-1 flex flex-col p-4 bg-white overflow-auto">
      <h1 className="text-2xl text-emerald-600 mb-6 text-center">תרופות</h1>

      {/* Medicine List */}
      {!selectedMedicine && (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          {medicineGroups.map((medicine) => (
            <button
              key={medicine.name}
              onClick={() => setSelectedMedicine(medicine)}
              className="bg-emerald-600 text-white p-4 rounded-lg shadow-md hover:bg-emerald-700 transition-colors text-right"
            >
              {medicine.name}
            </button>
          ))}
        </div>
      )}

      {/* Medicine Details Table */}
      {selectedMedicine && (
        <div className="w-full">
          <button
            onClick={() => setSelectedMedicine(null)}
            className="mb-4 text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
          >
            <span>←</span> חזור לרשימה
          </button>

          <h2 className="text-xl text-emerald-600 mb-4">{selectedMedicine.name}</h2>
          
          <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-emerald-100">
                  {hasEqualValues(selectedMedicine.data, 'w_low', 'w_high') ? (
                    <th className="border p-2 text-right">משקל (ק״ג)</th>
                  ) : (
                    <>
                      <th className="border p-2 text-right">משקל מינימום (ק״ג)</th>
                      <th className="border p-2 text-right">משקל מקסימום (ק״ג)</th>
                    </>
                  )}
                  <th className="border p-2 text-right">מינון (מ״ל)</th>
                  {hasEqualValues(selectedMedicine.data, 'perDay_low', 'perDay_high') ? (
                    <th className="border p-2 text-right">פעמים ביום</th>
                  ) : (
                    <>
                      <th className="border p-2 text-right">מינימום פעמים ביום</th>
                      <th className="border p-2 text-right">מקסימום פעמים ביום</th>
                    </>
                  )}
                  {/* <th className="border p-2 text-right">מקסימום מ״ל ליום</th>
                  <th className="border p-2 text-right">מקסימום מ״ל ליום לק״ג</th> */}
                </tr>
              </thead>
              <tbody>
                {selectedMedicine.data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {hasEqualValues(selectedMedicine.data, 'w_low', 'w_high') ? (
                      <td className="border p-2 text-right">{item.w_low}</td>
                    ) : (
                      <>
                        <td className="border p-2 text-right">{item.w_low}</td>
                        <td className="border p-2 text-right">{item.w_high}</td>
                      </>
                    )}
                    <td className="border p-2 text-right">{item.dosMl}</td>
                    {hasEqualValues(selectedMedicine.data, 'perDay_low', 'perDay_high') ? (
                      <td className="border p-2 text-right">{item.perDay_low}</td>
                    ) : (
                      <>
                        <td className="border p-2 text-right">{item.perDay_low}</td>
                        <td className="border p-2 text-right">{item.perDay_high}</td>
                      </>
                    )}
                    {/* <td className="border p-2 text-right">{item.maxMlDay}</td>
                    <td className="border p-2 text-right">{item.maxMlDayPerKg}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page_Medicines;