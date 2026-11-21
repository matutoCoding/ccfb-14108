// 队员档案页:身高/臂展/体重 CRUD
import { h, clear } from '../dom';
import { store, uid } from '../../core/store';
import type { Athlete } from '../../core/types';

export function renderAthletesPage(root: HTMLElement): void {
  clear(root);
  const s = store.state;

  const openEditor = (a?: Athlete) => {
    const editing: Athlete = a ? { ...a } : {
      id: uid('ath'), name: '', gender: 'male', birthYear: 2008,
      heightCm: 165, armSpanCm: 168, weightKg: 55, team: '省队跳水组',
      createdAt: Date.now(),
    };
    const modal = h('div', { className: 'modal-backdrop' }, [
      h('div', { className: 'modal' }, [
        h('h3', {}, a ? '编辑队员档案' : '新建队员档案'),
        h('div', { className: 'form-grid' }, [
          field('姓名', input('text', editing.name, (v) => (editing.name = v))),
          field('队伍', input('text', editing.team, (v) => (editing.team = v))),
          field('性别', select(editing.gender, [['male', '男'], ['female', '女']], (v) => (editing.gender = v as Athlete['gender']))),
          field('出生年份', input('number', String(editing.birthYear), (v) => (editing.birthYear = Number(v)))),
          field('身高 (cm)', input('number', String(editing.heightCm), (v) => (editing.heightCm = Number(v)))),
          field('臂展 (cm)', input('number', String(editing.armSpanCm), (v) => (editing.armSpanCm = Number(v)))),
          field('体重 (kg)', input('number', String(editing.weightKg), (v) => (editing.weightKg = Number(v)))),
        ]),
        h('div', { className: 'row', style: 'margin-top:16px;justify-content:flex-end' }, [
          h('button', { onclick: () => modal.remove() }, '取消'),
          h('button', {
            className: 'primary',
            onclick: async () => {
              if (!editing.name.trim()) { alert('请填写姓名'); return; }
              await store.saveAthlete(editing);
              modal.remove();
              renderAthletesPage(root);
            },
          }, '保存'),
        ]),
      ]),
    ]);
    document.body.appendChild(modal);
  };

  root.append(
    h('div', { className: 'toolbar' }, [
      h('h2', { className: 'page-title', style: 'margin:0' }, '队员档案'),
      h('div', { className: 'spacer' }),
      h('button', { className: 'primary', onclick: () => openEditor() }, '+ 新建队员'),
    ]),
  );

  if (s.athletes.length === 0) {
    root.append(h('div', { className: 'empty' }, '暂无队员,点击右上角新建'));
    return;
  }

  const grid = h('div', { className: 'grid cols-3' });
  for (const a of s.athletes) {
    const clipCount = s.clips.filter((c) => c.athleteId === a.id).length;
    grid.appendChild(h('div', { className: 'card' }, [
      h('div', { className: 'row' }, [
        h('h3', { style: 'margin:0' }, a.name),
        h('div', { className: 'spacer' }),
        h('span', { className: `tag ${a.gender === 'male' ? 'blue' : 'purple'}` },
          a.gender === 'male' ? '男' : '女'),
      ]),
      h('div', { className: 'kv', style: 'margin-top:12px' }, [
        h('span', { className: 'k' }, '出生年份'), h('span', {}, String(a.birthYear)),
        h('span', { className: 'k' }, '身高'), h('span', {}, `${a.heightCm} cm`),
        h('span', { className: 'k' }, '臂展'), h('span', {}, `${a.armSpanCm} cm`),
        h('span', { className: 'k' }, '体重'), h('span', {}, `${a.weightKg} kg`),
        h('span', { className: 'k' }, '队伍'), h('span', {}, a.team),
        h('span', { className: 'k' }, '累计动作'), h('span', {}, `${clipCount} 跳`),
      ]),
      h('div', { className: 'row', style: 'margin-top:14px' }, [
        h('button', { onclick: () => openEditor(a) }, '编辑'),
        h('button', {
          className: 'danger',
          onclick: async () => {
            if (confirm(`删除队员 ${a.name}?其历史动作片段不会被删除`)) {
              await store.deleteAthlete(a.id);
              renderAthletesPage(root);
            }
          },
        }, '删除'),
      ]),
    ]));
  }
  root.append(grid);
}

function field(label: string, control: HTMLElement): HTMLElement {
  return h('div', {}, [h('label', {}, label), control]);
}
function input(type: string, value: string, onInput: (v: string) => void): HTMLInputElement {
  return h('input', { type, value, oninput: (e: Event) => onInput((e.target as HTMLInputElement).value) });
}
function select(value: string, options: Array<[string, string]>, onChange: (v: string) => void): HTMLSelectElement {
  const el = h('select', {}, options.map(([v, label]) =>
    h('option', { value: v, selected: v === value }, label)));
  el.addEventListener('change', () => onChange(el.value));
  return el;
}
