// FILE: lib/db.ts
import { JSONFilePreset } from 'lowdb/node'
import { join } from 'path';

type Novel = {
    title: string;
    chapter: string;
    content: string;
};

type Data = {
    novels: Novel[];
};

const defaultData: Data = { novels: [] }
const db = await JSONFilePreset('db.json', defaultData)

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { novels: [] };

export async function readNovels() {
    await db.read();
    return db.data?.novels || [];
}

export async function saveNovel(novel: Novel) {
    db.data?.novels.push(novel);
    await db.write();
}