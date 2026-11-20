// 训练课分析单：带关键帧截图的可打印 HTML（Blob 下载，数据不出本地）
import type { AnalysisResult } from '../core/kinematics';
import type { Athlete, MoCapRecord, TrainingSession, Annotation } from '../core/types';
import { parseDiveCode } from '../core/settings';
import { rad2deg } from '../core/math';

export interface ReportRow {
  record: MoCapRecord;
  athlete: Athlete;
  analysis: AnalysisResult;
  annotations: Annotation[];
  shots: { title: string; frame: number; dataUrl: string }[];
}

export function buildReportHtml(session: TrainingSession, rows: ReportRow[]): string {
  const cards = rows
    .map((r) => {
      const info = parseDiveCode(r.record.diveCode);
      const ev = r.record.events;
      const openVsApexMs = ((ev.openFrame - ev.apexFrame) / r.record.sampleRate) * 1000;
      const shots = r.shots
        .map(
          (s) =>
            `<figure><img src="${s.dataUrl}" alt="${s.title}"/><figcaption>${s.title}（第 ${s.frame} 帧）</figcaption></figure>`,
        )
        .join('');
      const anns = r.annotations.length
        ? `<ul>${r.annotations
            .map((a) => `<li>第${a.frame}帧：${escapeHtml(a.text)}</li>`)
            .join('')}</ul>`
        : '<p style="color:#64748b">无标注</p>';
      return `
      <section class="dive">
        <h3>${r.record.diveCode} · ${info.label} <small>难度系数 ${r.athlete ? '' : ''}${r.record.source === 'synthetic' ? '合成数据' : '导入数据'}</small></h3>
        <div class="metrics">
          <div><b>${Math.abs(r.analysis.totalSomersaults).toFixed(2)}</b> 翻腾圈数（目标 ${info.somersaults}）</div>
          <div><b>${Math.abs(r.analysis.totalTwists).toFixed(2)}</b> 转体圈数（目标 ${info.twists}）</div>
          <div><b>${r.analysis.entryAngleDeg.toFixed(1)}°</b> 入水角</div>
          <div><b>${r.analysis.tightRatio.toFixed(2)}</b> 抱紧占比</div>
          <div><b>${openVsApexMs > 0 ? '+' : ''}${openVsApexMs.toFixed(0)}ms</b> 打开相对最高点</div>
          <div><b>(${r.analysis.handEntryOffset.x.toFixed(2)}, ${r.analysis.handEntryOffset.z.toFixed(2)})m</b> 手掌入水偏移</div>
        </div>
        <h4>关键帧截图</h4>
        <div class="shots">${shots}</div>
        <h4>教练标注</h4>
        ${anns}
        ${r.record.quality.length ? `<p class="warn">数据异常（已修复）：${r.record.quality.map((q) => q.note).join('；')}</p>` : ''}
      </section>`;
    })
    .join('');

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/>
<title>训练分析单 ${session.date}</title>
<style>
  body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;max-width:980px;margin:0 auto;padding:32px;color:#0f172a}
  h1{margin-bottom:4px} h3{border-left:4px solid #0ea5e9;padding-left:10px;margin-top:28px}
  .meta{color:#64748b;font-size:13px;margin-bottom:24px}
  .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0}
  .metrics div{background:#f1f5f9;border-radius:8px;padding:10px;font-size:13px}
  .metrics b{display:block;font-size:20px;color:#0369a1;margin-bottom:2px}
  .shots{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  figure{margin:0;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
  img{width:100%;display:block} figcaption{font-size:12px;color:#64748b;padding:6px 10px;background:#f8fafc}
  .warn{background:#fef3c7;padding:8px 12px;border-radius:8px;font-size:13px}
  small{color:#64748b;font-weight:400;font-size:12px}
  @media print{body{padding:8px}}
</style></head><body>
<h1>训练课分析单</h1>
<div class="meta">${session.date} · ${session.title} · 生成时间 ${new Date().toLocaleString('zh-CN')} · 共 ${rows.length} 跳</div>
${cards}
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

export { rad2deg };
