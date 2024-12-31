import { Kid } from '../types.ts';

interface KidData {
  [key: string]: string | number | undefined;
}

export class KidManager {
  static async loadKids(): Promise<Kid[]> {
    try {
      const response = await fetch('/db/kids.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load kids file. Status: ${response.status}`);
      }

      const data: Omit<Kid, 'age'>[] = await response.json();
      console.log ('kid manager load ', {data});

      return data.map(kid => ({
        ...kid,
        age: kid.birthDate ? calculateAge(kid.birthDate) : undefined,
      }));

    } catch (error) {
      console.error('Error loading kids:', error);
      return [];
    }
  }
}

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const [day, month, year] = birthDate.split('/').map((part) => parseInt(part));
  const birth = new Date(year, month - 1, day);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  const monthsAfterBirthday = (today.getMonth() - birth.getMonth() + 12) % 12;
  let roundedAge = age;
  if (age >= 2) {
    if (monthsAfterBirthday >= 9) {
      roundedAge = age + 1;
    } else if (monthsAfterBirthday <= 3) {
      roundedAge = age;
    } else {
      roundedAge = age + 0.5;
    }
  } else if (age < 2) {
    roundedAge = monthsAfterBirthday;
  }
  return roundedAge;
};
