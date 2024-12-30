import { calculateAge } from './Page-Kids';
import { Kid } from './types.ts';

// export interface Kid {
//   id: string;
//   name: string;
//   birthDate?: string;
//   age?: number;
//   weight?: number;
//   favoriteMedicine?: string;
// }

interface KidData {
  [key: string]: string | number | undefined;
}

export class KidManager {
  static async loadKids(): Promise<Kid[]> {
    try {
      const response = await fetch('/db/kids.txt');
      if (!response.ok) throw new Error('Failed to load kids file');
      const text = await response.text();
      const kidBlocks = text.split('// Kid #').filter(block => block.trim());
    
      return kidBlocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        const kidData: { [key: string]: string } = {};
        lines.forEach(line => {
          const [key, value] = line.split(':').map(part => part.trim());
          if (key && value) {
            kidData[key.replace(' ', '')] = value;
          }
        });

        // Set default values and ensure properties have correct types
        const id = kidData['KidID'] || '';
        const name = kidData['Name'] || '';
        const birthDate = kidData['BirthDate'] || '';
        const weight = kidData['Weight'] ? parseFloat(kidData['Weight']) : undefined;
        const age = birthDate ? calculateAge(birthDate) : undefined;
        const favoriteMedicine = kidData['FavoriteMedicine'];

        return {
          id,
          name,
          birthDate,
          weight,
          age,
          favoriteMedicine
        };
      });
    } catch (error) {
      console.error('Error loading kids:', error);
      return [];
    }
  }
}