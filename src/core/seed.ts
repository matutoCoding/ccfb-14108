// 首次启动播种：2 名队员、动作库、3 个训练课、7 跳合成数据（含 1 跳损坏数据）
import type {
  AppSettings,
  Athlete,
  DiveLibraryEntry,
  MoCapRecord,
  PlatformInfo,
  TrainingSession,
} from './types';
import { buildSkeleton } from './skeleton';
import { difficultyOf, parseDiveCode } from './settings';
import { generateDive } from './generator';
import { analyzeRecord } from './kinematics';
import { db } from './db';
import { uid } from './math';

const SPRING_3M: PlatformInfo = { heightM: 3, type: 'springboard' };
const PLATFORM_10M: PlatformInfo = { heightM: 10, type: 'platform' };

const SEED_DIVES = ['107B', '205C', '5253B', '105B', '305B', '405C', '5152B', '207C'];

export async function seedIfEmpty(settings: AppSettings): Promise<void> {
  const existing = await db.listAthletes();
  if (existing.length > 0) return;

  const athletes: Athlete[] = [
    {
      id: 'ath_zhang',
      name: '张启航',
      gender: 'M',
      birthDate: '2008-04-12',
      heightM: 1.68,
      armSpanM: 1.74,
      weightKg: 56,
      createdAt: Date.now(),
    },
    {
      id: 'ath_lin',
      name: '林雨桐',
      gender: 'F',
      birthDate: '2009-09-03',
      heightM: 1.58,
      armSpanM: 1.61,
      weightKg: 47,
      createdAt: Date.now(),
    },
  ];
  await Promise.all(athletes.map((a) => db.saveAthlete(a)));

  const library: DiveLibraryEntry[] = SEED_DIVES.map((code) => {
    const info = parseDiveCode(code);
    return { code, dd: difficultyOf(code), group: info.group, position: info.position, label: info.label };
  });
  await Promise.all(library.map((d) => db.saveDive(d)));

  const session1: TrainingSession = {
    id: 'ses_20261116',
    date: '2026-11-16',
    title: '周一 三米板专项',
    athleteId: 'ath_zhang',
    platform: SPRING_3M,
    recordIds: [],
    createdAt: Date.now(),
  };
  const session2: TrainingSession = {
    id: 'ses_20261118',
    date: '2026-11-18',
    title: '周三 十米台成套',
    athleteId: 'ath_zhang',
    platform: PLATFORM_10M,
    recordIds: [],
    createdAt: Date.now(),
  };
  const session3: TrainingSession = {
    id: 'ses_20261119',
    date: '2026-11-19',
    title: '周四 女子台训练',
    athleteId: 'ath_lin',
    platform: PLATFORM_10M,
    recordIds: [],
    createdAt: Date.now(),
  };

  const spec = buildSkeleton(athletes[0]);
  const make = (
    athlete: Athlete,
    code: string,
    platform: PlatformInfo,
    extra: Partial<Parameters<typeof generateDive>[0]> = {},
  ): MoCapRecord =>
    generateDive({
      athlete,
      code,
      platform,
      sampleRate: settings.sampleRate,
      sessionId: '',
      ...extra,
    });

  const r1 = make(athletes[0], '107B', SPRING_3M, { openFraction: 0.7, entryAngleError: 6 });
  const r2 = make(athletes[0], '107B', SPRING_3M, { openFraction: 0.74, entryAngleError: 10 });
  const r3 = make(athletes[0], '107B', SPRING_3M, { openFraction: 0.68, entryAngleError: 3 });
  const r4 = make(athletes[0], '205C', PLATFORM_10M, { openFraction: 0.72, entryAngleError: 8 });
  const r5 = make(athletes[0], '5253B', PLATFORM_10M, { openFraction: 0.76, entryAngleError: 12 });
  // 损坏跳：107B，带丢帧 + 关节翻转
  const r6 = make(athletes[0], '107B', SPRING_3M, {
    corrupt: true,
    openFraction: 0.72,
    entryAngleError: 14,
  });
  const r7 = make(athletes[1], '205C', PLATFORM_10M, { openFraction: 0.7, entryAngleError: 5 });

  const attach = (rec: MoCapRecord, sessionId: string) => {
    rec.sessionId = sessionId;
    return rec;
  };
  const s1Recs = [r1, r2, r3, r6].map((r) => attach(r, session1.id));
  const s2Recs = [r4, r5].map((r) => attach(r, session2.id));
  const s3Recs = [r7].map((r) => attach(r, session3.id));

  session1.recordIds = s1Recs.map((r) => r.id);
  session2.recordIds = s2Recs.map((r) => r.id);
  session3.recordIds = s3Recs.map((r) => r.id);

  await Promise.all([...s1Recs, ...s2Recs, ...s3Recs].map((r) => db.saveRecord(r)));
  await Promise.all([session1, session2, session3].map((s) => db.saveSession(s)));

  // 控制台自检：圈数是否与动作代码吻合
  for (const r of [...s1Recs, ...s2Recs, ...s3Recs]) {
    const athlete = athletes.find((a) => a.id === r.athleteId)!;
    const a = analyzeRecord(r, buildSkeleton(athlete), settings.thresholds);
    const info = parseDiveCode(r.diveCode);
    console.info(
      `[播种自检] ${r.diveCode} 翻腾=${a.totalSomersaults.toFixed(3)}圈(期望${info.somersaults}) ` +
        `转体=${a.totalTwists.toFixed(3)}圈(期望${info.twists}) 离板帧=${r.events.takeoffFrame} ` +
        `入水帧=${r.events.entryFrame} 异常段=${r.quality.length}`,
    );
  }
  void spec;
  void uid;
}
