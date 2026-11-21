// 跳水动作代码库:代码解析 + 内置动作定义(含难度系数 DD)
import type { DiveDefinition } from './types';

/**
 * 解析跳水动作代码
 * 第1位:组别 1向前 2向后 3反身 4向内 5转体 6倒立
 * 第2位(1-4组):飞行动作 0普通 1飞身;(5组)方向 1前 2后 3反 4内
 * 第3位:半翻腾数 (7 = 3.5 周)
 * 第4位(5组):半转体数 (3 = 1.5 周)
 * 末位:姿态 A直体 B屈体 C抱膝 D任意
 */
export interface ParsedCode {
  group: number;
  flying: boolean;
  direction?: number;      // 5 组:1前 2后 3反 4内
  halfSomersault: number;
  halfTwist: number;
  position: 'A' | 'B' | 'C' | 'D';
}

export function parseDiveCode(code: string): ParsedCode | null {
  const m = /^([1-6])(\d)(\d)(\d)?([ABCD])$/.exec(code.trim());
  if (!m) return null;
  const group = Number(m[1]);
  const second = Number(m[2]);
  const third = Number(m[3]);
  const fourth = m[4] === undefined ? undefined : Number(m[4]);
  const position = m[5] as ParsedCode['position'];
  if (group === 5) {
    if (fourth === undefined) return null;
    return {
      group, flying: false, direction: second,
      halfSomersault: third, halfTwist: fourth, position,
    };
  }
  if (group === 6) {
    if (fourth === undefined) {
      return { group, flying: second === 1, halfSomersault: third, halfTwist: 0, position };
    }
    return { group, flying: second === 1, halfSomersault: third, halfTwist: fourth, position };
  }
  return {
    group, flying: second === 1,
    halfSomersault: third, halfTwist: 0, position,
  };
}

export function somersaultsOf(code: string): number {
  const p = parseDiveCode(code);
  return p ? p.halfSomersault / 2 : 0;
}
export function twistsOf(code: string): number {
  const p = parseDiveCode(code);
  return p ? p.halfTwist / 2 : 0;
}
export function positionName(p: 'A' | 'B' | 'C' | 'D'): string {
  return { A: '直体', B: '屈体', C: '抱膝', D: '任意' }[p];
}
export function groupName(group: number, direction?: number): string {
  if (group === 5) return `转体(${['', '向前', '向后', '反身', '向内'][direction ?? 0]})`;
  return ['', '向前', '向后', '反身', '向内', '转体', '倒立'][group] ?? '未知';
}

/** 内置动作库(DD 取 FINA 常用表近似值,可在动作库页面编辑) */
export const BUILTIN_DIVES: DiveDefinition[] = [
  dive('107B', 1, '向前翻腾三周半屈体', 3.5, 0, 'B', 3.0, 'both'),
  dive('105B', 1, '向前翻腾两周半屈体', 2.5, 0, 'B', 2.6, 'both'),
  dive('105C', 1, '向前翻腾两周半抱膝', 2.5, 0, 'C', 2.4, 'both'),
  dive('205C', 2, '向后翻腾两周半抱膝', 2.5, 0, 'C', 2.8, 'both'),
  dive('205B', 2, '向后翻腾两周半屈体', 2.5, 0, 'B', 3.0, 'both'),
  dive('305C', 3, '反身翻腾两周半抱膝', 2.5, 0, 'C', 2.8, 'both'),
  dive('405C', 4, '向内翻腾两周半抱膝', 2.5, 0, 'C', 2.7, 'both'),
  dive('5253B', 5, '向后翻腾两周半转体一周半屈体', 2.5, 1.5, 'B', 3.2, 'both'),
  dive('5152B', 5, '向前翻腾两周半转体一周屈体', 2.5, 1, 'B', 3.0, 'both'),
  dive('5337D', 5, '反身翻腾一周半转体三周半', 1.5, 3.5, 'D', 3.4, 'platform'),
  dive('626C', 6, '臂立翻腾三周抱膝', 3, 0, 'C', 3.5, 'platform'),
];

function dive(
  code: string, group: number, name: string,
  somersaults: number, twists: number,
  position: 'A' | 'B' | 'C' | 'D', dd: number,
  platform: 'spring' | 'platform' | 'both',
): DiveDefinition {
  return { code, group, name, somersaults, twists, position, dd, platform };
}

/** 根据代码生成/查找动作定义(代码合法但库中没有时自动建档,DD 留 0 待填) */
export function defineFromCode(code: string): DiveDefinition | null {
  const parsed = parseDiveCode(code);
  if (!parsed) return null;
  const existing = BUILTIN_DIVES.find((d) => d.code === code);
  if (existing) return existing;
  const name = `${groupName(parsed.group, parsed.direction)}翻腾${trimNum(parsed.halfSomersault / 2)}周`
    + (parsed.halfTwist ? `转体${trimNum(parsed.halfTwist / 2)}周` : '')
    + positionName(parsed.position);
  return {
    code, group: parsed.group, name,
    somersaults: parsed.halfSomersault / 2,
    twists: parsed.halfTwist / 2,
    position: parsed.position, dd: 0,
    platform: 'both',
  };
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n);
}
