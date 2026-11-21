// 全局应用状态 + 发布订阅(无框架依赖)
import type {
  Athlete, DiveClip, TrainingSession, Annotation, AppSettings, DiveDefinition, DiveAnalysis,
} from './types';
import { repo, loadSettings, saveSettings, uid } from './storage';
import { analyzeClip } from './analysis';

export type PageName = 'athletes' | 'dives' | 'sessions' | 'playback' | 'compare' | 'settings';

interface AppState {
  page: PageName;
  athletes: Athlete[];
  dives: DiveDefinition[];
  sessions: TrainingSession[];
  clips: DiveClip[];
  annotations: Annotation[];
  settings: AppSettings;
  /** 当前回放选中的片段 id */
  activeClipId: string | null;
  /** 对比页两个片段 */
  compareA: string | null;
  compareB: string | null;
  /** 分析结果缓存(clipId -> analysis),不持久化 */
  analysisCache: Map<string, DiveAnalysis>;
}

type Listener = (s: AppState) => void;

class Store {
  state: AppState = {
    page: 'athletes',
    athletes: [],
    dives: [],
    sessions: [],
    clips: [],
    annotations: [],
    settings: loadSettings(),
    activeClipId: null,
    compareA: null,
    compareB: null,
    analysisCache: new Map(),
  };
  private listeners = new Set<Listener>();

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  private emit(): void {
    this.listeners.forEach((l) => l(this.state));
  }
  /** 以可变方式更新 state 后统一通知 */
  update(mutator: (s: AppState) => void): void {
    mutator(this.state);
    this.emit();
  }

  async init(): Promise<void> {
    const [athletes, dives, sessions, clips, annotations] = await Promise.all([
      repo.allAthletes(), repo.allDives(), repo.allSessions(),
      repo.allClips(), repo.allAnnotations(),
    ]);
    this.update((s) => {
      s.athletes = athletes;
      s.dives = dives;
      s.sessions = sessions;
      s.clips = clips;
      s.annotations = annotations;
    });
  }

  // —— 队员 ——
  async saveAthlete(a: Athlete): Promise<void> {
    await repo.saveAthlete(a);
    this.update((s) => {
      const i = s.athletes.findIndex((x) => x.id === a.id);
      if (i >= 0) s.athletes[i] = a; else s.athletes.push(a);
    });
  }
  async deleteAthlete(id: string): Promise<void> {
    await repo.deleteAthlete(id);
    this.update((s) => {
      s.athletes = s.athletes.filter((a) => a.id !== id);
    });
  }

  // —— 动作库 ——
  async saveDive(d: DiveDefinition): Promise<void> {
    await repo.saveDive(d);
    this.update((s) => {
      const i = s.dives.findIndex((x) => x.code === d.code);
      if (i >= 0) s.dives[i] = d; else s.dives.push(d);
    });
  }

  // —— 训练课 ——
  async saveSession(sess: TrainingSession): Promise<void> {
    await repo.saveSession(sess);
    this.update((s) => {
      const i = s.sessions.findIndex((x) => x.id === sess.id);
      if (i >= 0) s.sessions[i] = sess; else s.sessions.push(sess);
    });
  }
  async deleteSession(id: string): Promise<void> {
    await repo.deleteSession(id);
    this.update((s) => {
      s.sessions = s.sessions.filter((x) => x.id !== id);
    });
  }

  // —— 片段 ——
  async saveClip(c: DiveClip): Promise<void> {
    await repo.saveClip(c);
    this.state.analysisCache.delete(c.id);
    this.update((s) => {
      const i = s.clips.findIndex((x) => x.id === c.id);
      if (i >= 0) s.clips[i] = c; else s.clips.push(c);
    });
  }
  async deleteClip(id: string): Promise<void> {
    await repo.deleteClip(id);
    this.state.analysisCache.delete(id);
    this.update((s) => {
      s.clips = s.clips.filter((c) => c.id !== id);
      for (const sess of s.sessions) sess.clipIds = sess.clipIds.filter((x) => x !== id);
      if (s.activeClipId === id) s.activeClipId = null;
    });
  }
  getClip(id: string | null): DiveClip | undefined {
    if (!id) return undefined;
    return this.state.clips.find((c) => c.id === id);
  }
  athleteOf(clip: DiveClip): Athlete | undefined {
    return this.state.athletes.find((a) => a.id === clip.athleteId);
  }
  /** 取分析结果(惰性计算并缓存) */
  analysis(clip: DiveClip): DiveAnalysis {
    const cached = this.state.analysisCache.get(clip.id);
    if (cached) return cached;
    const athlete = this.athleteOf(clip);
    if (!athlete) throw new Error('片段对应的队员档案不存在,无法分析');
    const result = analyzeClip(clip, athlete, this.state.settings);
    this.state.analysisCache.set(clip.id, result);
    return result;
  }
  invalidateAnalysis(clipId: string): void {
    this.state.analysisCache.delete(clipId);
  }

  // —— 标注 ——
  async saveAnnotation(a: Annotation): Promise<void> {
    await repo.saveAnnotation(a);
    this.update((s) => {
      const i = s.annotations.findIndex((x) => x.id === a.id);
      if (i >= 0) s.annotations[i] = a; else s.annotations.push(a);
    });
  }
  async deleteAnnotation(id: string): Promise<void> {
    await repo.deleteAnnotation(id);
    this.update((s) => {
      s.annotations = s.annotations.filter((a) => a.id !== id);
    });
  }
  annotationsOf(clipId: string): Annotation[] {
    return this.state.annotations
      .filter((a) => a.clipId === clipId)
      .sort((a, b) => a.frame - b.frame);
  }

  // —— 设置 ——
  updateSettings(mutator: (s: AppSettings) => void): void {
    mutator(this.state.settings);
    saveSettings(this.state.settings);
    this.state.analysisCache.clear();
    this.emit();
  }

  navigate(page: PageName, clipId?: string): void {
    this.update((s) => {
      s.page = page;
      if (clipId !== undefined) s.activeClipId = clipId;
    });
  }
  setCompare(a: string | null, b: string | null): void {
    this.update((s) => { s.compareA = a; s.compareB = b; });
  }
}

export const store = new Store();
export { uid };
