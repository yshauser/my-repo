// TaskManager.ts
import { TaskEntry } from '../types';
import { FileHandler } from '../fileHandling';

export class TaskManager {
  private static fileHandler = new FileHandler<TaskEntry>({
    suggestedName: 'ScheduledTasks.json',
    description: 'Scheduled Tasks File',
    // startIn: 'documents'
  });

  static async loadTasks(): Promise<TaskEntry[]> {
    try {
      return await this.fileHandler.loadFromFile();
    } catch (error) {
      console.error('Error loading tasks:', error);
      throw error;
    }
  }

  static async saveTasks(tasks: TaskEntry[]): Promise<void> {
    try {
      await this.fileHandler.saveToFile(tasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  static async updateTask(newTask: TaskEntry): Promise<void> {
    try {
      const tasks = await this.loadTasks();
      const taskIndex = tasks.findIndex(task => task.id === newTask.id);
      
      if (taskIndex !== -1) {
        tasks[taskIndex] = newTask;
      } else {
        tasks.push(newTask);
      }
      
      await this.saveTasks(tasks);
    } catch (error) {
      console.error('Error updating Task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.loadTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await this.saveTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}