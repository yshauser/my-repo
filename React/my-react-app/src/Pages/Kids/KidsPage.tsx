import React, { useState, useEffect } from 'react';
import { Kid } from '../../types.ts';
import { calculateAge, KidManager } from '../../services/kidManager.ts';


export const KidsPage = () => {
  const [kids, setKids] = useState<Kid[]>([]);
  const [newKid, setNewKid] = useState<Partial<Kid>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editKidId, setEditKidId] = useState<string | null>(null);


  // Read kids from txt file and set initial state
  // const loadKids = async () => {
  //   try {
  //     const response = await fetch('/db/kids.txt');
  //     if (!response.ok) throw new Error('Failed to load kids file');
  //     const text = await response.text();
  //     const kidBlocks = text.split('// Kid #').filter(block => block.trim());
  //     const parsedKids = kidBlocks.map(block => {
  //       const lines = block.split('\n').filter(line => line.trim());
  //       const kidData: { [key: string]: string } = {};
  //       lines.forEach(line => {
  //         const [key, value] = line.split(':').map(part => part.trim());
  //         if (key && value) {
  //           kidData[key.replace(' ', '')] = value;
  //         }
  //       });
  //       return {
  //         id: kidData['KidID'],
  //         name: kidData['Name'],
  //         birthDate: kidData['BirthDate'],
  //         weight: parseInt(kidData['Weight']),
  //         favoriteMedicine: kidData['FavoriteMedicine'],
  //         age: calculateAge(kidData['BirthDate'])
  //       };
  //     });
  //     setKids(parsedKids);
  //   } catch (error) {
  //     console.error('Error loading kids:', error);
  //   }
  // };

  const saveKid = async () => {

    const { age, ...kidDataWithoutAge } = {
      ...newKid,
      id: editKidId || Date.now().toString(),
    };
  
    console.log('save kid', { kidDataWithoutAge });
    try {
      await fetch('/api/saveKids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'kids',
          data: kidDataWithoutAge,
        })
      });

     // Calculate the age locally and update the state
     const updatedKidData = {
      ...kidDataWithoutAge,
      age: calculateAge(newKid.birthDate || ''),
    };

    if (isEditMode) {
      setKids(kids.map(kid => (kid.id === editKidId ? updatedKidData as Kid : kid)));
    } else {
      setKids([...kids, updatedKidData as Kid]);
    }

      setNewKid({});
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditKidId(null);
    } catch (error) {
      console.error('Error saving kid:', error);
    }
  };

  const editKid = (kid: Kid) => {
    console.log ('edit kid', {kid});
    setNewKid(kid);
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditKidId(kid.id);
  };

  const deleteKid = async (id: string) => {
    try {
      await fetch(`/api/deleteKid/${id}`, {
        method: 'DELETE'
      });
      setKids(kids.filter(kid => kid.id !== id));
    } catch (error) {
      console.error('Error deleting kid:', error);
    }
  };

  useEffect(() => {
    const fetchKids = async () => {
      const loadedKids = await KidManager.loadKids();
      console.log ('Page-kids use effect loaded kids', {loadedKids});
      setKids(loadedKids);
    };
  
    fetchKids().catch(error => console.error('Error in useEffect fetchKids:', error));
  }, []);
  

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-2xl text-emerald-600 mb-6">ילדים</h1>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mb-4"
      >
        הוסף ילד
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">{isEditMode ? 'ערוך ילד' : 'הוסף ילד חדש'}</h2>
            <div className="space-y-4">
              <input
                className="w-full p-2 border rounded"
                placeholder="שם"
                value={newKid.name || ''}
                onChange={e => setNewKid({ ...newKid, name: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="תאריך לידה (DD/MM/YYYY)"
                value={newKid.birthDate || ''}
                onChange={e => setNewKid({ ...newKid, birthDate: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                type="number"
                placeholder="משקל"
                value={newKid.weight || ''}
                onChange={e => setNewKid({ ...newKid, weight: Number(e.target.value) })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="תרופה מועדפת"
                value={newKid.favoriteMedicine || ''}
                onChange={e => setNewKid({ ...newKid, favoriteMedicine: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditKidId(null);
                    setNewKid({});
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ביטול
                </button>
                <button
                  onClick={saveKid}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  שמור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl">
        <div className="space-y-4">
          {kids.map(kid => (
            <div 
              key={kid.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{kid.name}</h3>
                <span className="text-gray-600">גיל: {kid.age}</span>
              </div>
              <div className="text-gray-500 text-sm space-y-1">
                {kid.birthDate && (
                  <p>תאריך לידה: {new Date(kid.birthDate.split('/').reverse().join('-')).toLocaleDateString('he-IL')}</p>
                )}
                {kid.weight && (
                  <p>משקל: {kid.weight} ק"ג</p>
                )}
                {kid.favoriteMedicine && (
                  <p>תרופה מועדפת: {kid.favoriteMedicine}</p>
                )}
                  <p className={KidManager.checkLastUpdatedStatus(kid.age, kid.lastUpdated).color}>
                    עודכן לאחרונה: {kid.lastUpdated}
                  </p>

                </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => editKid(kid)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ערוך
                </button>
                <button
                  onClick={() => deleteKid(kid.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default KidsPage;