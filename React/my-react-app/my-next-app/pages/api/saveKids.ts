import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('in saveKids file');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const kid = req.body;
    const filePath = path.join(process.cwd(), 'db/kids.txt');
    console.log('path', filePath);

    let content = '';
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (readError) {
      console.error('Error reading file:', readError);
      // File doesn't exist yet, will be created
    }

    // Fill missing properties with empty values
    const kidEntry = `// Kid #${kid.id ?? ''}
        KidID: ${kid.id ?? ''}
        Name: ${kid.name ?? ''}
        BirthDate: ${kid.birthDate ?? ''}
        Weight: ${kid.weight ?? ''}
        FavoriteMedicine: ${kid.favoriteMedicine ?? ''}
`;

    await fs.writeFile(filePath, content + kidEntry, 'utf8');
    res.status(200).json({ success: true });
  } catch (writeError) {
    console.error('Error saving kid:', writeError);
    res.status(500).json({ error: 'Failed to save kid' });
  }
}
