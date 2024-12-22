export interface Medicine {
    w_low: number;
    w_high: number;
    dosMl: number;
    perDay_low?: number;
    perDay_high?: number;
    maxMlDay?: number;
    maxMlDayPerKg?: number;
  }
  
  export const NurofenKids: Medicine[] = [

    { w_low: 5, w_high: 5.4, dosMl: 2, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 5.5, w_high: 8.1, dosMl: 2.5, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 8.2, w_high: 10.9, dosMl: 3.75, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 11, w_high: 15, dosMl: 5, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 16, w_high: 21, dosMl: 7.5, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 22, w_high: 26, dosMl: 10, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 27, w_high: 32, dosMl: 12.5, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40},
    { w_low: 33, w_high: 43, dosMl: 15, perDay_low: 3, perDay_high: 4, maxMlDay: 200, maxMlDayPerKg:40}
  ];

  export const NovimolTipTipot: Medicine[] = [
   
    { w_low: 3, w_high: 3, dosMl: 0.45, perDay_low: 5, perDay_high: 5, maxMlDay: 2.25, maxMlDayPerKg: 0.75},
    { w_low: 4, w_high: 4, dosMl: 0.60, perDay_low: 5, perDay_high: 5, maxMlDay: 3, maxMlDayPerKg:0.75},
    { w_low: 5, w_high: 5, dosMl: 0.75, perDay_low: 5, perDay_high: 5, maxMlDay: 3.75, maxMlDayPerKg:0.75},
    { w_low: 6, w_high: 6, dosMl: 0.90, perDay_low: 5, perDay_high: 5, maxMlDay: 4.5, maxMlDayPerKg:0.75},
    { w_low: 7, w_high: 7, dosMl: 1.05, perDay_low: 5, perDay_high: 5, maxMlDay: 5.25, maxMlDayPerKg:0.75},
    { w_low: 8, w_high: 8, dosMl: 1.20, perDay_low: 5, perDay_high: 5, maxMlDay: 6, maxMlDayPerKg:0.75},
    { w_low: 9, w_high: 9, dosMl: 1.35, perDay_low: 5, perDay_high: 5, maxMlDay: 6.75, maxMlDayPerKg:0.75},
    { w_low: 10, w_high: 10, dosMl: 1.5, perDay_low: 5, perDay_high: 5, maxMlDay: 7.5, maxMlDayPerKg:0.75},
    { w_low: 11, w_high: 11, dosMl: 1.65, perDay_low: 5, perDay_high: 5, maxMlDay: 8.25, maxMlDayPerKg:0.75},
    { w_low: 12, w_high: 12, dosMl: 1.80, perDay_low: 5, perDay_high: 5, maxMlDay: 9, maxMlDayPerKg:0.75},
    { w_low: 13, w_high: 13, dosMl: 1.95, perDay_low: 5, perDay_high: 5, maxMlDay: 9.75, maxMlDayPerKg:0.75},
    { w_low: 14, w_high: 14, dosMl: 2.10, perDay_low: 5, perDay_high: 5, maxMlDay: 10.5, maxMlDayPerKg:0.75},
    { w_low: 15, w_high: 15, dosMl: 2.25, perDay_low: 5, perDay_high: 5, maxMlDay: 11.25, maxMlDayPerKg:0.75}
  ];


  // For clarity, you might want to add some constants that are used with this data
//   export const PERCENTILE_NAMES = ["97", "90", "50", "10", "3"];
  
//   export const CHART_AXIS_CONFIG = {
//     LENGTH: {
//       TICKS_X: [23, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
//       TICKS_Y: [23, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60],
//       DOMAIN_X: [23, 50],
//       DOMAIN_Y: [23, 60]
//     },
//     HEAD: {
//       TICKS_X: [23, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
//       TICKS_Y: [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44],
//       DOMAIN_X: [23, 50],
//       DOMAIN_Y: [17, 44]
//     },
//     WIEGHT: {
//       TICKS_X: [23, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
//       TICKS_Y: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5],
//       DOMAIN_X: [23, 50],
//       DOMAIN_Y: [0, 8]
//     }
//   };