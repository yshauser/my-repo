export class timeAndDateFormatter{
    static formatHourInput = (input: string) => {
        // Remove any non-digit characters
        const digits = input.replace(/\D/g, '');
        
        if (digits.length <= 2) {
        return digits;
        }

        // Format as HH:mm
        const hours = digits.slice(0, 2);
        const minutes = digits.slice(2, 4);
        return `${hours}:${minutes}`;
    };

    // Validate hour format
    static validateHourFormat = (hour: string) => {
        const [hours, minutes] = hour.split(':').map(Number);
        return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    };

    // Convert date string to Date object for DatePicker
    static stringToDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(2000 + year, month - 1, day);
    };
    // Convert Date object to string format
    static dateToString = (date: Date | null) => {
        if (!date) return '';
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
    };
}