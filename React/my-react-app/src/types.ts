export interface LogEntry {
    id: string;
    logDate: string;
    logHour: string;
    kidName: string;
    temperature: string;
    selectedMedicine: string;
    actualDosage: string;
  }

export interface Kid {
  id: string;
  name: string;
  birthDate?: string;
  age?: number;
  weight?: number;
  favoriteMedicine?: string;
}