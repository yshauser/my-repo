import React, { useState } from 'react';
import { Medicine, SuspensionMedicine, CapletMedicine } from './medicinesData';
import { MedicineManager, MedicineGroup } from './medicineManager';

const Page_Medicines = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineGroup | null>(null);

  return (
    <main className="flex-1 flex flex-col p-4 bg-white overflow-auto">
      <h1 className="text-2xl text-emerald-600 mb-6 text-center">תרופות</h1>

      {/* Medicine List */}
      {!selectedMedicine && (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          {MedicineManager.medicineGroups.map((medicineGroup) => (
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
                      {MedicineManager.hasEqualValues(selectedMedicine.data, 'w_low', 'w_high') ? (
                        <th className="border p-2 text-right">משקל (ק״ג)</th>
                      ) : (
                        <>
                          <th className="border p-2 text-right">משקל מינימום (ק״ג)</th>
                          <th className="border p-2 text-right">משקל מקסימום (ק״ג)</th>
                        </>
                      )}
                      <th className="border p-2 text-right">מינון (מ״ל)</th>
                      <th className="border p-2 text-right">פעמים ביום</th>
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
                          {MedicineManager.hasEqualValues(selectedMedicine.data, 'w_low', 'w_high') ? (
                            <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_low}</td>
                          ) : (
                            <>
                              <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_low}</td>
                              <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_high}</td>
                            </>
                          )}
                          <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).dos}</td>
                          {MedicineManager.hasEqualValues(selectedMedicine.data, 'perDay_low', 'perDay_high') ? (
                            <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).perDay_low}</td>
                          ) : (
                            <>
                              <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).perDay_high} - {(item as SuspensionMedicine["entries"][0]).perDay_low}</td>
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