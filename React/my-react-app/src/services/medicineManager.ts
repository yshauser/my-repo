import {SuspensionMedicine, CapletMedicine, Medicine} from '../types';

interface DefaultUnits {
  suspension: string;
  caplets: string;
  weight: string;
  age: string;
}

interface Metadata {
  defaultUnits: DefaultUnits;
}

interface Alias {
  name: string;
  hebName: string;
  company: string;
}

// Active ingredient related interfaces
interface DailyDose {
  adult: string;
  pediatric: string;
}

interface ActiveIngredient {
  alternativeNames: string[];
  category: string;
  maxDailyDose: DailyDose;
}

// Main data structure interfaces
interface MedicinesData {
  suspension: SuspensionMedicine[];
  caplets: CapletMedicine[];
}

interface MedicineDataFile {
  version: string;
  lastUpdated: string;
  metadata: Metadata;
  medicines: MedicinesData;
  activeIngredients: Record<string, ActiveIngredient>;
}

// Medicine group for UI organization
export interface MedicineGroup {
  name: string;
  data: Medicine[];
}

export class MedicineManager {
  private static medicineGroups: MedicineGroup[] = [];
  private static activeIngredients: Record<string, ActiveIngredient> = {};
  private static metadata: Metadata | null = null;

  static async initialize(): Promise<void> {
    try {
      const response = await fetch('/db/medicines.json');
      const data: MedicineDataFile = await response.json();
      console.log ('MedicineManager', {data});

      // Store metadata and active ingredients
      this.metadata = data.metadata;
      this.activeIngredients = data.activeIngredients;

      // Initialize medicine groups
      this.medicineGroups = [
        ...data.medicines.suspension.map(med => ({
          name: med.hebName,
          data: [med]
        })),
        ...data.medicines.caplets.map(med => ({
          name: med.hebName,
          data: [med]
        }))
      ];
    } catch (error) {
      console.error('Failed to load medicines data:', error);
      throw error;
    }
  }

  static getMedicineGroups(): MedicineGroup[] {
    return this.medicineGroups;
  }

  static getActiveIngredients(): Record<string, ActiveIngredient> {
    return this.activeIngredients;
  }

  static getMetadata(): Metadata | null {
    return this.metadata;
  }

  static findMedicineByName(name: string): Medicine | undefined {
    for (const group of this.medicineGroups) {
      if (group.name === name && group.data.length > 0) {
        return group.data[0];
      }
    }
    return undefined;
  }

  static findMedicinesByActiveIngredient(ingredient: string): Medicine[] {
    return this.medicineGroups
      .flatMap(group => group.data)
      .filter(medicine => medicine.activeIngredient === ingredient);
  }

  static calculateDosage(medicineName: string, kidWeight: number | undefined, kidAge: number | undefined): string {
    const medicineGroup = this.medicineGroups.find(group => group.name === medicineName);

    if (medicineGroup) {
      const medicine = medicineGroup.data[0];
      if (!medicine) return '';

      if (medicine.type === 'suspension') {
        const entry = medicine.entries.find(
          e => (kidWeight as number) >= e.w_low && (kidWeight as number) <= e.w_high
        );
        if (entry?.dos) {
          return `${entry.dos} מ"ל`;
        }
        return 'תרופה לא תואמת גיל/משקל';
      } else if (medicine.type === 'caplets') {
        const entry = medicine.entries.find(
          e => (kidAge as number) >= e.age_low && (!e.age_high || (kidAge as number) <= e.age_high)
        );
        if (entry?.dos_low) {
          if (!entry.dos_high || entry.dos_high === entry.dos_low) {
            return `${entry.dos_low} קפליות`;
          }
          return `${entry.dos_low}-${entry.dos_high} קפליות`;
        }
        return 'תרופה לא תואמת גיל/משקל';
      }
    }
    return '';
  }

  static hasEqualValues(data: Medicine[], key1: string, key2: string): boolean {
    if (data.length === 0) return false;

    const firstItem = data[0];

    if (firstItem.type === "suspension") {
      return data.every(item => {
        const suspensionItem = item as SuspensionMedicine;

        if (key1 === "w_low" && key2 === "w_high") {
          return suspensionItem.entries.every(entry => entry[key1] === entry[key2]);
        }

        if (key1 === "perDay_low" && key2 === "perDay_high") {
          return suspensionItem.entries.every(entry => entry[key1] === entry[key2]);
        }

        return true;
      });
    } else if (firstItem.type === "caplets") {
      return data.every(item => {
        const capletItem = item as CapletMedicine;

        if (key1 === "dos_low" && key2 === "dos_high") {
          return capletItem.entries.every(entry => entry[key1] === entry[key2]);
        }

        return true;
      });
    }

    return false;
  }
}