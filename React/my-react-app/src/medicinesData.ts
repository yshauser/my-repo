export enum MedicineType {
  Suspension = "suspension",
  Caplets = "caplets",
  Granules = "Granules",
  Suppository = "suppository"
}
export interface MedicineBase {
  id: number;
  name: string;
  type: "suspension" | "caplets" | "Granules" | "suppository"; 
  description?: string; // Optional description field
}
interface SuspensionEntry{
  w_low: number; // Weight low range
  w_high: number; // Weight high range
  dos?: number;
  perDay_low?: number;
  perDay_high?: number;
  maxDay?: number;
  maxDayPerKg?: number;
}
interface CapletEntry{
  age_low: number; // Minimum age for caplets
  age_high?: number; // Maximum age for caplets
  dos_low?: number;
  dos_high?: number;
  hoursInterval_low?: number;
  hoursInterval_high?: number;
  maxDay?: number;
}
export interface SuspensionMedicine extends MedicineBase {
  type: "suspension"; // Type is explicitly 'suspension' for this interface
  entries: SuspensionEntry[];
}

// Define the structure for medicines of type 'caplets'
export interface CapletMedicine extends MedicineBase {
  type: "caplets"; // Type is explicitly 'caplets' for this interface
  entries: CapletEntry[];
}

// Union type to represent both medicine types
export type Medicine = SuspensionMedicine | CapletMedicine;
  
  export const NurofenKids: SuspensionMedicine = {
  id: 1,
  name: "Nurofen Suspension for Kids", 
  type: MedicineType.Suspension,
  entries: [
    { w_low: 5, w_high: 5.4,dos: 2, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 5.5, w_high: 8.1,dos: 2.5, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 8.2, w_high: 10.9,dos: 3.75, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 11, w_high: 15,dos: 5, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 16, w_high: 21,dos: 7.5, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 22, w_high: 26,dos: 10, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 27, w_high: 32,dos: 12.5, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40},
    { w_low: 33, w_high: 43,dos: 15, perDay_low: 3, perDay_high: 4,maxDay: 200,maxDayPerKg:40}
    ]
  };

  export const NovimolTipTipot: SuspensionMedicine = {
    id: 2,
    name: "Novimol TipTipot Suspension for Kids", 
    type: MedicineType.Suspension,
    entries: [
    { w_low: 3, w_high: 3,dos: 0.45, perDay_low: 5, perDay_high: 5,maxDay: 2.25,maxDayPerKg: 0.75},
    { w_low: 4, w_high: 4,dos: 0.60, perDay_low: 5, perDay_high: 5,maxDay: 3,maxDayPerKg:0.75},
    { w_low: 5, w_high: 5,dos: 0.75, perDay_low: 5, perDay_high: 5,maxDay: 3.75,maxDayPerKg:0.75},
    { w_low: 6, w_high: 6,dos: 0.90, perDay_low: 5, perDay_high: 5,maxDay: 4.5,maxDayPerKg:0.75},
    { w_low: 7, w_high: 7,dos: 1.05, perDay_low: 5, perDay_high: 5,maxDay: 5.25,maxDayPerKg:0.75},
    { w_low: 8, w_high: 8,dos: 1.20, perDay_low: 5, perDay_high: 5,maxDay: 6,maxDayPerKg:0.75},
    { w_low: 9, w_high: 9,dos: 1.35, perDay_low: 5, perDay_high: 5,maxDay: 6.75,maxDayPerKg:0.75},
    { w_low: 10, w_high: 10,dos: 1.5, perDay_low: 5, perDay_high: 5,maxDay: 7.5,maxDayPerKg:0.75},
    { w_low: 11, w_high: 11,dos: 1.65, perDay_low: 5, perDay_high: 5,maxDay: 8.25,maxDayPerKg:0.75},
    { w_low: 12, w_high: 12,dos: 1.80, perDay_low: 5, perDay_high: 5,maxDay: 9,maxDayPerKg:0.75},
    { w_low: 13, w_high: 13,dos: 1.95, perDay_low: 5, perDay_high: 5,maxDay: 9.75,maxDayPerKg:0.75},
    { w_low: 14, w_high: 14,dos: 2.10, perDay_low: 5, perDay_high: 5,maxDay: 10.5,maxDayPerKg:0.75},
    { w_low: 15, w_high: 15,dos: 2.25, perDay_low: 5, perDay_high: 5,maxDay: 11.25,maxDayPerKg:0.75}
    ]
  };

  export const Acamol500: CapletMedicine = {
    id: 1001,
    name: "Acamol caplets 500mg", 
    type: MedicineType.Caplets,
    entries: [
    { age_low: 6, age_high: 12, dos_low: 0.5, dos_high:1, hoursInterval_low:4, hoursInterval_high: 6 ,maxDay: 5},
    { age_low: 13, dos_low: 1, dos_high:2, hoursInterval_low:4, hoursInterval_high: 6 ,maxDay: 8}
  ]};

  export const Ibufen200: CapletMedicine = {
    id: 1101,
    name: "Ibuprofen caplets 200mg", 
    type: MedicineType.Caplets,
    entries: [
    { age_low: 12,  dos_low: 1, dos_high:2, hoursInterval_low:4, hoursInterval_high: 8 ,maxDay: 6}
  ]};

  export const Ibufen400: CapletMedicine = {
    id: 1102,
    name: "Ibuprofen caplets 200mg", 
    type: MedicineType.Caplets,
    entries: [
    { age_low: 12,  dos_low: 1, dos_high:1, hoursInterval_low:4, hoursInterval_high: 8 ,maxDay: 3}
  ]};

  export const IbuprofenNames = ["IbuPro", "Ibufen", "Nurofen", "Advil", "Adex"];
  export const ParacetamolNames = ["Acamol", "Dexamol", "Paramol"];
  export const MEDICINES_TYPES = ["Syrup", "Caplets", "Granules", "suppository"]
