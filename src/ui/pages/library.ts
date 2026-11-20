// 动作库：按跳水动作代码归档，挂难度系数
import type { DiveLibraryEntry } from '../../core/types';
import { db } from '../../core/db';
import { difficultyOf, parseDiveCode } from '../../core/settings';
import { h, clear, modal, toast } from '../dom';
import { navigate } from '../router';

export async function renderLibraryPage(container: HTMLElement): Promise<void> {
  clear(container);
  const entries = await db.listDives();
  entries.sort((a, b) => a.code.localeCompare(b.code));

  container.append(
    h('h1', { class: 'page-title' }, '动作库'),
    h('p', { class: 'page-sub' }, '按国际泳联动作代码归档（如 107B、5253B），每个动作挂难度系数 DD。'),
  );

  const toolbar = h('div', { class: 'row', style: 'margin-bottom:14px' },
    h('div', { class: 'spacer' }),
    h('button', { class: 'primary', onclick: () => diveForm() }, '+ 新增动作'),
  );
  container.appendChild(toolbar);

  if (!entries.length) {
    container.appendChild(h('div', { class: 'empty' }, '动作库为空，点右上角新增。'));
    return;
  }

  const table = h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, '代码'), h('th', {}, '组别'), h('th', {}, '姿势'),
      h('th', {}, '翻腾/转体'), h('th', {}, '难度系数 DD'), h('th', {}, '说明'), h('th', {}, ''))),
    h('tbody', {}, ...entries.map((d) => row(d))),
  );
  container.appendChild(h('div', { class: 'card', style: 'padding:0;overflow:auto' }, table));

  function row(d: DiveLibraryEntry): HTMLElement {
    return h('tr', {},
      h('td', {}, h('strong', {}, d.code)),
      h('td', {}, `第 ${d.group} 组`),
      h('td', {}, d.position),
      h('td', {}, d.label),
      h('td', {}, h('span', { class: 'tag purple' }, d.dd.toFixed(1))),
      h('td', { style: 'color:var(--muted)' }, d.notes ?? '—'),
      h('td', {}, h('div', { class: 'row' },
        h('button', { onclick: () => diveForm(d) }, '编辑'),
        h('button', {
          class: 'danger',
          onclick: async () => {
            if (!confirm(`删除动作 ${d.code}？`)) return;
            await db.deleteDive(d.code);
            renderLibraryPage(container);
          },
        }, '删除'),
      )),
    );
  }

  function diveForm(existing?: DiveLibraryEntry): void {
    const codeIn = h('input', {
      value: existing?.code ?? '',
      placeholder: '如 107B / 5253B',
    }) as HTMLInputElement;
    const ddIn = h('input', {
      type: 'number',
      step: '0.1',
      value: existing ? String(existing.dd) : '',
      placeholder: '留空自动估算',
    }) as HTMLInputElement;
    const notesIn = h('textarea', { rows: '3' }) as HTMLTextAreaElement;
    notesIn.value = existing?.notes ?? '';

    codeIn.addEventListener('input', () => {
      try {
        const info = parseDiveCode(codeIn.value);
        if (!ddIn.value) ddIn.value = String(difficultyOf(info.code));
      } catch { /* 输入中，忽略 */ }
    });

    const body = h('div', {},
      h('div', {}, h('label', {}, '动作代码'), codeIn),
      h('div', { style: 'margin-top:12px' }, h('label', {}, '难度系数 DD'), ddIn),
      h('div', { style: 'margin-top:12px' }, h('label', {}, '备注'), notesIn),
    );
    const save = h('button', { class: 'primary' }, '保存');
    const m = modal(existing ? '编辑动作' : '新增动作', body,
      h('div', { class: 'row' }, h('div', { class: 'spacer' }),
        h('button', { onclick: () => m.close() }, '取消'), save));

    save.addEventListener('click', async () => {
      try {
        const info = parseDiveCode(codeIn.value);
        const entry: DiveLibraryEntry = {
          code: info.code,
          group: info.group,
          position: info.position,
          label: info.label,
          dd: ddIn.value ? Number(ddIn.value) : difficultyOf(info.code),
          notes: notesIn.value || undefined,
        };
        await db.saveDive(entry);
        m.close();
        toast(`已保存 ${info.code}`);
        navigate('#/library');
        renderLibraryPage(container);
      } catch (e) {
        toast((e as Error).message);
      }
    });
  }
}
