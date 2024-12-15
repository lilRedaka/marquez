import type { NextApiRequest, NextApiResponse } from 'next';
import { readNovels } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const novels = await readNovels();
  res.status(200).json(novels);
}