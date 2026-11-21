// 动作库页:按动作代码归档,挂难度系数,支持自定义新代码
import { h, clear } from '../dom';
import { store, uid } from '../../core/store';
import { defineFromCode, parseDiveCode, groupName, positionName, somersaultsOf, twistsOf } from '../../core/diveCodes';
import type { DiveDefinition } from '../../core/types';

export function renderDivesPage(root: HTMLElement): void {
  clear(root);
  const s = store.state;

  const openEditor = (d?: DiveDefinition) => {
    const editing: DiveDefinition = d ? { ...d } : {
      code: '', group: 1, name: '', somersaults: 0, twists: 0,
      position: 'B', dd: 0, platform: 'both',
    };
    const modal = h('div', { className: 'modal-backdrop' }, [
      h('div', { className: 'modal' }, [
        h('h3', {}, d ? '编辑动作' : '新增动作代码'),
        h('div', { className: 'form-grid' }, [
          field('动作代码(如 107B)', h('input', {
            value: editing.code,
            placeholder: '107B / 5253B',
            oninput: (e: Event) => {
              const code = (e.target as HTMLInputElement).value.trim().toUpperCase();
              editing.code = code;
              const parsed = parseDiveCode(code);
              if (parsed) {
                editing.group = parsed.group;
                editing.somersaults = parsed.halfSomersault / 2;
                editing.twists = parsed.halfTwist / 2;
                editing.position = parsed.position;
                if (!editing.name) editing.name = `${groupName(parsed.group, parsed.direction)}动作`;
              }
            },
          })),
          field('动作名称', h('input', {
            value: editing.name, oninput: (e: Event) => (editing.name = (e.target as HTMLInputElement).value),
          })),
          field('难度系数 DD', h('input', {
            type: 'number', step: '0.1', value: String(editing.dd),
            oninput: (e: Event) => (editing.dd = Number((e.target as HTMLInputElement).value)),
          })),
          field('翻腾周数(自动解析,可手改)', h('input', {
            type: 'number', step: '0.5', value: String(editing.somersaults),
            oninput: (e: Event) => (editing.somersaults = Number((e.target as HTMLInputElement).value)),
          })),
          field('转体周数', h('input', {
            type: 'number', step: '0.5', value: String(editing.twists),
            oninput: (e: Event) => (editing.twists = Number((e.target as HTMLInputElement).value)),
          })),
          field('适用场地', selectEl(editing.platform, [['both', '板台通用'], ['spring', '仅跳板'], ['platform', '仅跳台']],
            (v) => (editing.platform = v as DiveDefinition['platform']))),
        ]),
        h('div', { className: 'row', style: 'margin-top:16px;justify-content:flex-end' }, [
          h('button', { onclick: () => modal.remove() }, '取消'),
          h('button', {
            className: 'primary',
            onclick: async () => {
              if (!parseDiveCode(editing.code)) { alert('动作代码格式不合法'); return; }
              await store.saveDive(editing);
              modal.remove();
              renderDivesPage(root);
            },
          }, '保存'),
        ]),
      ]),
    ]);
    document.body.appendChild(modal);
  };

  root.append(
    h('div', { className: 'toolbar' }, [
      h('h2', { className: 'page-title', style: 'margin:0' }, '动作库'),
      h('span', { className: 'muted' }, `共 ${s.dives.length} 个动作,按 FINA 代码归档`),
      h('div', { className: 'spacer' }),
      h('button', { className: 'primary', onclick: () => openEditor() }, '+ 新增动作代码'),
    ]),
  );

  const table = h('div', { className: 'card scroll-x' }, [
    h('table', {}, [
      h('thead', {}, h('tr', {}, [
        h('th', {}, '代码'), h('th', {}, '名称'), h('th', {}, '组别'),
        h('th', {}, '翻腾'), h('th', {}, '转体'), h('th', {}, '姿态'),
        h('th', {}, '难度系数'), h('th', {}, '场地'), h('th', {}, '本队已跳'), h('th', {}, '操作'),
      ])),
      h('tbody', {}, s.dives.map((d) => {
        const count = s.clips.filter((c) => c.diveCode === d.code).length;
        return h('tr', {}, [
          h('td', {}, h('b', { style: 'color:var(--accent)' }, d.code)),
          h('td', {}, d.name),
          h('td', {}, groupName(d.group)),
          h('td', {}, `${trimNum(d.somersaults)} 周`),
          h('td', {}, d.twists ? `${trimNum(d.twists)} 周` : '—'),
          h('td', {}, positionName(d.position)),
          h('td', {}, h('span', { className: 'tag yellow' }, d.dd ? d.dd.toFixed(1) : '待填')),
          h('td', {}, d.platform === 'both' ? '板/台' : d.platform === 'spring' ? '跳板' : '跳台'),
          h('td', {}, `${count} 跳`),
          h('td', {}, h('button', { onclick: () => openEditor(d) }, '编辑')),
        ]);
      })),
    ]),
  ]);
  root.append(table);

  // 代码解析提示卡
  const sample = defineFromCode('5253B');
  root.append(h('div', { className: 'card', style: 'margin-top:16px' }, [
    h('h3', {}, '代码规则(录入时自动解析)'),
    h('div', { className: 'muted' }, [
      h('div', {}, '第1位 组别:1 向前 / 2 向后 / 3 反身 / 4 向内 / 5 转体 / 6 倒立'),
      h('div', {}, '第3位 半翻腾数:7 = 三周半;转体动作第4位为半转体数:3 = 一周半'),
      h('div', {}, `末位姿态:A 直体 / B 屈体 / C 抱膝 / D 任意。示例 5253B → 翻腾 ${sample?.somersaults} 周 + 转体 ${sample?.twists} 周`),
      h('div', { style: 'margin-top:6px' }, `校验:107B 解析为翻腾 ${somersaultsOf('107B')} 周、转体 ${twistsOf('107B')} 周`),
    ]),
  ]));
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n);
}
function field(label: string, control: HTMLElement): HTMLElement {
  return h('div', {}, [h('label', {}, label), control]);
}
function selectEl(value: string, options: Array<[string, string]>, onChange: (v: string) => void): HTMLSelectElement {
  const el = h('select', {}, options.map(([v, label]) => h('option', { value: v, selected: v === value }, label)));
  el.addEventListener('change', () => onChange(el.value));
  return el;
}
// uid 占位引用(保持模块依赖一致)
void uid;
