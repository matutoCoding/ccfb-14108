// 队员档案
import type { Athlete, MoCapRecord } from '../../core/types';
import { db } from '../../core/db';
import { h, clear, modal, toast } from '../dom';
import { uid } from '../../core/math';

export async function renderAthletesPage(container: HTMLElement): Promise<void> {
  clear(container);
  const [athletes, records] = await Promise.all([db.listAthletes(), db.listRecords()]);

  container.append(
    h('h1', { class: 'page-title' }, '队员档案'),
    h('p', { class: 'page-sub' }, '管理队员身高、臂展、体重；模型按这些尺寸等比缩放蒙皮人体。'),
  );

  const grid = h('div', { class: 'grid cols-3' });
  for (const a of athletes) {
    const count = records.filter((r) => r.athleteId === a.id).length;
    const card = h('div', { class: 'card' },
      h('div', { class: 'row' },
        h('h3', { style: 'margin:0;flex:1' }, a.name),
        h('span', { class: 'tag' }, a.gender === 'M' ? '男' : a.gender === 'F' ? '女' : '未填'),
      ),
      h('div', { class: 'grid cols-3', style: 'margin:12px 0' },
        metric('身高', a.heightM.toFixed(2), 'm'),
        metric('臂展', a.armSpanM.toFixed(2), 'm'),
        metric('体重', String(a.weightKg), 'kg'),
      ),
      h('div', { style: 'color:var(--muted);font-size:12px;margin-bottom:12px' },
        `出生：${a.birthDate ?? '—'} · 累计 ${count} 跳`),
      h('div', { class: 'row' },
        h('button', {
          onclick: () => athleteForm(a),
        }, '编辑'),
        h('button', {
          class: 'danger',
          onclick: async () => {
            if (!confirm(`删除队员 ${a.name}？其全部动捕记录会一并删除。`)) return;
            await db.deleteAthlete(a.id);
            toast('已删除');
            renderAthletesPage(container);
          },
        }, '删除'),
      ),
    );
    grid.appendChild(card);
  }

  const addCard = h('div', {
    class: 'card',
    style: 'display:flex;align-items:center;justify-content:center;min-height:180px;cursor:pointer;border-style:dashed',
    onclick: () => athleteForm(),
  }, h('button', { class: 'primary' }, '+ 新增队员'));
  grid.appendChild(addCard);

  container.appendChild(grid);

  function metric(k: string, val: string, unit: string): HTMLElement {
    return h('div', { class: 'metric' },
      h('div', { class: 'k' }, k),
      h('div', { class: 'val' }, val, ' ', h('span', { class: 'unit' }, unit)));
  }

  function athleteForm(existing?: Athlete): void {
    const data: Athlete = existing
      ? { ...existing }
      : { id: uid('ath_'), name: '', gender: 'M', heightM: 1.65, armSpanM: 1.7, weightKg: 52, createdAt: Date.now() };

    const nameIn = h('input', { value: data.name, placeholder: '姓名' }) as HTMLInputElement;
    const genderIn = h('select', {},
      h('option', { value: 'M' }, '男'),
      h('option', { value: 'F' }, '女'),
      h('option', { value: '' }, '未填'),
    ) as HTMLSelectElement;
    genderIn.value = data.gender;
    const birthIn = h('input', { type: 'date', value: data.birthDate ?? '' }) as HTMLInputElement;
    const hIn = h('input', { type: 'number', step: '0.01', value: String(data.heightM) }) as HTMLInputElement;
    const spanIn = h('input', { type: 'number', step: '0.01', value: String(data.armSpanM) }) as HTMLInputElement;
    const wIn = h('input', { type: 'number', step: '0.1', value: String(data.weightKg) }) as HTMLInputElement;

    const body = h('div', { class: 'grid cols-2' },
      field('姓名', nameIn), field('性别', genderIn), field('出生日期', birthIn),
      field('身高 (m)', hIn), field('臂展 (m)', spanIn), field('体重 (kg)', wIn),
    );
    const save = h('button', { class: 'primary' }, '保存');
    const m = modal(existing ? '编辑队员' : '新增队员', body, h('div', { class: 'row' },
      h('div', { class: 'spacer' }), h('button', { onclick: () => m.close() }, '取消'), save));

    save.addEventListener('click', async () => {
      if (!nameIn.value.trim()) return toast('请填写姓名');
      data.name = nameIn.value.trim();
      data.gender = genderIn.value as Athlete['gender'];
      data.birthDate = birthIn.value;
      data.heightM = Number(hIn.value);
      data.armSpanM = Number(spanIn.value);
      data.weightKg = Number(wIn.value);
      if (!(data.heightM > 0.5 && data.heightM < 2.5)) return toast('身高数值不合理');
      if (!(data.armSpanM > 0.5 && data.armSpanM < 2.8)) return toast('臂展数值不合理');
      await db.saveAthlete(data);
      m.close();
      toast('已保存');
      renderAthletesPage(container);
    });
  }
}

function field(label: string, input: HTMLElement): HTMLElement {
  return h('div', {}, h('label', {}, label), input);
}

export type { MoCapRecord };
