// 演示数据:2 名队员、3 个动作各几跳(含一跳缺陷),两个训练课
import { store, uid } from './store';
import { generateDive } from './generator';
import { detectAndRepair } from './repair';
import { detectEvents, detectApex, detectOpenFrame } from './analysis';
import { BUILTIN_DIVES } from './diveCodes';
import type { Athlete, TrainingSession, DiveClip } from './types';

const SEEDED_KEY = 'dive-analyzer-seeded-v1';

export async function seedDemoData(force = false): Promise<void> {
  if (!force && localStorage.getItem(SEEDED_KEY)) return;
  const s = store.state.settings;

  const athletes: Athlete[] = [
    {
      id: 'ath_linhao', name: '林皓', gender: 'male', birthYear: 2004,
      heightCm: 172, armSpanCm: 178, weightKg: 62, team: '省队跳水组',
      createdAt: Date.now(),
    },
    {
      id: 'ath_suqing', name: '苏晴', gender: 'female', birthYear: 2006,
      heightCm: 161, armSpanCm: 166, weightKg: 51, team: '省队跳水组',
      createdAt: Date.now(),
    },
  ];
  for (const a of athletes) await store.saveAthlete(a);

  const sessions: TrainingSession[] = [
    {
      id: 'sess_20261120', date: '2026-11-20', venue: '省跳水馆 3米板',
      platformHeight: 3, boardType: 'spring', note: '赛前成套动作训练',
      clipIds: [], createdAt: Date.now(),
    },
    {
      id: 'sess_20261121', date: '2026-11-21', venue: '省跳水馆 10米台',
      platformHeight: 10, boardType: 'platform', note: '台上翻腾节奏',
      clipIds: [], createdAt: Date.now(),
    },
  ];
  for (const sess of sessions) await store.saveSession(sess);

  const plan: Array<{
    code: string; athleteId: string; sessionId: string; height: number;
    board: 'spring' | 'platform'; seeds: number[]; defectSeed?: number;
  }> = [
    // 107B:林皓 3 跳,其中第 3 跳掺缺陷
    { code: '107B', athleteId: 'ath_linhao', sessionId: 'sess_20261120', height: 3, board: 'spring', seeds: [11, 23], defectSeed: 47 },
    // 205C:林皓 2 跳、苏晴 1 跳
    { code: '205C', athleteId: 'ath_linhao', sessionId: 'sess_20261120', height: 3, board: 'spring', seeds: [7, 19] },
    { code: '205C', athleteId: 'ath_suqing', sessionId: 'sess_20261121', height: 10, board: 'platform', seeds: [31] },
    // 5253B:苏晴 3 跳
    { code: '5253B', athleteId: 'ath_suqing', sessionId: 'sess_20261121', height: 10, board: 'platform', seeds: [13, 29, 41] },
  ];

  for (const p of plan) {
    const dive = BUILTIN_DIVES.find((d) => d.code === p.code)!;
    const athlete = athletes.find((a) => a.id === p.athleteId)!;
    const allSeeds = p.defectSeed ? [...p.seeds, p.defectSeed] : p.seeds;
    for (const seed of allSeeds) {
      const clip = generateDive({
        athlete, dive, sessionId: p.sessionId, sampleRate: s.sampleRate,
        platformHeight: p.height, boardType: p.board, seed,
        injectDefects: seed === p.defectSeed,
      });
      clip.id = uid('clip');
      // 模拟真实导入:先自动识别事件,再跑缺陷检测修复
      if (clip.defects.length > 0) detectAndRepair(clip);
      const hipTakeoff = athlete.heightCm / 100 * 0.521;
      const ev = detectEvents(clip, s.waterLevelY, p.height, hipTakeoff, athlete.heightCm / 100 * 0.9);
      clip.takeoffFrame = ev.takeoffFrame;
      clip.entryFrame = ev.entryFrame;
      clip.apexFrame = detectApex(clip);
      // 打开帧需要 metrics,这里先存占位,分析页惰性计算时回填
      clip.openFrame = -1;
      await store.saveClip(clip);
      const sess = sessions.find((x) => x.id === p.sessionId)!;
      sess.clipIds.push(clip.id);
    }
  }
  for (const sess of sessions) await store.saveSession(sess);

  // 打开帧回填(依赖分析缓存)
  for (const clip of store.state.clips) {
    if (clip.openFrame < 0) {
      const analysis = store.analysis(clip);
      const athlete = store.athleteOf(clip)!;
      clip.openFrame = detectOpenFrame(
        clip, analysis.metrics, store.state.settings,
      );
      void athlete;
      await store.saveClip(clip);
    }
  }

  localStorage.setItem(SEEDED_KEY, '1');
}

export async function resetDemoData(): Promise<void> {
  localStorage.removeItem(SEEDED_KEY);
  const clips = [...store.state.clips];
  for (const c of clips) await store.deleteClip(c.id);
  const sess = [...store.state.sessions];
  for (const x of sess) await store.deleteSession(x.id);
  const ath = [...store.state.athletes];
  for (const a of ath) await store.deleteAthlete(a.id);
  await seedDemoData(true);
}

export function isSeeded(): boolean {
  return Boolean(localStorage.getItem(SEEDED_KEY));
}
