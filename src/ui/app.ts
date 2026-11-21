// 应用外壳:顶部导航 + 页面路由
import { h, clear } from './dom';
import { store } from '../core/store';
import { renderAthletesPage } from './pages/athletes';
import { renderDivesPage } from './pages/dives';
import { renderSessionsPage } from './pages/sessions';
import { renderPlaybackPage } from './pages/playback';
import { renderComparePage } from './pages/compare';
import { renderSettingsPage } from './pages/settings';
import type { PageName } from '../core/store';

/** 当前页面注册的清理函数(释放 WebGL 上下文、监听器等) */
let cleanupCurrent: (() => void) | null = null;
export function registerPageCleanup(fn: () => void): void {
  cleanupCurrent = fn;
}

const NAV: Array<[PageName, string]> = [
  ['athletes', '队员档案'],
  ['dives', '动作库'],
  ['sessions', '训练课'],
  ['playback', '三维回放'],
  ['compare', '对比分析'],
  ['settings', '设置'],
];

const renderers: Record<PageName, (root: HTMLElement) => void> = {
  athletes: renderAthletesPage,
  dives: renderDivesPage,
  sessions: renderSessionsPage,
  playback: renderPlaybackPage,
  compare: renderComparePage,
  settings: renderSettingsPage,
};

export function mountApp(rootEl: HTMLElement): void {
  const main = h('div', { className: 'app-main' });
  const navButtons = new Map<PageName, HTMLButtonElement>();

  const shell = h('div', { className: 'app-shell' }, [
    h('header', { className: 'app-header' }, [
      h('h1', {}, '🏊 跳水动作分析系统'),
      h('nav', { className: 'nav' }, NAV.map(([page, label]) => {
        const btn = h('button', {
          onclick: () => store.navigate(page),
        }, label);
        navButtons.set(page, btn);
        return btn;
      })),
    ]),
    main,
  ]);
  rootEl.append(shell);

  function render(): void {
    cleanupCurrent?.();
    cleanupCurrent = null;
    clear(main);
    const { page } = store.state;
    navButtons.forEach((btn, p) => btn.classList.toggle('active', p === page));
    try {
      renderers[page](main);
    } catch (err) {
      console.error(err);
      main.append(h('div', { className: 'empty' },
        `页面渲染失败:${err instanceof Error ? err.message : String(err)}`));
    }
    main.scrollTop = 0;
  }
  store.subscribe(render);
  render();
}
