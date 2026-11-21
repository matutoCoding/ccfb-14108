// 入水角历史趋势散点图(纯 SVG,无图表库):同一动作历次入水角
import { h } from './dom';
import { store } from '../core/store';
import type { DiveClip } from '../core/types';

export function createEntryAngleScatter(diveCode: string): HTMLElement {
  const clips = store.state.clips
    .filter((c) => c.diveCode === diveCode)
    .sort((a, b) => a.createdAt - b.createdAt);
  const wrap = h('div', { className: 'card' }, [h('h3', {}, `${diveCode} 历次入水角趋势`)]);
  if (clips.length === 0) {
    wrap.append(h('div', { className: 'muted' }, '暂无该动作的历史数据'));
    return wrap;
  }

  const W = 560; const H = 220; const PAD = 42;
  const points = clips.map((c) => {
    const a = safeAnalysis(c);
    return { clip: c, angle: a?.entryAngleDeg ?? 0 };
  });
  const maxAngle = Math.max(20, ...points.map((p) => p.angle)) * 1.1;
  const xStep = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0;
  const x = (i: number) => PAD + (points.length === 1 ? (W - PAD * 2) / 2 : i * xStep);
  const y = (v: number) => H - PAD - (v / maxAngle) * (H - PAD * 2);

  const svg = hNS('svg', { viewBox: `0 0 ${W} ${H}`, class: 'scatter' });
  // 坐标轴
  svg.appendChild(hNS('line', { x1: PAD, y1: H - PAD, x2: W - 10, y2: H - PAD, stroke: '#475569' }));
  svg.appendChild(hNS('line', { x1: PAD, y1: 10, x2: PAD, y2: H - PAD, stroke: '#475569' }));
  // 告警阈值线
  const threshold = store.state.settings.thresholds.entryVerticalDeg;
  svg.appendChild(hNS('line', {
    x1: PAD, y1: y(threshold), x2: W - 10, y2: y(threshold),
    stroke: '#ef4444', 'stroke-dasharray': '6 4',
  }));
  svg.appendChild(hNS('text', { x: W - 12, y: y(threshold) - 4, fill: '#ef4444', 'text-anchor': 'end', 'font-size': 11 },
    `告警线 ${threshold}°`));
  // y 轴刻度
  for (let v = 0; v <= maxAngle; v += 5) {
    svg.appendChild(hNS('text', { x: PAD - 6, y: y(v) + 4, fill: '#93a4c0', 'text-anchor': 'end', 'font-size': 10 }, `${v}°`));
  }
  // 散点 + 连线
  points.forEach((p, i) => {
    const cx = x(i); const cy = y(p.angle);
    const c = hNS('circle', {
      cx, cy, r: 6, fill: p.angle <= threshold ? '#22c55e' : '#f97316',
      class: 'dot-annot',
    });
    c.addEventListener('click', () => store.navigate('playback', p.clip.id));
    svg.appendChild(c);
    svg.appendChild(hNS('text', {
      x: cx, y: cy - 10, fill: '#e6edf7', 'text-anchor': 'middle', 'font-size': 10,
    }, p.angle.toFixed(1)));
    if (i > 0) {
      svg.appendChild(hNS('line', {
        x1: x(i - 1), y1: y(points[i - 1].angle), x2: cx, y2: cy,
        stroke: '#38bdf8', 'stroke-opacity': 0.5,
      }));
    }
    svg.appendChild(hNS('text', {
      x: cx, y: H - PAD + 16, fill: '#93a4c0', 'text-anchor': 'middle', 'font-size': 10,
    }, `#${i + 1}`));
  });
  wrap.append(svg);
  wrap.append(h('p', { className: 'muted', style: 'font-size:12px' }, '点圆点可跳转到该跳回放;橙色点超出垂直告警角'));
  return wrap;
}

function safeAnalysis(c: DiveClip) {
  try { return store.analysis(c); } catch { return undefined; }
}

function hNS<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  text?: string,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (text) el.textContent = text;
  return el;
}
