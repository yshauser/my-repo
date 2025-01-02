// pages/api/medicines.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'public/db/medicines.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    const newMedicine = req.body;
    
    // Add the new medicine to the appropriate array based on type
    if (newMedicine.type === 'suspension') {
      data.medicines.suspension.push(newMedicine);
    } else if (newMedicine.type === 'caplets') {
      data.medicines.caplets.push(newMedicine);
    }

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Return success response
    res.status(200).json({ message: 'Medicine added successfully' });
  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({ message: 'Failed to add medicine' });
  }
}