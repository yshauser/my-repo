import React, { useState } from 'react';
import { Medicine,SuspensionMedicine,CapletMedicine, NurofenKids, NovimolTipTipot, Acamol500, Ibufen200, Ibufen400 } from './medicinesData';

// Define a type for our medicine groups
type MedicineGroup = {
  name: string;
  data: Medicine[]; // This is an array of Medicine, which is either SuspensionMedicine or CapletMedicine
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
  // const hasEqualValues = (data: Medicine[], key1: string, key2: string): boolean => {
    const hasEqualValues = (data: MedicineGroup["data"], key1: string, key2: string): boolean => {
      if (data.length === 0) return false;
    
      const firstItem = data[0];
    
      if (firstItem.type === "suspension") {
        // Handling for SuspensionMedicine
        return data.every(item => {
          const suspensionItem = item as SuspensionMedicine;
    
          // Check for w_low and w_high in SuspensionMedicine
          if (key1 === "w_low" && key2 === "w_high") {
            return suspensionItem.entries.every(entry => entry[key1] === entry[key2]);
          }
    
          // Check for perDay_low and perDay_high in SuspensionMedicine
          if (key1 === "perDay_low" && key2 === "perDay_high") {
            return suspensionItem.entries.every(entry => entry[key1] === entry[key2]);
          }
    
          return true;
        });
      } else if (firstItem.type === "caplets") {
        // Handling for CapletMedicine
        return data.every(item => {
          const capletItem = item as CapletMedicine;
    
          // Check for dos_low and dos_high in CapletMedicine
          if (key1 === "dos_low" && key2 === "dos_high") {
            return capletItem.entries.every(entry => entry[key1] === entry[key2]);
          }
    
          return true;
        });
      }
    
      return false;
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
                     {hasEqualValues(selectedMedicine.data, 'w_low', 'w_high') ? (
                    <th className="border p-2 text-right">משקל (ק״ג)</th>
                    ) : (
                    <>
                      <th className="border p-2 text-right">משקל מינימום (ק״ג)</th>
                      <th className="border p-2 text-right">משקל מקסימום (ק״ג)</th>
                    </>)}
                      <th className="border p-2 text-right">מינון (מ״ל או מ"ג)</th>
                     {hasEqualValues(selectedMedicine.data, 'perDay_low', 'perDay_high') ? (
                    <th className="border p-2 text-right">פעמים ביום</th>
                  ) : (
                    <>
                      <th className="border p-2 text-right">מינימום פעמים ביום</th>
                      <th className="border p-2 text-right">מקסימום פעמים ביום</th>
                    </>
                  )}                      {/* <th className="border p-2 text-right">מקסימום מ"ל ליום</th> */}
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
  {selectedMedicine?.data[0].entries.map((item, index) => (
    <tr key={index} className="hover:bg-gray-50">
      {selectedMedicine.data[0].type === "suspension" ? (
        (item as SuspensionMedicine["entries"][0]) && (
          <>
            {hasEqualValues(selectedMedicine.data, 'w_low', 'w_high') ? (
              <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_low}</td>
            ) : (
              <>
                <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_low}</td>
                <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_high}</td>
              </>
            )}

            <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).dos}</td>

            {hasEqualValues(selectedMedicine.data, 'perDay_low', 'perDay_high') ? (
              <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).perDay_low}</td>
            ) : (
              <>
                <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).perDay_low}</td>
                <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).perDay_high}</td>
              </>
            )}
          </>
        )
      ) : (
        <>
          <td className="border p-2 text-right">{(item as CapletMedicine["entries"][0]).age_low}</td>
          <td className="border p-2 text-right">{(item as CapletMedicine["entries"][0]).age_high}</td>
          {(item as CapletMedicine["entries"][0]).dos_high === (item as CapletMedicine["entries"][0]).dos_low ? (
            <td className="border p-2 text-right">{(item as CapletMedicine["entries"][0]).dos_low}</td>
          ) : (
            <td className="border p-2 text-right">
              {(item as CapletMedicine["entries"][0]).dos_high} - {(item as CapletMedicine["entries"][0]).dos_low}
            </td>
          )}
          <td className="border p-2 text-right">
            {(item as CapletMedicine["entries"][0]).hoursInterval_high} - {(item as CapletMedicine["entries"][0]).hoursInterval_low}
          </td>
          <td className="border p-2 text-right">{(item as CapletMedicine["entries"][0]).maxDay}</td>
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
