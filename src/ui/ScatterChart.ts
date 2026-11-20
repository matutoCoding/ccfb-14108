// 同一动作历次入水角散点趋势（纯 Canvas 绘制，无第三方图表库）
import type { Athlete, MoCapRecord } from '../core/types';
import { analyzeRecord } from '../core/kinematics';
import type { AppSettings } from '../core/types';
import { buildSkeleton } from '../core/skeleton';

export interface ScatterPoint {
  date: string;
  entryAngle: number;
  recordId: string;
  repaired: boolean;
}

export function buildScatterData(
  records: MoCapRecord[],
  code: string,
  athlete: Athlete,
  settings: AppSettings,
): ScatterPoint[] {
  const spec = buildSkeleton(athlete);
  return records
    .filter((r) => r.diveCode === code)
    .map((r) => ({
      date: String(r.createdAt),
      entryAngle: analyzeRecord(r, spec, settings.thresholds).entryAngleDeg,
      recordId: r.id,
      repaired: r.repaired,
    }))
    .sort((a, b) => Number(a.date) - Number(b.date));
}

export function renderScatter(canvas: HTMLCanvasElement, points: ScatterPoint[], thresholdDeg: number): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const padL = 44;
  const padB = 34;
  const padT = 16;
  const padR = 16;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  // 坐标范围
  const yMax = Math.max(thresholdDeg * 2, ...points.map((p) => p.entryAngle)) + 3;
  const x = (i: number) => padL + (points.length <= 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (val: number) => padT + plotH - (val / yMax) * plotH;

  // 背景网格 + Y 轴刻度
  ctx.strokeStyle = 'rgba(148,163,184,0.18)';
  ctx.fillStyle = '#8aa0bd';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  for (let g = 0; g <= 4; g++) {
    const val = (yMax / 4) * g;
    const yy = y(val);
    ctx.beginPath();
    ctx.moveTo(padL, yy);
    ctx.lineTo(w - padR, yy);
    ctx.stroke();
    ctx.fillText(`${val.toFixed(0)}°`, padL - 6, yy + 4);
  }

  // 合格阈值线
  ctx.strokeStyle = '#f87171';
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(padL, y(thresholdDeg));
  ctx.lineTo(w - padR, y(thresholdDeg));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText(`合格阈值 ${thresholdDeg}°`, padL + 4, y(thresholdDeg) - 5);

  if (!points.length) {
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.font = '13px sans-serif';
    ctx.fillText('暂无该动作的历史数据', w / 2, h / 2);
    return;
  }

  // 趋势折线
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(x(i), y(p.entryAngle));
    else ctx.lineTo(x(i), y(p.entryAngle));
  });
  ctx.stroke();

  // 散点
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p.entryAngle), 6, 0, Math.PI * 2);
    ctx.fillStyle = p.repaired ? '#fbbf24' : p.entryAngle <= thresholdDeg ? '#34d399' : '#f87171';
    ctx.fill();
    ctx.strokeStyle = '#0b1220';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#e6edf7';
    ctx.textAlign = 'center';
    ctx.fillText(p.entryAngle.toFixed(1), x(i), y(p.entryAngle) - 11);
    ctx.fillStyle = '#8aa0bd';
    ctx.fillText(`#${i + 1}`, x(i), h - 12);
  });
}
