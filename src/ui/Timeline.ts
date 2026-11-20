// 可拖动时间轴：播放头、四个关键帧标记（离板/最高点/打开/入水）、异常段黄色高亮
import type { DiveEvents, MoCapRecord, QualitySegment } from '../core/types';
import { h } from './dom';

export interface TimelineCallbacks {
  onSeek: (frame: number) => void;
  onEventChange: (events: DiveEvents) => void;
  currentFrame: () => number;
}

const EVENT_STYLE: Record<keyof DiveEvents, { label: string; color: string }> = {
  takeoffFrame: { label: '离板', color: '#34d399' },
  apexFrame: { label: '最高点', color: '#fbbf24' },
  openFrame: { label: '打开', color: '#a78bfa' },
  entryFrame: { label: '入水', color: '#f87171' },
};

export class Timeline {
  readonly el: HTMLElement;
  private track!: HTMLElement;
  private playhead!: HTMLElement;
  private record: MoCapRecord;
  private cb: TimelineCallbacks;

  constructor(record: MoCapRecord, cb: TimelineCallbacks) {
    this.record = record;
    this.cb = cb;
    this.el = this.build();
  }

  private get last(): number {
    return this.record.frames.length - 1;
  }

  private build(): HTMLElement {
    const wrap = h('div', { class: 'timeline' });
    const info = h(
      'div',
      { class: 'row', style: 'font-size:12px;color:var(--muted)' },
      h('span', {}, `共 ${this.record.frames.length} 帧 · ${this.record.sampleRate}Hz`),
      h('div', { class: 'spacer' }),
      ...this.qualitySummary(),
    );
    this.track = h('div', { class: 'track' });
    this.playhead = h('div', { class: 'playhead' });
    this.track.appendChild(this.playhead);

    // 异常段黄色带
    for (const q of this.record.quality) this.track.appendChild(this.qualityBand(q));
    // 事件标记
    (Object.keys(EVENT_STYLE) as (keyof DiveEvents)[]).forEach((key) => {
      this.track.appendChild(this.eventMarker(key));
    });

    // 轨道点击/拖动 seek
    const seekFromEvent = (e: PointerEvent) => {
      const rect = this.track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      this.cb.onSeek(Math.round(ratio * this.last));
    };
    this.track.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).classList.contains('marker')) return;
      seekFromEvent(e);
      const move = (ev: PointerEvent) => seekFromEvent(ev);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });

    wrap.append(info, this.track);
    return wrap;
  }

  private qualitySummary(): HTMLElement[] {
    if (!this.record.quality.length) {
      return [h('span', { class: 'tag good' }, '数据质量正常')];
    }
    return this.record.quality.map((q) =>
      h(
        'span',
        { class: 'tag warn', title: q.note },
        q.kind === 'dropped' ? `丢帧 ${q.startFrame}-${q.endFrame}` : `翻转 ${q.startFrame}-${q.endFrame}`,
      ),
    );
  }

  private qualityBand(q: QualitySegment): HTMLElement {
    const band = h('div', { class: 'quality-band', title: q.note });
    band.style.left = `${(q.startFrame / this.last) * 100}%`;
    band.style.width = `${((q.endFrame - q.startFrame) / this.last) * 100}%`;
    return band;
  }

  private eventMarker(key: keyof DiveEvents): HTMLElement {
    const style = EVENT_STYLE[key];
    const marker = h('div', { class: 'marker' });
    marker.style.background = style.color;
    const flag = h(
      'div',
      { class: 'flag', style: `background:${style.color};color:#0b1220` },
      style.label,
    );
    marker.appendChild(flag);
    marker.dataset.event = key;

    const place = () => {
      marker.style.left = `${(this.record.events[key] / this.last) * 100}%`;
      flag.textContent = `${style.label} ${this.record.events[key]}`;
    };
    place();

    marker.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const rect = this.track.getBoundingClientRect();
      const move = (ev: PointerEvent) => {
        const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
        const frame = Math.round(ratio * this.last);
        this.record.events[key] = frame;
        place();
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        this.cb.onEventChange({ ...this.record.events });
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
    return marker;
  }

  update(): void {
    const f = this.cb.currentFrame();
    this.playhead.style.left = `${(f / this.last) * 100}%`;
  }

  /** 外部（如重新检测）改变事件后刷新标记位置 */
  refreshMarkers(): void {
    const markers = this.track.querySelectorAll<HTMLElement>('.marker');
    markers.forEach((m) => {
      const key = m.dataset.event as keyof DiveEvents;
      m.style.left = `${(this.record.events[key] / this.last) * 100}%`;
      const flag = m.querySelector('.flag');
      if (flag) flag.textContent = `${EVENT_STYLE[key].label} ${this.record.events[key]}`;
    });
  }
}
