// FILE: lib/db.ts
import { JSONFilePreset } from 'lowdb/node'

export type Novel = {
    id: number;
    title: string;
    chapterIds: number[];
    characters: string;
    environment: string;
    plot: string;
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
type NovelWithOptionalId = Omit<Novel, 'id'> & Partial<Pick<Novel, 'id'>>;

export async function saveNovel(novel: NovelWithOptionalId) {
    await db.read();
    const existingNovelIndex = db.data?.novels.findIndex(n => n.id === novel.id);

    if (novel?.id) {
        // Update existing novel
        if (existingNovelIndex !== undefined && existingNovelIndex >= 0) {
            const oldVerisonNovel = db.data!.novels[existingNovelIndex];
            db.data!.novels[existingNovelIndex] = { ...oldVerisonNovel, ...novel };
        }
    } else {
        // Add new novel
        const id = await getNextNovelId();
        db.data?.novels.push({ id, ...novel });
    }

    await db.write();
}

export async function readNovelList() {
    await db.read();
    return db.data?.novels || [];
}

export async function readNovel(id: number) {
    await db.read();
    return db.data?.novels.find(novel => novel.id === id);
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

export async function getNextNovelId(): Promise<number> {
    await db.read();
    const chapters = db.data?.novels || [];
    const maxId = chapters.reduce((max, chapter) => Math.max(max, chapter.id), 0);
    return maxId + 1;
}