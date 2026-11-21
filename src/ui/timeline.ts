// 时间轴组件:缺陷段标黄、关键帧事件、可拖动的离板/入水游标
import { h } from './dom';
import type { DiveClip } from '../core/types';
import { markedRanges } from '../core/repair';

export interface TimelineCallbacks {
  onSeek: (frame: number) => void;
  /** 拖动事件标记(离板/入水)改变 */
  onMoveEvent?: (kind: 'takeoffFrame' | 'entryFrame', frame: number) => void;
}

const EVENT_STYLE: Record<string, { color: string; label: string }> = {
  takeoffFrame: { color: '#22c55e', label: '离板' },
  apexFrame: { color: '#eab308', label: '最高点' },
  openFrame: { color: '#f97316', label: '打开' },
  entryFrame: { color: '#ef4444', label: '入水' },
};

export function createTimeline(
  clip: DiveClip,
  currentFrame: number,
  cb: TimelineCallbacks,
): HTMLElement {
  const rate = clip.sampleRate;
  const n = clip.frameCount;
  const ranges = markedRanges(clip);

  const track = h('div', { className: 'timeline-track' });

  // 缺陷段标黄
  for (const r of ranges) {
    track.appendChild(h('div', {
      className: 'timeline-defect',
      title: r.label,
      style: `left:${(r.start / n) * 100}%;width:${((r.end - r.start + 1) / n) * 100}%`,
    }));
  }

  // 事件标记(离板/入水可拖)
  for (const [key, st] of Object.entries(EVENT_STYLE)) {
    const f = (clip as any)[key] as number;
    if (f < 0) continue;
    const movable = key === 'takeoffFrame' || key === 'entryFrame';
    const marker = h('div', {
      className: 'timeline-event',
      style: `left:${(f / n) * 100}%;background:${st.color};${movable ? 'cursor:ew-resize' : ''}`,
      title: `${st.label} 第${f}帧 (${(f / rate).toFixed(2)}s)${movable ? ' 可拖动修正' : ''}`,
    }, [h('span', { className: 'ev-label', style: `color:${st.color}` }, st.label)]);
    if (movable && cb.onMoveEvent) {
      marker.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const move = (ev: PointerEvent) => {
          const rect = track.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
          const nf = Math.round(ratio * (n - 1));
          cb.onMoveEvent?.(key as 'takeoffFrame' | 'entryFrame', nf);
        };
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    }
    track.appendChild(marker);
  }

  // 当前帧游标
  const cursor = h('div', {
    className: 'timeline-cursor',
    style: `left:${(currentFrame / n) * 100}%`,
  });
  track.appendChild(cursor);

  track.addEventListener('pointerdown', (e) => {
    const rect = track.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    cb.onSeek(Math.round(Math.max(0, Math.min(1, ratio)) * (n - 1)));
  });

  // 秒刻度
  const tickRow = h('div', { className: 'tick-row' });
  const totalSec = n / rate;
  const tickStep = totalSec > 2 ? 0.5 : 0.25;
  for (let t = 0; t <= totalSec; t += tickStep) {
    tickRow.appendChild(h('span', {
      className: 'tick',
      style: `left:${(t / totalSec) * 100}%`,
    }, `${t.toFixed(2)}s`));
  }

  return h('div', { className: 'timeline' }, [track, tickRow]);
}

/** 刷新游标位置(不重建整个时间轴) */
export function updateTimelineCursor(timeline: HTMLElement, frame: number, n: number): void {
  const cursor = timeline.querySelector('.timeline-cursor') as HTMLElement | null;
  if (cursor) cursor.style.left = `${(frame / n) * 100}%`;
}
