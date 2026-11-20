// 训练课：按日期把当天每一跳串起来；支持合成生成与 BVH/CSV 导入
import type {
  AppSettings,
  Athlete,
  DiveLibraryEntry,
  MoCapRecord,
  PlatformInfo,
  TrainingSession,
} from '../../core/types';
import { db } from '../../core/db';
import { parseDiveCode } from '../../core/settings';
import { generateDive } from '../../core/generator';
import { buildSkeleton } from '../../core/skeleton';
import { importBvh, importCsv } from '../../core/io';
import { analyzeRecord } from '../../core/kinematics';
import { h, clear, modal, toast, readTextFile, download } from '../dom';
import { navigate } from '../router';
import { uid } from '../../core/math';
import { buildScatterData, renderScatter } from '../ScatterChart';

export async function renderSessionsPage(container: HTMLElement, sessionId?: string): Promise<void> {
  clear(container);
  const [sessions, athletes, dives, settings] = await Promise.all([
    db.listSessions(),
    db.listAthletes(),
    db.listDives(),
    db.getSettings(),
  ]);
  sessions.sort((a, b) => b.date.localeCompare(a.date));

  container.append(
    h('h1', { class: 'page-title' }, '训练课'),
    h('p', { class: 'page-sub' }, '每堂课按日期把当天的每一跳顺序串起来；可生成合成动捕或导入 BVH / CSV。'),
    h('div', { class: 'row', style: 'margin-bottom:16px' },
      h('div', { class: 'spacer' }),
      h('button', { class: 'primary', onclick: () => sessionForm() }, '+ 新建训练课'),
    ),
  );

  if (!sessions.length) {
    container.appendChild(h('div', { class: 'empty' }, '还没有训练课。'));
    return;
  }

  await renderEntryTrend(container, athletes, settings);

  for (const s of sessions) {
    const athlete = athletes.find((a) => a.id === s.athleteId);
    const card = h('div', { class: 'card' });
    const head = h('div', { class: 'row' },
      h('h3', { style: 'margin:0;flex:1' }, `${s.date} · ${s.title}`),
      h('span', { class: 'tag' }, athlete?.name ?? '未知队员'),
      h('span', { class: 'tag' }, s.platform.type === 'springboard' ? '3m 跳板' : '10m 跳台'),
      h('span', { class: 'tag purple' }, `${s.recordIds.length} 跳`),
      h('button', { onclick: () => addDiveDialog(s) }, '加一跳'),
      h('button', {
        onclick: () => navigate(`#/replay/${s.recordIds[0] ?? ''}`),
        disabled: s.recordIds.length === 0 ? 'true' : 'false',
      }, '回放'),
      h('button', {
        class: 'danger',
        onclick: async () => {
          if (!confirm('删除整堂课及其动捕记录？')) return;
          for (const id of s.recordIds) await db.deleteRecord(id);
          await db.deleteSession(s.id);
          renderSessionsPage(container);
        },
      }, '删除'),
    );
    card.appendChild(head);

    const list = h('div', { class: 'grid cols-4', style: 'margin-top:14px' });
    const records = await Promise.all(s.recordIds.map((id) => db.getRecord(id)));
    records.forEach((r, idx) => {
      if (!r) return;
      const info = safeParse(r.diveCode);
      const a = athlete ? analyzeRecord(r, buildSkeleton(athlete), settings.thresholds) : null;
      list.appendChild(h('div', {
        class: 'metric',
        style: 'cursor:pointer',
        onclick: () => navigate(`#/replay/${r.id}`),
      },
        h('div', { class: 'k' }, `第 ${idx + 1} 跳 · ${r.diveCode}`),
        h('div', { class: 'val', style: 'font-size:16px' }, info?.label ?? r.diveCode),
        h('div', { style: 'font-size:12px;color:var(--muted);margin-top:4px' },
          a ? `翻腾 ${Math.abs(a.totalSomersaults).toFixed(2)} 圈 · 入水角 ${a.entryAngleDeg.toFixed(0)}°` : '',
        ),
        h('div', { style: 'margin-top:6px' },
          r.repaired ? h('span', { class: 'tag warn' }, '异常已修复') : h('span', { class: 'tag good' }, '数据正常'),
        ),
      ));
    });
    card.appendChild(list);
    container.appendChild(card);
  }

  function safeParse(code: string) {
    try {
      return parseDiveCode(code);
    } catch {
      return null;
    }
  }

  function sessionForm(): void {
    if (!athletes.length) return toast('请先在队员档案里创建队员');
    const dateIn = h('input', { type: 'date', value: new Date().toISOString().slice(0, 10) }) as HTMLInputElement;
    const titleIn = h('input', { placeholder: '如 周一 三米板专项' }) as HTMLInputElement;
    const athIn = h('select', {}, ...athletes.map((a) => h('option', { value: a.id }, a.name))) as HTMLSelectElement;
    const pfIn = h('select', {},
      h('option', { value: 'springboard' }, '3m 跳板'),
      h('option', { value: 'platform' }, '10m 跳台'),
    ) as HTMLSelectElement;
    const body = h('div', { class: 'grid cols-2' },
      f('日期', dateIn), f('标题', titleIn), f('队员', athIn), f('场地', pfIn),
    );
    const save = h('button', { class: 'primary' }, '创建');
    const m = modal('新建训练课', body, h('div', { class: 'row' },
      h('div', { class: 'spacer' }), h('button', { onclick: () => m.close() }, '取消'), save));
    save.addEventListener('click', async () => {
      const session: TrainingSession = {
        id: uid('ses_'),
        date: dateIn.value,
        title: titleIn.value || '训练课',
        athleteId: athIn.value,
        platform: pfIn.value === 'springboard'
          ? { heightM: 3, type: 'springboard' }
          : { heightM: 10, type: 'platform' },
        recordIds: [],
        createdAt: Date.now(),
      };
      await db.saveSession(session);
      m.close();
      renderSessionsPage(container, session.id);
    });
  }

  function addDiveDialog(session: TrainingSession): void {
    const athlete = athletes.find((a) => a.id === session.athleteId);
    if (!athlete) return toast('队员不存在');
    const codeIn = h('input', { list: 'dive-codes', placeholder: '如 107B' }) as HTMLInputElement;
    const dataList = h('datalist', { id: 'dive-codes' },
      ...dives.map((d: DiveLibraryEntry) => h('option', { value: d.code }, d.label)));
    const errIn = h('input', { type: 'number', step: '1', value: '8' }) as HTMLInputElement;
    const openIn = h('input', { type: 'number', step: '0.01', value: '0.72' }) as HTMLInputElement;
    const corruptIn = h('input', { type: 'checkbox' }) as HTMLInputElement;
    const fileIn = h('input', { type: 'file', accept: '.bvh,.csv' }) as HTMLInputElement;
    const profile = settings.boneMapProfiles[settings.activeProfile];

    const body = h('div', {},
      dataList,
      f('动作代码', codeIn),
      h('div', { class: 'grid cols-3', style: 'margin-top:10px' },
        f('入水角误差(°)', errIn), f('打开时机(0-1)', openIn),
        h('div', {}, h('label', {}, '注入异常数据'), corruptIn)),
      h('hr', { style: 'border-color:var(--border);margin:16px 0' }),
      f('或导入 BVH / CSV（选了文件则忽略上方合成参数）', fileIn),
    );

    const genBtn = h('button', { class: 'primary' }, '生成 / 导入');
    const m = modal('加一跳', body, h('div', { class: 'row' },
      h('div', { class: 'spacer' }), h('button', { onclick: () => m.close() }, '取消'), genBtn));

    genBtn.addEventListener('click', async () => {
      try {
        let record: MoCapRecord;
        if (fileIn.files?.length) {
          const file = fileIn.files[0];
          const text = await readTextFile(file);
          const opts = {
            athlete,
            sessionId: session.id,
            diveCode: codeIn.value || '107B',
            platform: session.platform,
            boneProfile: profile,
          };
          record = file.name.toLowerCase().endsWith('.csv')
            ? importCsv(text, { ...opts, source: 'csv' })
            : importBvh(text, { ...opts, source: 'bvh' });
        } else {
          parseDiveCode(codeIn.value); // 校验
          record = generateDive({
            athlete,
            code: codeIn.value.toUpperCase(),
            platform: session.platform,
            sampleRate: settings.sampleRate,
            sessionId: session.id,
            entryAngleError: Number(errIn.value),
            openFraction: Number(openIn.value),
            corrupt: corruptIn.checked,
          });
        }
        session.recordIds.push(record.id);
        await db.saveRecord(record);
        await db.saveSession(session);
        m.close();
        toast(`${record.diveCode} 已加入，离板帧 ${record.events.takeoffFrame} / 入水帧 ${record.events.entryFrame}`);
        renderSessionsPage(container, session.id);
      } catch (e) {
        toast((e as Error).message);
      }
    });
  }
}

