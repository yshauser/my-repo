import { Medicine, SuspensionMedicine, CapletMedicine, NurofenKids, NovimolTipTipot, Acamol500, Ibufen200, Ibufen400 } from './medicinesData';

export interface MedicineGroup {
  name: string;
  data: Medicine[];
}

export class MedicineManager {
  static medicineGroups: MedicineGroup[] = [
    { name: 'נורופן לילדים', data: [NurofenKids] },
    { name: 'נובימול טיפטיפות', data: [NovimolTipTipot] },
    { name: 'אקמול 500', data: [Acamol500] },
    { name: 'איבופרופן 200', data: [Ibufen200] },
    { name: 'איבופרופן 400', data: [Ibufen400] },
  ];

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