import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Kid {
  id: string;
  name: string;
  birthDate: string;
  age: number;
}

const KidsPage = () => {
  const [kids, setKids] = useState<Kid[]>([]);

  // Calculate age function
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    
    // Split the birthDate string into day, month, and year
    const [day, month, year] = birthDate.split('/').map((part) => parseInt(part));
  
    // Create a new Date object with the correct format (month is 0-indexed)
    const birth = new Date(year, month - 1, day);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Adjust the age if the current month/day is before the birthday
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    // Calculate the months difference from the last birthday
    const monthsAfterBirthday = (today.getMonth() - birth.getMonth() + 12) % 12;
    
    // Round the age to the nearest half-year
    let roundedAge = age;
    // (fixedAgeInWeeks !== '' && fixedAgeInWeeks<=50)
    if ( age>=2){ //age<=10 &&
        if (monthsAfterBirthday >= 9) {
        roundedAge = age + 1;  // Round up to the next year
        } else if (monthsAfterBirthday <= 3) {
        roundedAge = age ; // Round to the nearest half year
        }else  {
            roundedAge = age + 0.5; // Round to the nearest half year
        }
    } else if (age <2){
        roundedage = monthsAfterBirthday;
    }

    console.log ("Yossi age calc", {birthDate, monthsAfterBirthday, roundedAge});
    return roundedAge;
  };
  

  // Read kids from file and set initial state
  const loadKids = async () => {
    try {
      const response = await fetch('/db/kids.txt');
      if (!response.ok) {
        throw new Error('Failed to load kids file');
      }
      
      const text = await response.text();
      console.log ('Yossi file text', {text});

      const kidBlocks = text.split('// Kid #').filter(block => block.trim());
      console.log ('Yossi file blocks', {kidBlocks});
      const parsedKids = kidBlocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        const kidData: { [key: string]: string } = {};
        
        lines.forEach(line => {
          console.log ('Yossi file lines', {line});
          const [key, value] = line.split(':').map(part => part.trim());
          if (key && value) {
            kidData[key.replace(' ', '')] = value;
            console.log ('Yossi file kid data', {line});
          }
        });
        
        return {
          id: parseInt(kidData['KidID']),
          name: kidData['Name'],
          birthDate: kidData['BirthDate'],
          weight: parseInt(kidData['Weight']),
          favoriteMedicine: kidData['FavoriteMedicine'],
          age: calculateAge(kidData['BirthDate'])
        } as Kid;
      });
  
      setKids(parsedKids);
    } catch (error) {
      console.error('Error loading kids:', error);
    }
  };

  useEffect(() => {
    loadKids();
  }, []);

  const handleAddKid = () => {
    // In a real application, this would open a form modal
    // For demonstration, adding a mock kid
    const newKid: Kid = {
      id: (kids.length + 1).toString(),
      name: 'ילד חדש',
      birthDate: new Date().toISOString().split('T')[0],
      age: 0
    };

    setKids([...kids, newKid]);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-2xl text-emerald-600 mb-6">ילדים</h1>
      
      <div className="w-full max-w-2xl">
        <Button 
          onClick={handleAddKid}
          className="mb-4 bg-emerald-500 hover:bg-emerald-600"
        >
          הוסף ילד
        </Button>

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
              <p className="text-gray-500 text-sm">
              תאריך לידה: {
                        // Convert the 'dd/mm/yyyy' string to a Date object
                        new Date(kid.birthDate.split('/').reverse().join('-')).toLocaleDateString('he-IL')
                    }
                </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default KidsPage;