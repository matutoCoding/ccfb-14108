// 设置页:关节角度阈值、采样率、骨骼命名映射(不同厂商对一次后自动复用)
import { h, clear } from '../dom';
import { store } from '../../core/store';
import { JOINT_NAMES, BUILTIN_BONE_MAPS } from '../../core/skeleton';
import { Joint } from '../../core/types';
import type { AppSettings } from '../../core/types';

export function renderSettingsPage(root: HTMLElement): void {
  clear(root);
  const s = store.state;

  root.append(h('h2', { className: 'page-title' }, '系统设置'));

  // —— 阈值 ——
  const th = s.settings.thresholds;
  const thCard = h('div', { className: 'card' }, [
    h('h3', {}, '关节角度阈值(度)'),
    h('div', { className: 'form-grid' }, [
      numField('抱膝膝角阈值(小于算抱紧)', th.tuckKneeDeg, (v) => th.tuckKneeDeg = v),
      numField('抱膝髋角阈值', th.tuckHipDeg, (v) => th.tuckHipDeg = v),
      numField('屈体髋角阈值', th.pikeHipDeg, (v) => th.pikeHipDeg = v),
      numField('入水垂直告警角', th.entryVerticalDeg, (v) => th.entryVerticalDeg = v),
      numField('跳板下压参考量(mm)', th.boardFlexMm, (v) => th.boardFlexMm = v),
    ]),
    h('p', { className: 'muted', style: 'font-size:12px;margin-top:8px' },
      '保存后所有片段的分析结果缓存将清空,下次打开回放时按新阈值重算'),
  ]);

  // —— 采样率/水面/残影 ——
  const genCard = h('div', { className: 'card' }, [
    h('h3', {}, '回放与生成'),
    h('div', { className: 'form-grid' }, [
      numField('动捕采样率(Hz)', s.settings.sampleRate, (v) => s.settings.sampleRate = v),
      numField('水面高度(米)', s.settings.waterLevelY, (v) => s.settings.waterLevelY = v),
      numField('残影间隔帧数 N', s.settings.comTrailStep, (v) => s.settings.comTrailStep = v),
      numField('残影不透明度(0-1)', s.settings.ghostAlpha, (v) => s.settings.ghostAlpha = v),
    ]),
  ]);

  root.append(h('div', { className: 'grid cols-2' }, [thCard, genCard]));

  // —— 骨骼命名映射 ——
  const mapCard = h('div', { className: 'card', style: 'margin-top:16px' }, [
    h('div', { className: 'row' }, [
      h('h3', { style: 'margin:0' }, '骨骼命名映射'),
      h('span', { className: 'muted' }, '不同厂商 BVH 骨骼名对不上时,手动对一次,以后自动套用'),
    ]),
  ]);

  const vendorSelect = h('select', {
    onchange: (e: Event) => {
      s.settings.activeBoneMap = (e.target as HTMLSelectElement).value;
      store.updateSettings(() => {});
      renderSettingsPage(root);
    },
  }, [
    h('option', { value: 'mixamo', selected: s.settings.activeBoneMap === 'mixamo' }, 'Mixamo / 通用人形'),
    h('option', { value: 'generic', selected: s.settings.activeBoneMap === 'generic' }, '带前缀厂商(mixamorig:)'),
    ...Object.keys(s.settings.boneMaps).filter((k) => k !== 'mixamo' && k !== 'generic')
      .map((k) => h('option', { value: k, selected: s.settings.activeBoneMap === k }, k)),
  ]);
  const addVendor = h('button', {
    onclick: () => {
      const name = prompt('新厂商映射名称(如 xsens / optitrack):');
      if (!name) return;
      if (!s.settings.boneMaps[name]) s.settings.boneMaps[name] = {};
      s.settings.activeBoneMap = name;
      store.updateSettings(() => {});
      renderSettingsPage(root);
    },
  }, '+ 新厂商映射');
  mapCard.append(h('div', { className: 'row', style: 'margin:12px 0' }, [
    h('div', { style: 'min-width:240px' }, [h('label', {}, '当前厂商'), vendorSelect]),
    addVendor,
  ]));

  const currentMap = s.settings.boneMaps[s.settings.activeBoneMap]
    ?? BUILTIN_BONE_MAPS[s.settings.activeBoneMap] ?? {};
  const rows = h('div', { className: 'scroll-x' }, [
    h('table', {}, [
      h('thead', {}, h('tr', {}, [
        h('th', {}, '本系统关节'), h('th', {}, '厂商骨骼名(可编辑)'), h('th', {}, '状态'),
      ])),
      h('tbody', {}, JOINT_NAMES.map((jn, jid) => {
        const mappedName = Object.entries(currentMap).find(([, sysJ]) => sysJ === jid)?.[0] ?? '';
        const input = h('input', {
          value: mappedName, placeholder: jn,
          onchange: (e: Event) => {
            const v = (e.target as HTMLInputElement).value.trim();
            if (!s.settings.boneMaps[s.settings.activeBoneMap]) {
              s.settings.boneMaps[s.settings.activeBoneMap] = { ...currentMap };
            }
            const map = s.settings.boneMaps[s.settings.activeBoneMap];
            // 清掉旧映射
            for (const k of Object.keys(map)) if (map[k] === jid) delete map[k];
            if (v) map[v] = jid as Joint;
          },
        });
        return h('tr', {}, [
          h('td', {}, jn),
          h('td', {}, input),
          h('td', {}, mappedName
            ? h('span', { className: 'tag green' }, '已映射')
            : h('span', { className: 'tag orange' }, '待映射')),
        ]);
      })),
    ]),
  ]);
  mapCard.append(rows);
  mapCard.append(h('div', { className: 'row', style: 'margin-top:12px' }, [
    h('button', {
      className: 'primary',
      onclick: () => {
        saveSettings(s.settings);
        store.updateSettings(() => {});
        alert('映射已保存,后续导入该厂商 BVH 自动套用');
      },
    }, '保存映射'),
    h('span', { className: 'muted', style: 'font-size:12px' },
      '内置两套映射作为起点,编辑后会另存为当前厂商的自定义表,不影响内置表'),
  ]));
  root.append(mapCard);

  // —— 保存/重置 ——
  root.append(h('div', { className: 'row', style: 'margin-top:16px' }, [
    h('button', {
      className: 'primary',
      onclick: () => {
        saveSettings(s.settings);
        store.updateSettings(() => {});
        alert('设置已保存并生效');
      },
    }, '保存全部设置'),
    h('button', {
      onclick: () => {
        if (confirm('恢复默认设置?自定义骨骼映射保留')) {
          localStorage.removeItem('dive-analyzer-settings');
          location.reload();
        }
      },
    }, '恢复默认'),
  ]));
}

function numField(label: string, value: number, onChange: (v: number) => void): HTMLElement {
  return h('div', {}, [
    h('label', {}, label),
    h('input', {
      type: 'number', value: String(value),
      oninput: (e: Event) => onChange(Number((e.target as HTMLInputElement).value)),
    }),
  ]);
}

// 直接复用 storage 的保存
import { saveSettings } from '../../core/storage';
export type { AppSettings };
