import { LogEntry } from './types.ts';  // Assuming you'll create a types file

// First, let's add the type definitions for the File System Access API
interface FileSystemFileHandle {
  getFile: () => Promise<File>;
  createWritable: () => Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write: (data: string) => Promise<void>;
  close: () => Promise<void>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
}

interface OpenFilePickerOptions {
  multiple?: boolean;
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
}

// Extend the window interface to include showSaveFilePicker
declare global {
  interface Window {
    showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
    showOpenFilePicker: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
  }
}

export const fileOperations = {
  saveToFile: (logData: LogEntry[]): void => {
    if ('showSaveFilePicker' in window) {
      window.showSaveFilePicker({
        suggestedName: 'medicineLog.json',
        types: [{
          description: 'JSON File',
          accept: {'application/json': ['.json']},
        }],
      }).then(async (fileHandle: FileSystemFileHandle) => {
        try {
          const writable = await fileHandle.createWritable();
          await writable.write(JSON.stringify(logData, null, 2));
          await writable.close();
        } catch (error: unknown) {
          console.error('Error saving file:', error);
        }
      }).catch((error: unknown) => {
        console.error('Error saving file:', error);
      });
    } else {
      // Fallback for older browsers
      const dataStr = JSON.stringify(logData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'medicineLog.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  updateFile: async (logData: LogEntry[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      
      if ('showSaveFilePicker' in window) {
        window.showSaveFilePicker({
          suggestedName: 'medicineLog.json',
          types: [{
            description: 'JSON File',
            accept: {'application/json': ['.json']},
          }],
        }).then(async (fileHandle: FileSystemFileHandle) => {
          try {
            let existingData: LogEntry[] = [];
            try {
              const file = await fileHandle.getFile();
              const fileText = await file.text();
              console.log('Raw file content:', {file, fileText}); // See what we're actually reading from the file
              
              try {
                existingData = JSON.parse(fileText) as LogEntry[];
                console.log('Parsed data:', existingData);
              } catch (parseError) {
                console.error('JSON parse error:', parseError);
              }
            } catch (fileError: unknown) {
              console.error('File reading error:', fileError);
            }
            

            const mergedData = [...existingData, ...logData];
            console.log ('updateFile mergedData', {logData, existingData, mergedData});
            const uniqueData = mergedData.filter((item, index, self) =>
              index === self.findIndex(t => t.id === item.id)
            );

            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(uniqueData, null, 2));
            await writable.close();
            
            resolve();
          } catch (error: unknown) {
            reject(error);
          }
        }).catch((error: unknown) => {
          reject(error);
        });
      } else {
        // Fallback for older browsers
        const dataStr = JSON.stringify(logData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        console.log('old update', {dataStr, blob, url, link});
        link.href = url;
        link.download = 'medicineLog.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      }
    });
  },


  loadFromFile: async (): Promise<LogEntry[]> => {
    if ('showOpenFilePicker' in window) {
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          multiple: false,
          types: [{
            description: 'JSON File',
            accept: {'application/json': ['.json']},
          }],
        });
        
        const file = await fileHandle.getFile();
        const data = JSON.parse(await file.text()) as LogEntry[];
        return data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error loading file: ${error.message}`);
        }
        throw new Error('Error loading file');
      }
    } else {
      // Fallback for older browsers
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            reject(new Error('No file selected'));
            return;
          }

          try {
            const data = JSON.parse(await file.text()) as LogEntry[];
            resolve(data);
          } catch (error) {
            reject(error);
          }
        };
        input.click();
      });
    }
  },

  clearFile: (): LogEntry[] => {
    if ('showSaveFilePicker' in window) {
      window.showSaveFilePicker({
        suggestedName: 'medicineLog.json',
        types: [{
          description: 'JSON File',
          accept: {'application/json': ['.json']},
        }],
      }).then(async (fileHandle: FileSystemFileHandle) => {
        try {
          const writable = await fileHandle.createWritable();
          await writable.write(JSON.stringify([], null, 2));
          await writable.close();
        } catch (error: unknown) {
          console.error('Error clearing file:', error);
        }
      }).catch((error: unknown) => {
        console.error('Error clearing file:', error);
      });
    } else {
      // Fallback for older browsers
      const emptyData = JSON.stringify([], null, 2);
      const blob = new Blob([emptyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'medicineLog.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    return [];
  }
};