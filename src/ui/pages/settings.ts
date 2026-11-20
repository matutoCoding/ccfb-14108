// 设置：关节角度阈值、采样率、厂商骨骼命名映射、本地数据备份
import type { AppSettings } from '../../core/types';
import { JOINTS } from '../../core/skeleton';
import { db } from '../../core/db';
import { h, clear, toast, download } from '../dom';
import { DEFAULT_SETTINGS } from '../../core/settings';

export async function renderSettingsPage(container: HTMLElement): Promise<void> {
  clear(container);
  const settings = await db.getSettings();

  container.append(
    h('h1', { class: 'page-title' }, '设置'),
    h('p', { class: 'page-sub' }, '阈值与命名映射保存在本地浏览器，下次打开自动生效。'),
  );

  // ---- 阈值与采样率 ----
  const t = settings.thresholds;
  const inp = (val: number, step = 1) => h('input', { type: 'number', step: String(step), value: String(val) }) as HTMLInputElement;
  const tuckHip = inp(t.tuckHipDeg);
  const tuckKnee = inp(t.tuckKneeDeg);
  const pikeHip = inp(t.pikeHipDeg);
  const entryAng = inp(t.entryAngleDeg);
  const sampleRate = inp(settings.sampleRate) as HTMLInputElement;

  const saveThresholds = h('button', { class: 'primary' }, '保存阈值');
  saveThresholds.addEventListener('click', async () => {
    settings.thresholds = {
      tuckHipDeg: Number(tuckHip.value),
      tuckKneeDeg: Number(tuckKnee.value),
      pikeHipDeg: Number(pikeHip.value),
      entryAngleDeg: Number(entryAng.value),
    };
    settings.sampleRate = Number(sampleRate.value);
    await db.saveSettings(settings);
    toast('阈值与采样率已保存（新导入/新生成的数据生效）');
  });

  container.appendChild(h('div', { class: 'card' },
    h('h3', {}, '角度阈值与采样率'),
    h('div', { class: 'grid cols-4' },
      field('团身髋角阈值 (°)', tuckHip),
      field('团身膝角阈值 (°)', tuckKnee),
      field('屈体髋角阈值 (°)', pikeHip),
      field('合格入水角 (°)', entryAng),
      field('动捕采样率 (Hz)', sampleRate),
    ),
    h('div', { style: 'margin-top:14px' }, saveThresholds),
  ));

  // ---- 骨骼命名映射 ----
  const profileSelect = h('select', {},
    ...Object.keys(settings.boneMapProfiles).map((p) => h('option', { value: p }, p)),
  ) as HTMLSelectElement;
  profileSelect.value = settings.activeProfile;
  const mapBody = h('div', {});
  const renderMap = (profileName: string) => {
    clear(mapBody);
    const profile = settings.boneMapProfiles[profileName];
    const rows = JOINTS.map((joint) => {
      const input = h('input', { value: profile[joint] ?? '' }) as HTMLInputElement;
      input.addEventListener('change', () => {
        profile[joint] = input.value.trim() || joint;
      });
      return h('tr', {}, h('td', {}, joint), h('td', {}, input));
    });
    mapBody.appendChild(h('div', { style: 'max-height:340px;overflow:auto;border:1px solid var(--border);border-radius:8px' },
      h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, '规范关节名'), h('th', {}, '厂商 BVH 骨骼名'))),
        h('tbody', {}, ...rows))));
  };
  renderMap(settings.activeProfile);
  profileSelect.addEventListener('change', () => renderMap(profileSelect.value));

  const newProfileName = h('input', { placeholder: '新厂商名，如 vicon' }) as HTMLInputElement;
  container.appendChild(h('div', { class: 'card' },
    h('h3', {}, '骨骼命名映射（不同厂商 BVH 对不上时，手动对一次以后自动用）'),
    h('div', { class: 'row', style: 'margin-bottom:12px' },
      h('div', { style: 'width:220px' }, h('label', {}, '厂商配置'), profileSelect),
      h('button', {
        onclick: () => {
          settings.activeProfile = profileSelect.value;
          db.saveSettings(settings);
          toast(`已切换到 ${profileSelect.value} 映射`);
        },
      }, '设为当前'),
      h('div', { style: 'width:220px' }, h('label', {}, '新建配置'), newProfileName),
      h('button', {
        onclick: () => {
          const name = newProfileName.value.trim();
          if (!name) return toast('请输入厂商名');
          if (settings.boneMapProfiles[name]) return toast('配置已存在');
          settings.boneMapProfiles[name] = Object.fromEntries(JOINTS.map((j) => [j, j]));
          profileSelect.append(h('option', { value: name }, name));
          profileSelect.value = name;
          renderMap(name);
          db.saveSettings(settings);
          toast('已新建，请在下表填厂商原始骨骼名');
        },
      }, '新建'),
    ),
    mapBody,
    h('div', { class: 'row', style: 'margin-top:12px' },
      h('button', { class: 'primary', onclick: () => { db.saveSettings(settings); toast('映射已保存'); } }, '保存映射'),
      h('button', {
        onclick: () => {
          settings.boneMapProfiles = structuredClone(DEFAULT_SETTINGS.boneMapProfiles);
          db.saveSettings(settings);
          toast('已恢复默认映射');
          renderMap(profileSelect.value);
        },
      }, '恢复默认'),
    ),
  ));

  // ---- 数据管理 ----
  container.appendChild(h('div', { class: 'card' },
    h('h3', {}, '本地数据管理'),
    h('p', { style: 'color:var(--muted);font-size:13px' }, '所有数据仅存于本浏览器 IndexedDB，不上传任何服务器。换机请先导出备份。'),
    h('div', { class: 'row' },
      h('button', {
        class: 'primary',
        onclick: async () => {
          const json = await db.exportAll();
          download(`dive-backup-${new Date().toISOString().slice(0, 10)}.json`, json, 'application/json');
          toast('备份已下载');
        },
      }, '导出全部数据 (JSON)'),
      h('button', {
        onclick: () => {
          const inp = h('input', { type: 'file', accept: '.json' }) as HTMLInputElement;
          inp.addEventListener('change', async () => {
            const file = inp.files?.[0];
            if (!file) return;
            try {
              await db.importAll(await file.text());
              toast('导入完成，刷新页面查看');
              setTimeout(() => location.reload(), 800);
            } catch (e) {
              toast('导入失败：' + (e as Error).message);
            }
          });
          inp.click();
        },
      }, '导入备份'),
      h('button', {
        class: 'danger',
        onclick: async () => {
          if (!confirm('清空全部本地数据（队员/动作/训练课/记录/标注）？不可恢复。')) return;
          indexedDB.deleteDatabase('dive-analysis-db');
          toast('已清空，2 秒后刷新');
          setTimeout(() => location.reload(), 1200);
        },
      }, '清空全部数据'),
    ),
  ));
}

function field(label: string, input: HTMLElement): HTMLElement {
  return h('div', {}, h('label', {}, label), input);
}
