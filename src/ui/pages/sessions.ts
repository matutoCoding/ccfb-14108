// 训练课页:按日期串起每一跳;BVH/CSV 导入、自动事件识别、缺陷修复
import { h, clear, download, readFileText } from '../dom';
import { store, uid } from '../../core/store';
import { parseBVH } from '../../core/bvh';
import { parseCSV } from '../../core/csv';
import { detectAndRepair, markedRanges } from '../../core/repair';
import { detectEvents, detectApex, detectOpenFrame } from '../../core/analysis';
import type { DiveClip, TrainingSession } from '../../core/types';

export function renderSessionsPage(root: HTMLElement): void {
  clear(root);
  const s = store.state;

  const openSessionEditor = (sess?: TrainingSession) => {
    const editing: TrainingSession = sess ? { ...sess, clipIds: [...sess.clipIds] } : {
      id: uid('sess'), date: new Date().toISOString().slice(0, 10),
      venue: '', platformHeight: 3, boardType: 'spring', note: '', clipIds: [], createdAt: Date.now(),
    };
    const modal = h('div', { className: 'modal-backdrop' }, [
      h('div', { className: 'modal' }, [
        h('h3', {}, sess ? '编辑训练课' : '新建训练课'),
        h('div', { className: 'form-grid' }, [
          field('日期', h('input', { type: 'date', value: editing.date,
            oninput: (e: Event) => (editing.date = (e.target as HTMLInputElement).value) })),
          field('场馆', h('input', { value: editing.venue, placeholder: '省跳水馆 3米板',
            oninput: (e: Event) => (editing.venue = (e.target as HTMLInputElement).value) })),
          field('高度(米)', selectEl(String(editing.platformHeight),
            [['1', '1 米板'], ['3', '3 米板'], ['5', '5 米台'], ['7.5', '7.5 米台'], ['10', '10 米台']],
            (v) => { editing.platformHeight = Number(v); editing.boardType = Number(v) <= 3 ? 'spring' : 'platform'; })),
          field('备注', h('textarea', { rows: 2, oninput: (e: Event) => (editing.note = (e.target as HTMLTextAreaElement).value) }, editing.note)),
        ]),
        h('div', { className: 'row', style: 'margin-top:16px;justify-content:flex-end' }, [
          h('button', { onclick: () => modal.remove() }, '取消'),
          h('button', {
            className: 'primary', onclick: async () => {
              await store.saveSession(editing); modal.remove(); renderSessionsPage(root);
            },
          }, '保存'),
        ]),
      ]),
    ]);
    document.body.appendChild(modal);
  };

  root.append(
    h('div', { className: 'toolbar' }, [
      h('h2', { className: 'page-title', style: 'margin:0' }, '训练课'),
      h('div', { className: 'spacer' }),
      h('button', { className: 'primary', onclick: () => openSessionEditor() }, '+ 新建训练课'),
    ]),
  );

  if (s.sessions.length === 0) {
    root.append(h('div', { className: 'empty' }, '暂无训练课'));
    return;
  }

  for (const sess of [...s.sessions].sort((a, b) => b.date.localeCompare(a.date))) {
    const clips = sess.clipIds
      .map((id) => s.clips.find((c) => c.id === id))
      .filter((c): c is DiveClip => Boolean(c));
    const card = h('div', { className: 'card', style: 'margin-bottom:16px' }, [
      h('div', { className: 'row' }, [
        h('h3', { style: 'margin:0' }, `${sess.date} · ${sess.venue || '未命名场馆'}`),
        h('span', { className: 'tag' }, `${sess.platformHeight}米${sess.boardType === 'spring' ? '跳板' : '跳台'}`),
        h('div', { className: 'spacer' }),
        h('button', { onclick: () => openSessionEditor(sess) }, '编辑'),
        h('button', {
          className: 'danger', onclick: async () => {
            if (confirm('删除该训练课?片段数据保留在库中')) {
              await store.deleteSession(sess.id); renderSessionsPage(root);
            }
          },
        }, '删除'),
      ]),
      sess.note ? h('p', { className: 'muted', style: 'margin:8px 0' }, sess.note) : null,
    ]);

    const rows = h('div', { style: 'margin-top:10px;display:flex;flex-direction:column;gap:8px' });
    clips.forEach((clip, idx) => {
      const athlete = s.athletes.find((a) => a.id === clip.athleteId);
      const ranges = markedRanges(clip);
      rows.appendChild(h('div', { className: 'row card', style: 'padding:10px 14px;margin:0' }, [
        h('b', { style: 'color:var(--accent);min-width:64px' }, `#${idx + 1} ${clip.diveCode}`),
        h('span', { className: 'muted' }, athlete?.name ?? '未知队员'),
        h('span', { className: 'tag' }, `${clip.frameCount} 帧 @${clip.sampleRate}Hz`),
        ranges.length
          ? h('span', { className: 'tag yellow' }, `${ranges.length} 段缺陷已修复`)
          : h('span', { className: 'tag green' }, '数据完整'),
        h('div', { className: 'spacer' }),
        h('button', { onclick: () => store.navigate('playback', clip.id) }, '回放分析'),
        h('button', {
          className: 'danger', onclick: async () => {
            if (confirm('删除这一跳?')) {
              sess.clipIds = sess.clipIds.filter((x) => x !== clip.id);
              await store.saveSession(sess);
              await store.deleteClip(clip.id);
              renderSessionsPage(root);
            }
          },
        }, '删除'),
      ]));
    });
    card.appendChild(rows);

    // 导入区
    const importRow = h('div', { className: 'row', style: 'margin-top:12px' }, [
      makeImportButton(sess, '导入 BVH', '.bvh', async (file) => {
        const text = await readFileText(file);
        await importClip(text, 'bvh', sess, file.name);
      }),
      makeImportButton(sess, '导入 CSV', '.csv', async (file) => {
        const text = await readFileText(file);
        await importClip(text, 'csv', sess, file.name);
      }),
      h('span', { className: 'muted', style: 'font-size:12px' },
        '导入后自动识别离板/入水,丢帧与关节翻转自动标黄并补插值'),
    ]);
    card.appendChild(importRow);
    root.append(card);
  }

  async function importClip(text: string, kind: 'bvh' | 'csv', sess: TrainingSession, filename: string): Promise<void> {
    if (s.athletes.length === 0) { alert('请先建立队员档案'); return; }
    const athlete = s.athletes[0];
    // 从文件名尝试提取动作代码(如 107B_xxx.bvh)
    const codeMatch = /[1-6]\d{2,3}[ABCD]/.exec(filename.toUpperCase());
    const diveCode = codeMatch?.[0] ?? '107B';
    const id = uid('clip');
    let clip: DiveClip;
    let unresolved: string[] = [];
    if (kind === 'bvh') {
      const r = parseBVH(text, { athleteId: athlete.id, diveCode, sessionId: sess.id, id },
        s.settings.boneMaps[s.settings.activeBoneMap]);
      clip = r.clip; unresolved = r.unresolvedBones;
    } else {
      clip = parseCSV(text, { athleteId: athlete.id, diveCode, sessionId: sess.id, id,
        sampleRate: s.settings.sampleRate }).clip;
    }
    // 缺陷检测修复 + 事件识别
    detectAndRepair(clip);
    const hipH = athlete.heightCm / 100 * 0.521;
    const ev = detectEvents(clip, s.settings.waterLevelY, sess.platformHeight, hipH, athlete.heightCm / 100 * 0.9);
    clip.takeoffFrame = ev.takeoffFrame;
    clip.entryFrame = ev.entryFrame;
    clip.apexFrame = detectApex(clip);
    await store.saveClip(clip);
    const analysis = store.analysis(clip);
    clip.openFrame = detectOpenFrame(clip, analysis.metrics, s.settings);
    await store.saveClip(clip);
    sess.clipIds.push(clip.id);
    await store.saveSession(sess);
    if (unresolved.length) {
      alert(`导入成功,但有 ${unresolved.length} 块骨骼未映射,请到「设置」页手动对一次骨骼名`);
    }
    renderSessionsPage(root);
  }
}

function makeImportButton(
  sess: TrainingSession, label: string, accept: string,
  handler: (file: File) => void,
): HTMLElement {
  const input = h('input', {
    type: 'file', accept, style: 'display:none',
    onchange: async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) await handler(file);
      (e.target as HTMLInputElement).value = '';
    },
  }) as HTMLInputElement;
  return h('span', {}, [
    h('button', { onclick: () => input.click() }, label),
    input,
  ]);
}

function field(label: string, control: HTMLElement): HTMLElement {
  return h('div', {}, [h('label', {}, label), control]);
}
function selectEl(value: string, options: Array<[string, string]>, onChange: (v: string) => void): HTMLSelectElement {
  const el = h('select', {}, options.map(([v, label]) => h('option', { value: v, selected: v === value }, label)));
  el.addEventListener('change', () => onChange(el.value));
  return el;
}

export { download };
