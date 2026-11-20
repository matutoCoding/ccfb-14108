// IndexedDB 持久层 —— 全部数据只存本地浏览器，无任何网络请求
import type {
  Annotation,
  AppSettings,
  Athlete,
  DiveLibraryEntry,
  MoCapRecord,
  TrainingSession,
} from './types';
import { DEFAULT_SETTINGS } from './settings';

const DB_NAME = 'dive-analysis-db';
const DB_VERSION = 1;
const STORES = ['athletes', 'dives', 'sessions', 'records', 'annotations', 'settings'] as const;
type Store = (typeof STORES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function store(storeName: Store, mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openDb();
  return db.transaction(storeName, mode).objectStore(storeName);
}

function reqAsPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut<T>(storeName: Store, key: string, value: T): Promise<void> {
  const s = await store(storeName, 'readwrite');
  await reqAsPromise(s.put(value, key));
}

export async function dbGet<T>(storeName: Store, key: string): Promise<T | undefined> {
  const s = await store(storeName, 'readonly');
  return reqAsPromise<T | undefined>(s.get(key) as IDBRequest<T | undefined>);
}

export async function dbGetAll<T>(storeName: Store): Promise<T[]> {
  const s = await store(storeName, 'readonly');
  return reqAsPromise<T[]>(s.getAll() as IDBRequest<T[]>);
}

export async function dbDelete(storeName: Store, key: string): Promise<void> {
  const s = await store(storeName, 'readwrite');
  await reqAsPromise(s.delete(key));
}

// -------- 业务级便捷方法 --------

export const db = {
  // 队员
  listAthletes: () => dbGetAll<Athlete>('athletes'),
  saveAthlete: (a: Athlete) => dbPut('athletes', a.id, a),
  deleteAthlete: async (id: string) => {
    const recs = await dbGetAll<MoCapRecord>('records');
    await Promise.all(recs.filter((r) => r.athleteId === id).map((r) => dbDelete('records', r.id)));
    await dbDelete('athletes', id);
  },

  // 动作库
  listDives: () => dbGetAll<DiveLibraryEntry>('dives'),
  saveDive: (d: DiveLibraryEntry) => dbPut('dives', d.code, d),
  deleteDive: (code: string) => dbDelete('dives', code),

  // 训练课
  listSessions: () => dbGetAll<TrainingSession>('sessions'),
  saveSession: (s: TrainingSession) => dbPut('sessions', s.id, s),
  deleteSession: (id: string) => dbDelete('sessions', id),

  // 动捕记录
  listRecords: () => dbGetAll<MoCapRecord>('records'),
  getRecord: (id: string) => dbGet<MoCapRecord>('records', id),
  saveRecord: (r: MoCapRecord) => dbPut('records', r.id, r),
  deleteRecord: async (id: string) => {
    const anns = await dbGetAll<Annotation>('annotations');
    await Promise.all(anns.filter((a) => a.recordId === id).map((a) => dbDelete('annotations', a.id)));
    await dbDelete('records', id);
  },

  // 标注
  listAnnotations: (recordId?: string) =>
    dbGetAll<Annotation>('annotations').then((all) =>
      recordId ? all.filter((a) => a.recordId === recordId) : all,
    ),
  saveAnnotation: (a: Annotation) => dbPut('annotations', a.id, a),
  deleteAnnotation: (id: string) => dbDelete('annotations', id),

  // 设置
  async getSettings(): Promise<AppSettings> {
    const s = await dbGet<AppSettings>('settings', 'app');
    return s ?? structuredClone(DEFAULT_SETTINGS);
  },
  saveSettings: (s: AppSettings) => dbPut('settings', 'app', s),

  async exportAll(): Promise<string> {
    const [athletes, dives, sessions, records, annotations, settings] = await Promise.all([
      dbGetAll<Athlete>('athletes'),
      dbGetAll<DiveLibraryEntry>('dives'),
      dbGetAll<TrainingSession>('sessions'),
      dbGetAll<MoCapRecord>('records'),
      dbGetAll<Annotation>('annotations'),
      dbGet<AppSettings>('settings', 'app'),
    ]);
    return JSON.stringify(
      { version: 1, exportedAt: new Date().toISOString(), athletes, dives, sessions, records, annotations, settings },
      null,
      2,
    );
  },

  async importAll(json: string): Promise<void> {
    const data = JSON.parse(json);
    const jobs: Promise<void>[] = [];
    for (const a of data.athletes ?? []) jobs.push(dbPut('athletes', a.id, a));
    for (const d of data.dives ?? []) jobs.push(dbPut('dives', d.code, d));
    for (const s of data.sessions ?? []) jobs.push(dbPut('sessions', s.id, s));
    for (const r of data.records ?? []) jobs.push(dbPut('records', r.id, r));
    for (const an of data.annotations ?? []) jobs.push(dbPut('annotations', an.id, an));
    if (data.settings) jobs.push(dbPut('settings', 'app', data.settings));
    await Promise.all(jobs);
  },
};
