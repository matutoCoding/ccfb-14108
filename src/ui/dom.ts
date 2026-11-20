// 轻量 DOM 构建工具 + 全局提示
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | boolean | ((e: Event) => void)> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, val] of Object.entries(attrs)) {
    if (k === 'class') el.className = String(val);
    else if (k === 'dataset') Object.assign(el.dataset, val);
    else if (k.startsWith('on') && typeof val === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), val as (e: Event) => void);
    } else if (k === 'html') el.innerHTML = String(val);
    else el.setAttribute(k, String(val));
  }
  for (const c of children) {
    if (typeof c === 'string') el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  }
  return el;
}

export function clear(el: HTMLElement): void {
  el.innerHTML = '';
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string, ms = 2600): void {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const el = h('div', { class: 'toast' }, msg);
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), ms);
}

export function modal(title: string, body: HTMLElement, footer?: HTMLElement): { close: () => void; root: HTMLElement } {
  const closeBtn = h('button', { class: 'danger' }, '关闭');
  const foot = footer ?? h('div', { class: 'row' }, h('div', { class: 'spacer' }), closeBtn);
  const root = h('div', { class: 'modal' }, h('h3', {}, title), body, foot);
  const backdrop = h('div', { class: 'modal-backdrop' }, root);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  const close = () => backdrop.remove();
  closeBtn.addEventListener('click', close);
  document.body.appendChild(backdrop);
  return { close, root };
}

export function fmtMs(frame: number, sampleRate: number): string {
  return `${((frame / sampleRate) * 1000).toFixed(0)} ms`;
}

export function download(filename: string, content: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename }) as HTMLAnchorElement;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readTextFile(file: File): Promise<string> {
  return file.text();
}
