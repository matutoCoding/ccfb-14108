import './ui/styles.css';
import { h } from './ui/dom';
import { onRoute, parseHash, type Route } from './ui/router';
import { db } from './core/db';
import { seedIfEmpty } from './core/seed';
import { renderAthletesPage } from './ui/pages/athletes';
import { renderLibraryPage } from './ui/pages/library';
import { renderSessionsPage } from './ui/pages/sessions';
import { renderReplayPage } from './ui/pages/replay';
import { renderComparePage } from './ui/pages/compare';
import { renderSettingsPage } from './ui/pages/settings';

const NAV: { hash: string; label: string; match: string }[] = [
  { hash: '#/athletes', label: '队员档案', match: 'athletes' },
  { hash: '#/library', label: '动作库', match: 'library' },
  { hash: '#/sessions', label: '训练课', match: 'sessions' },
  { hash: '#/replay', label: '三维回放', match: 'replay' },
  { hash: '#/compare', label: '对比分析', match: 'compare' },
  { hash: '#/settings', label: '设置', match: 'settings' },
];

async function bootstrap(): Promise<void> {
  const settings = await db.getSettings();
  await seedIfEmpty(settings);

  const app = document.getElementById('app')!;
  app.innerHTML = '';
  const topbar = h('div', { class: 'topbar' },
    h('div', { class: 'brand' }, '🏊 跳水动作分析'),
    ...NAV.map((n) => h('button', { 'data-nav': n.match, onclick: () => { location.hash = n.hash; } }, n.label)),
  );
  const pageContainer = h('div', { class: 'page' });
  app.append(h('div', { class: 'app-shell' }, topbar, pageContainer));

  const render = async (r: Route) => {
    topbar.querySelectorAll('button').forEach((b) =>
      b.classList.toggle('active', b.dataset.nav === r.name));
    pageContainer.innerHTML =
      '<div style="color:var(--muted);padding:40px;text-align:center">加载中…</div>';
    try {
      switch (r.name) {
        case 'athletes':
          await renderAthletesPage(pageContainer);
          break;
        case 'library':
          await renderLibraryPage(pageContainer);
          break;
        case 'sessions':
          await renderSessionsPage(pageContainer, r.sessionId);
          break;
        case 'replay':
          await renderReplayPage(pageContainer, r.recordId);
          break;
        case 'compare':
          await renderComparePage(pageContainer, r.a, r.b);
          break;
        case 'settings':
          await renderSettingsPage(pageContainer);
          break;
      }
    } catch (e) {
      console.error(e);
      pageContainer.innerHTML = '';
      pageContainer.appendChild(
        h('div', { class: 'empty' }, '页面出错：' + (e as Error).message),
      );
    }
  };

  onRoute((r) => void render(r));
  void render(parseHash());
}

void bootstrap();
