import type { NextApiRequest, NextApiResponse } from 'next';
import { readNovelList } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const novels = await readNovelList();
  res.status(200).json(novels);
}