/** 同一动作历次入水角散点趋势（每个有≥2 跳的动作一张图） */
async function renderEntryTrend(
  container: HTMLElement,
  athletes: Athlete[],
  settings: AppSettings,
): Promise<void> {
  const records = await db.listRecords();
  const codes = [...new Set(records.map((r) => r.diveCode))];
  const charts: HTMLElement[] = [];
  for (const code of codes) {
    const codeRecords = records.filter((r) => r.diveCode === code);
    if (codeRecords.length < 2) continue;
    const athlete = athletes.find((a) => a.id === codeRecords[0].athleteId);
    if (!athlete) continue;
    const points = buildScatterData(codeRecords, code, athlete, settings);
    if (points.length < 2) continue;
    const canvas = h('canvas', { style: 'width:100%;height:200px' }) as HTMLCanvasElement;
    const card = h('div', { class: 'card' },
      h('h3', {}, `${code} 历次入水角趋势（共 ${points.length} 跳）`),
      canvas,
    );
    charts.push(card);
    requestAnimationFrame(() => renderScatter(canvas, points, settings.thresholds.entryAngleDeg));
  }
  if (charts.length) {
    const wrap = h('div', { class: 'grid cols-2' }, ...charts);
    container.appendChild(h('div', {}, h('h2', { class: 'page-title', style: 'font-size:17px;margin-top:8px' }, '入水角历史趋势'), wrap));
  }
}

function f(label: string, input: HTMLElement): HTMLElement {
  return h('div', {}, h('label', {}, label), input);
}

export async function exportRecordJson(records: MoCapRecord[]): Promise<void> {
  download(`dive-records-${Date.now()}.json`, JSON.stringify(records, null, 2), 'application/json');
}

export type { AppSettings, PlatformInfo };
