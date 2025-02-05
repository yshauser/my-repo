// TaskManager.ts
import { TaskEntry } from '../types';
// import { FileHandler } from '../fileHandling';

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
    const [d, m, y] = dateStr.split('/');
    const date = new Date(`${y}-${m}-${d}`); // yyyy-mm-dd format
    // const date = new Date(dateStr);
    console.log ('form', {dateStr, date})  
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle incorrect date inputs
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    const formattedDate = `${day}/${month}/${year}`;
    console.log('formattedDate', {dateStr, formattedDate });
  
    return formattedDate;
  };

export class TaskManager {
  // private static fileHandler = new FileHandler<TaskEntry>({
  //   suggestedName: 'ScheduledTasks.json',
  //   description: 'Scheduled Tasks File',
  //   // startIn: 'documents'
  // });

  static async loadTasks(): Promise<TaskEntry[]> {
try {
      const response = await fetch('/db/tasks.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load tasks file. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log ('Tasks manager load ', {data});

      return data;

    } catch (error) {
      console.error('Error loading tasks:', error);
      throw error;
    }
  }

  // static async saveTasks(tasks: TaskEntry[]): Promise<void> {
  //   try {
  //     await this.fileHandler.saveToFile(tasks);
  //   } catch (error) {
  //     console.error('Error saving tasks:', error);
  //     throw error;
  //   }
  // }

  // static async updateTask(newTask: TaskEntry): Promise<void> {
  //   try {
  //     const tasks = await this.loadTasks();
  //     const taskIndex = tasks.findIndex(task => task.id === newTask.id);
      
  //     if (taskIndex !== -1) {
  //       tasks[taskIndex] = newTask;
  //     } else {
  //       tasks.push(newTask);
  //     }
      
  //     await this.saveTasks(tasks);
  //   } catch (error) {
  //     console.error('Error updating Task:', error);
  //     throw error;
  //   }
  // }

  // static async deleteTask(taskId: string): Promise<void> {
  //   try {
  //     const tasks = await this.loadTasks();
  //     const filteredTasks = tasks.filter(task => task.id !== taskId);
  //     await this.saveTasks(filteredTasks);
  //   } catch (error) {
  //     console.error('Error deleting task:', error);
  //     throw error;
  //   }
  // }
}