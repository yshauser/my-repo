import React, { useState } from 'react';
import { Medicine, NurofenKids, NovimolTipTipot, Acamol500, Ibufen200, Ibufen400 } from './medicinesData';

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
    { name: 'נורופן לילדים', data: [NurofenKids] },
    { name: 'נובימול טיפטיפות', data: [NovimolTipTipot] },
    { name: 'אקמול 500', data: [Acamol500] },
    { name: 'איבופרופן 200', data: [Ibufen200] },
    { name: 'איבופרופן 400', data: [Ibufen400] },
  ];

  // Helper function to check if all items in the data have equal low and high values for suspension medicines
  const hasEqualValues = (data: Medicine[], key1: string, key2: string): boolean => {
    return data.every(item => item[key1] === item[key2]);
  };

  return (
    <main className="flex-1 flex flex-col p-4 bg-white overflow-auto">
      <h1 className="text-2xl text-emerald-600 mb-6 text-center">תרופות</h1>

      {/* Medicine List */}
      {!selectedMedicine && (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          {medicineGroups.map((medicineGroup) => (
            <button
              key={medicineGroup.name}
              onClick={() => setSelectedMedicine(medicineGroup)}
              className="bg-emerald-600 text-white p-4 rounded-lg shadow-md hover:bg-emerald-700 transition-colors text-right"
            >
              {medicineGroup.name}
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
                  {selectedMedicine.data[0].type === "suspension" ? (
                    <>
                      <th className="border p-2 text-right">משקל מינימום (ק״ג)</th>
                      <th className="border p-2 text-right">משקל מקסימום (ק״ג)</th>
                      <th className="border p-2 text-right">מינון (מ״ל או מ"ג)</th>
                      <th className="border p-2 text-right">פעמים ביום</th>
                      {/* <th className="border p-2 text-right">מקסימום מ"ל ליום</th> */}
                    </>
                  ) : (
                    <>
                      <th className="border p-2 text-right">גיל מינימום (שנים)</th>
                      <th className="border p-2 text-right">גיל מקסימום (שנים)</th>
                      <th className="border p-2 text-right">מינון (קפליות)</th>
                      <th className="border p-2 text-right">שעות בין מינונים</th>
                      <th className="border p-2 text-right">מקסימום ליום</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedMedicine.data[0].entries.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {selectedMedicine.data[0].type === "suspension" ? (
                      <>
                        <td className="border p-2 text-right">{item.w_low}</td>
                        <td className="border p-2 text-right">{item.w_high}</td>
                        <td className="border p-2 text-right">{item.dos}</td>
                        {item.perDay_high === item.perDay_low ?(
                        <td className="border p-2 text-right">{item.perDay_high}</td>
                        ):(
                        <td className="border p-2 text-right">{item.perDay_high} - {item.perDay_low}</td>
                        )}
                        {/* <td className="border p-2 text-right">{item.maxDay}</td> */}
                      </>
                    ) : (
                      <>
                        <td className="border p-2 text-right">{item.age_low}</td>
                        <td className="border p-2 text-right">{item.age_high}</td>
                        {item.dos_high === item.dos_low ?(
                          <td className="border p-2 text-right">{item.dos_low}</td>
                        ):(
                          <td className="border p-2 text-right">{item.dos_high} - {item.dos_low}</td>
                        )}
                        <td className="border p-2 text-right">{item.hoursInterval_high} - {item.hoursInterval_low}</td>
                        <td className="border p-2 text-right">{item.maxDay}</td>
                      </>
                    )}
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
