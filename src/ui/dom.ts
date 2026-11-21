// 极简 DOM 构建辅助
type Child = Node | string | null | undefined | false;
type Props<K extends keyof HTMLElementTagNameMap> =
  & Omit<Partial<HTMLElementTagNameMap[K]>, 'style'>
  & { style?: string | Partial<CSSStyleDeclaration>; dataset?: Record<string, string> };

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props<K>,
  children?: Child[] | Child,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  const kids = children === undefined ? [] : Array.isArray(children) ? children : [children];
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null) continue;
    if (k === 'dataset') {
      Object.assign(el.dataset, v);
    } else if (k === 'style' && typeof v === 'string') {
      el.setAttribute('style', v);
    } else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (k === 'class') {
      el.className = v as string;
    } else {
      (el as any)[k] = v;
    }
  }
  for (const c of kids) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(el: HTMLElement): void {
  el.replaceChildren();
}

export function fmtTime(frame: number, rate: number): string {
  const ms = (frame / rate) * 1000;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function download(filename: string, content: string | Blob, mime = 'text/plain'): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileText(file: File): Promise<string> {
  return file.text();
}
