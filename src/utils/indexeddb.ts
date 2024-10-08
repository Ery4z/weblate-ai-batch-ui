// utils/indexeddb.ts

import { openDB, DBSchema, IDBPDatabase } from "idb";

interface Embedding {
    key: string;
    source: string;
    translation: string;
    embedding: number[];
}

interface EmbeddingsDB extends DBSchema {
    embeddings: {
        key: string;
        value: Embedding;
    };
}

let dbPromise: Promise<IDBPDatabase<EmbeddingsDB>>;

export function initDB() {
    if (!dbPromise) {
        dbPromise = openDB<EmbeddingsDB>("EmbeddingsDB", 1, {
            upgrade(db) {
                db.createObjectStore("embeddings", { keyPath: "key" });
            },
        });
    }
    return dbPromise;
}

export async function saveEmbeddings(embeddings: Embedding[]) {
    const db = await initDB();
    const tx = db.transaction("embeddings", "readwrite");
    const store = tx.objectStore("embeddings");

    for (const embedding of embeddings) {
        await store.put(embedding);
    }

    await tx.done;
}

export async function getAllEmbeddings(): Promise<Embedding[]> {
    const db = await initDB();
    return await db.getAll("embeddings");
}

export async function clearEmbeddings() {
    const db = await initDB();
    const tx = db.transaction("embeddings", "readwrite");
    await tx.objectStore("embeddings").clear();
    await tx.done;
}
