// 本地持久化:动捕大块数据用 IndexedDB,设置/档案等小对象用 localStorage
import type {
  Athlete, DiveClip, TrainingSession, Annotation, AppSettings, DiveDefinition,
} from './types';
import { DEFAULT_SETTINGS } from './settings';
import { BUILTIN_DIVES } from './diveCodes';

const DB_NAME = 'dive-analyzer-db';
const DB_VERSION = 1;
const STORE = 'records';

export type StoreKind = 'clip' | 'athlete' | 'session' | 'annotation' | 'dive';
const KEY = (kind: StoreKind, id: string) => `${kind}:${id}`;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => { db.close(); resolve(req.result as T | undefined); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

async function idbGetAll<T>(prefix: StoreKind): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAllKeys();
    req.onsuccess = () => {
      const keys = (req.result as string[]).filter((k) => k.startsWith(`${prefix}:`));
      if (keys.length === 0) { db.close(); resolve([]); return; }
      const dataReq = tx.objectStore(STORE).getAll();
      dataReq.onsuccess = () => {
        const all = dataReq.result as T[];
        const keyReq = req.result as string[];
        const out = all.filter((_, i) => keyReq[i]?.startsWith(`${prefix}:`));
        db.close();
        resolve(out);
      };
      dataReq.onerror = () => { db.close(); reject(dataReq.error); };
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

// —— 泛型实体仓储 ——
export const repo = {
  async saveClip(c: DiveClip): Promise<void> { return idbPut(KEY('clip', c.id), c); },
  async getClip(id: string): Promise<DiveClip | undefined> { return idbGet<DiveClip>(KEY('clip', id)); },
  async allClips(): Promise<DiveClip[]> { return idbGetAll<DiveClip>('clip'); },
  async deleteClip(id: string): Promise<void> { return idbDelete(KEY('clip', id)); },

  async saveAthlete(a: Athlete): Promise<void> { return idbPut(KEY('athlete', a.id), a); },
  async allAthletes(): Promise<Athlete[]> { return idbGetAll<Athlete>('athlete'); },
  async deleteAthlete(id: string): Promise<void> { return idbDelete(KEY('athlete', id)); },

  async saveSession(s: TrainingSession): Promise<void> { return idbPut(KEY('session', s.id), s); },
  async allSessions(): Promise<TrainingSession[]> { return idbGetAll<TrainingSession>('session'); },
  async deleteSession(id: string): Promise<void> { return idbDelete(KEY('session', id)); },

  async saveAnnotation(a: Annotation): Promise<void> { return idbPut(KEY('annotation', a.id), a); },
  async allAnnotations(): Promise<Annotation[]> { return idbGetAll<Annotation>('annotation'); },
  async deleteAnnotation(id: string): Promise<void> { return idbDelete(KEY('annotation', id)); },

  async saveDive(d: DiveDefinition): Promise<void> { return idbPut(KEY('dive', d.code), d); },
  async allDives(): Promise<DiveDefinition[]> {
    const custom = await idbGetAll<DiveDefinition>('dive');
    const codes = new Set(custom.map((d) => d.code));
    return [...custom, ...BUILTIN_DIVES.filter((d) => !codes.has(d.code))];
  },
};

// —— 设置(localStorage) ——
const SETTINGS_KEY = 'dive-analyzer-settings';
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw) as AppSettings;
    // 与默认值合并,新增字段自动补齐
    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...parsed,
      thresholds: { ...DEFAULT_SETTINGS.thresholds, ...parsed.thresholds },
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}
export function saveSettings(s: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
