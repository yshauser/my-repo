import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  console.log ('in saveKids');
  try {
    console.log ('in saveKids in try');
    const { filename, data } = req.body;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing fileName' });
    }

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid or missing data' });
    }

    const filePath = path.join(process.cwd(), 'db', `${filename}.json`);

    console.log('Saving data to:', filePath);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Read existing data if the file exists
    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
      console.log ('saveKids API', {existingData});
    } catch (readError) {
      if ((readError as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error reading file:', readError);
        return res.status(500).json({ error: 'Failed to read existing data' });
      }
      // File does not exist; will create a new one
    }

    // Merge new data into existing data
    existingData.push(data);

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
}
