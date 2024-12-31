// logManager.ts
import { LogEntry } from '../types';
import { FileHandler } from '../fileHandling';

export class LogManager {
  private static fileHandler = new FileHandler<LogEntry>({
    suggestedName: 'medicineLog.json',
    description: 'Medicine Log Data File'
  });

  static async loadLogs(): Promise<LogEntry[]> {
    try {
      return await this.fileHandler.loadFromFile();
    } catch (error) {
      console.error('Error loading logs:', error);
      throw error;
    }
  }

  static async saveLogs(logs: LogEntry[]): Promise<void> {
    try {
      await this.fileHandler.saveToFile(logs);
    } catch (error) {
      console.error('Error saving logs:', error);
      throw error;
    }
  }

  static async updateLog(newLog: LogEntry): Promise<void> {
    try {
      const logs = await this.loadLogs();
      const logIndex = logs.findIndex(log => log.id === newLog.id);
      
      if (logIndex !== -1) {
        logs[logIndex] = newLog;
      } else {
        logs.push(newLog);
      }
      
      await this.saveLogs(logs);
    } catch (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  }

  static async deleteLog(logId: string): Promise<void> {
    try {
      const logs = await this.loadLogs();
      const filteredLogs = logs.filter(log => log.id !== logId);
      await this.saveLogs(filteredLogs);
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }
}