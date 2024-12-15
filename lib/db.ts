// FILE: lib/db.ts
import { JSONFilePreset } from 'lowdb/node'

export type Novel = {
    id: number;
    title: string;
    chapters: Chapter[];
}

export type Chapter = {
    id: number;
    novelId: number;
    title: string;
    content: string;
};

export type Data = {
    novels: Novel[];
    chapters: Chapter[];
};

const defaultData: Data = { novels: [], chapters: [] };
const db = await JSONFilePreset('db.json', defaultData)

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { novels: [], chapters: [] };

export async function saveNovel(novel: Novel) {
    db.data?.novels.push(novel);
    await db.write();
}

export async function readNovels() {
    await db.read();
    return db.data?.novels || [];
}

export async function readChapters(id: number) {
    await db.read();
    return db.data?.chapters.find(chapter => chapter.novelId === id);
}

export async function saveChapter(chapter: Chapter) {
    db.data?.chapters.push(chapter);
    await db.write();
}

export async function getNextChapterId(): Promise<number> {
    await db.read();
    const chapters = db.data?.chapters || [];
    const maxId = chapters.reduce((max, chapter) => Math.max(max, chapter.id), 0);
    return maxId + 1;
}