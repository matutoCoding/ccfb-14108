// 哈希路由：#/athletes | #/library | #/sessions | #/replay | #/compare | #/settings
export type Route =
  | { name: 'athletes' }
  | { name: 'library' }
  | { name: 'sessions'; sessionId?: string }
  | { name: 'replay'; recordId?: string }
  | { name: 'compare'; a?: string; b?: string }
  | { name: 'settings' };

export function parseHash(): Route {
  const raw = location.hash.replace(/^#\/?/, '');
  const [name, ...rest] = raw.split('/');
  const id = rest[0] ? decodeURIComponent(rest[0]) : undefined;
  switch (name) {
    case 'library':
      return { name: 'library' };
    case 'sessions':
      return { name: 'sessions', sessionId: id };
    case 'replay':
      return { name: 'replay', recordId: id };
    case 'compare':
      return { name: 'compare', a: rest[0], b: rest[1] };
    case 'settings':
      return { name: 'settings' };
    case 'athletes':
    default:
      return { name: 'athletes' };
  }
}

export function navigate(hash: string): void {
  location.hash = hash;
}

export function onRoute(cb: (r: Route) => void): () => void {
  const handler = () => cb(parseHash());
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}
