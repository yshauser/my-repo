import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, Plus, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { MedicineManager, MedicineGroup } from '../../services/medicineManager';
import AddMedicineForm from '../../Pages/Medicines/AddMedicineForm';
import { Medicine, MedicineType, TargetAudience, SuspensionMedicine, CapletMedicine } from '../../types';

type SortField = 'name' | 'activeIngredient' | 'type' | 'targetAudience';
type SortDirection = 'asc' | 'desc';

export const MedicineManagement = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [expandedMedicine, setExpandedMedicine] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    activeIngredient: '',
    type: '',
    targetAudience: '',
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: 'name', direction: 'asc' });

  const medicineGroups = MedicineManager.getMedicineGroups();

  const handleSave = (medicine: Medicine) => {
    if (editingMedicine) {
      setMedicines(prev => prev.map(med => (med.id === medicine.id ? medicine : med)));
    } else {
      setMedicines(prev => [...prev, { ...medicine, id: Date.now().toString() }]);
    }
    setEditingMedicine(null);
    setIsModalOpen(false);
  };

  const handleEdit = (medicine: Medicine) => {
    console.log('Edit medicine:', medicine);
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id: string, type: string) => {
    const medicines = MedicineManager.findMedicinesGroupsByType (type);  
    try{
    // Remove the medicine with the given id from each group's data array
    const updatedMedicineGroups = medicines
    .flatMap(group => group.data) // Extract all medicines into a flat array
    .filter(med => med.id !== id); // Remove the medicine with the matching ID
    setMedicines(prev => prev.filter(med => med.id !== id));
    console.log('updated medicine:', {id, type, medicines, updatedMedicineGroups});
      await fetch (`/api/saveToJsonFile/`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'medicines',
          data: updatedMedicineGroups,
          type: type,
        })
      });
    }catch (error){
      console.error('Error deleting Medicine', error);
    }
  };


  const getMedicineTypeDisplay = (type: MedicineType) => {
    return type === MedicineType.Suspension ? 'תרחיף' : 'קפליות';
  };

  const getTargetAudienceDisplay = (audience: TargetAudience) => {
    return audience === TargetAudience.Kids ? 'ילדים' : 'מבוגרים';
  };

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = medicineGroups.filter((medicine) => {
      const nameMatch = medicine.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const ingredientMatch = medicine.data[0].activeIngredient
        .toLowerCase()
        .includes(filters.activeIngredient.toLowerCase());
      const typeMatch = getMedicineTypeDisplay(medicine.data[0].type as MedicineType)
        .toLowerCase()
        .includes(filters.type.toLowerCase());
      const audienceMatch = getTargetAudienceDisplay(medicine.data[0].targetAudience as TargetAudience)
        .toLowerCase()
        .includes(filters.targetAudience.toLowerCase());

      return nameMatch && ingredientMatch && typeMatch && audienceMatch;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'activeIngredient':
          comparison = a.data[0].activeIngredient.localeCompare(
            b.data[0].activeIngredient
          );
          break;
        case 'type':
          comparison = getMedicineTypeDisplay(a.data[0].type as MedicineType).localeCompare(
            getMedicineTypeDisplay(b.data[0].type as MedicineType)
          );
          break;
        case 'targetAudience':
          comparison = getTargetAudienceDisplay(a.data[0].targetAudience as TargetAudience).localeCompare(
            getTargetAudienceDisplay(b.data[0].targetAudience as TargetAudience)
          );
          break;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [medicineGroups, filters, sortConfig]);

  return (
    <div className="p-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl text-emerald-600 mb-6 text-center">ניהול תרופות</h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 flex items-center bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
          {/* <Plus size={20} className="mr-2" /> */}
          הוסף תרופה
        </button>

        <AddMedicineForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          editingMedicine={editingMedicine}
          />

        <div className="bg-white rounded-lg shadow">
          {/* Filters */}
          <div className="p-4 grid grid-cols-4 gap-4 border-b">
            <input
              type="text"
              placeholder="סנן לפי שם תרופה"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
              className="p-2 border rounded-md text-right"
            />
            <input
              type="text"
              placeholder="סנן לפי חומר פעיל"
              value={filters.activeIngredient}
              onChange={(e) => setFilters(prev => ({ ...prev, activeIngredient: e.target.value }))}
              className="p-2 border rounded-md text-right"
            />
            <input
              type="text"
              placeholder="סנן לפי סוג תרופה"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="p-2 border rounded-md text-right"
            />
            <input
              type="text"
              placeholder="סנן לפי קהל יעד"
              value={filters.targetAudience}
              onChange={(e) => setFilters(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="p-2 border rounded-md text-right"
            />
          </div>

          <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr className="bg-emerald-100">
                  <th className="p-3 text-right whitespace-nowrap">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleSort('name')}
                    >
                      <span>שם</span>
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="p-3 text-right whitespace-nowrap">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleSort('activeIngredient')}
                    >
                      <span>חומר פעיל</span>
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="p-3 text-right whitespace-nowrap">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleSort('type')}
                    >
                      <span>סוג</span>
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="p-3 text-right whitespace-nowrap">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleSort('targetAudience')}
                    >
                      <span>קהל יעד</span>
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                </tr>
            </thead>
              <tbody>
                {filteredAndSortedMedicines.map((medicine) => (
                  <React.Fragment key={medicine.name}>
                    <tr 
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedMedicine(expandedMedicine === medicine.name ? null : medicine.name)}
                    >
                      <td className="p-3 text-right">
                        <div className="flex items-center gap-2">
                          {expandedMedicine === medicine.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {medicine.name}
                        </div>
                      </td>
                      <td className="p-3 text-right">{medicine.data[0].activeIngredient}</td>
                      <td className="p-3 text-right">{getMedicineTypeDisplay(medicine.data[0].type as MedicineType)}</td>
                      <td className="p-3 text-right">{getTargetAudienceDisplay(medicine.data[0].targetAudience as TargetAudience)}</td>
                    </tr>
                    {expandedMedicine === medicine.name && (
                      <tr>
                        <td colSpan={4} className="p-4 bg-gray-50">
                          <div className="flex justify-end gap-2 mb-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(medicine.data[0]);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-md"
                            >
                              <Edit2 size={20} />
                              <span>עריכה</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(medicine.data[0].id, medicine.data[0].type);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 bg-red-50 rounded-md"
                            >
                              <Trash2 size={20} />
                              <span>מחיקה</span>
                            </button>
                          </div>
                          <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-emerald-100">
                              {medicine.data[0].type === "suspension" ? (
                                <>
                                  <th className="border p-2 text-right">משקל מינימום (ק״ג)</th>
                                  <th className="border p-2 text-right">משקל מקסימום (ק״ג)</th>
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
                            {medicine.data[0].entries.map((item: SuspensionMedicine["entries"][0] | CapletMedicine["entries"][0], index: number) => (
                              <tr key={index} className="hover:bg-gray-100">
                                {medicine.data[0].type === "suspension" ? (
                                  <>
                                    <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_low}</td>
                                    <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).w_high}</td>
                                    <td className="border p-2 text-right">{(item as SuspensionMedicine["entries"][0]).dos}</td>
                                    <td className="border p-2 text-right">
                                      {(item as SuspensionMedicine["entries"][0]).perDay_high === (item as SuspensionMedicine["entries"][0]).perDay_low
                                        ? (item as SuspensionMedicine["entries"][0]).perDay_low
                                        : `${(item as SuspensionMedicine["entries"][0]).perDay_high} - ${(item as SuspensionMedicine["entries"][0]).perDay_low}`}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="border p-2 text-right">{(item as CapletMedicine["entries"][0]).age_low}</td>
                                    <td className="border p-2 text-right">{(item as CapletMedicine["entries"][0]).age_high ? ((item as CapletMedicine["entries"][0]).age_high):('∞')}</td>
                                    <td className="border p-2 text-right">
                                      {(item as CapletMedicine["entries"][0]).dos_high === (item as CapletMedicine["entries"][0]).dos_low
                                        ? (item as CapletMedicine["entries"][0]).dos_low
                                        : `${(item as CapletMedicine["entries"][0]).dos_high} - ${(item as CapletMedicine["entries"][0]).dos_low}`}
                                    </td>
                                    <td className="border p-2 text-right">
                                      {`${(item as CapletMedicine["entries"][0]).hoursInterval_high} - ${(item as CapletMedicine["entries"][0]).hoursInterval_low}`}
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
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineManagement;