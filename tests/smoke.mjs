// 一次性浏览器冒烟测试（用系统 Chrome，不下载浏览器）
import { chromium } from 'playwright-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199';
const errors = [];
const logs = [];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 920 } });
page.on('console', (m) => {
  logs.push(`[${m.type()}] ${m.text()}`);
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

const shot = (name) => page.screenshot({ path: `tests/shots/${name}.png` });
import { mkdirSync } from 'node:fs';
mkdirSync('tests/shots', { recursive: true });

// 1. 首页（队员档案）+ 播种
await page.goto(BASE + '/#/athletes');
await page.waitForSelector('.card', { timeout: 15000 });
await page.waitForTimeout(1200); // 等播种 IndexedDB 事务完成
const athleteNames = await page.locator('.card h3').allInnerTexts();
console.log('队员卡片:', athleteNames);
if (!athleteNames.some((n) => n.includes('张启航'))) throw new Error('播种失败：未找到队员');
await shot('1-athletes');

// 2. 动作库
await page.goto(BASE + '/#/library');
await page.waitForSelector('table');
const codes = await page.locator('tbody tr td strong').allInnerTexts();
console.log('动作库:', codes.slice(0, 8));
if (!codes.includes('107B') || !codes.includes('5253B')) throw new Error('动作库缺代码');
await shot('2-library');

// 3. 训练课
await page.goto(BASE + '/#/sessions');
await page.waitForSelector('.card');
await page.waitForTimeout(600);
const sessionTitles = await page.locator('.card h3').allInnerTexts();
console.log('训练课:', sessionTitles);
const repairedTags = await page.locator('.tag.warn').allInnerTexts();
console.log('异常标记:', repairedTags);
if (!repairedTags.some((t) => t.includes('异常已修复'))) throw new Error('损坏跳未标黄');
await shot('3-sessions');

// 4. 进入第一条记录的回放页
const firstReplay = page.locator('.metric[style*="cursor"]').first();
await firstReplay.click();
await page.waitForSelector('.viewport canvas', { timeout: 15000 });
await page.waitForTimeout(1500);
const frameText1 = await page.locator('.overlay-panel').nth(1).innerText();
console.log('回放帧显示:', frameText1);
await shot('4-replay');

// 播放 1.2 秒看指标是否变化
await page.getByRole('button', { name: '播放' }).click();
await page.waitForTimeout(1200);
await page.getByRole('button', { name: '暂停' }).click().catch(() => {});
const somText = await page.locator('#m-som').innerText();
const twText = await page.locator('#m-tw').innerText();
console.log('实时指标:', somText, '|', twText);
if (!somText.includes('翻腾')) throw new Error('实时指标未更新');
await shot('5-replay-playing');

// 慢放 + 逐帧
await page.getByRole('button', { name: '0.1×' }).click();
await page.getByRole('button', { name: '下一帧 ⏭' }).click();
await page.getByRole('button', { name: '下一帧 ⏭' }).click();
const frameText2 = await page.locator('.overlay-panel').nth(1).innerText();
console.log('逐帧后:', frameText2);

// 时间轴标记存在
const markers = await page.locator('.marker .flag').allInnerTexts();
console.log('关键帧标记:', markers);
if (markers.length < 4) throw new Error('时间轴缺关键帧标记');

// 相机预设
await page.getByRole('button', { name: '锁重心跟随' }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: '水下视角' }).click();
await page.waitForTimeout(400);
await shot('6-replay-underwater');

// 标注流程：挂一条评语，验证持久化且出现在标注列表
await page.getByRole('button', { name: '＋ 标注' }).click();
await page.waitForSelector('.modal textarea');
await page.locator('.modal textarea').fill('冒烟测试：打开略晚，膝盖再夹紧');
await page.getByRole('button', { name: '挂上标注' }).click();
await page.waitForTimeout(600);
const annItems = await page.locator('#ann-list > div').count();
console.log('标注列表条数:', annItems);
if (annItems < 1) throw new Error('标注未挂上');
const annSpriteCount = await page.evaluate(() => {
  // 回放视口里的 sprite 标注（AnnotationLayer 生成）
  return document.querySelectorAll('.viewport canvas').length;
});
console.log('视口 canvas 数（含标注渲染）:', annSpriteCount);

// 5. 对比分析
await page.goto(BASE + '/#/compare');
await page.waitForSelector('.card');
await page.getByRole('button', { name: '开始对比' }).click();
await page.waitForSelector('.viewport canvas', { timeout: 15000 });
await page.waitForTimeout(1200);
const diffTags = await page.locator('.tag.bad').allInnerTexts();
console.log('对比差异:', diffTags);
await shot('7-compare');

// 6. 设置页
await page.goto(BASE + '/#/settings');
await page.waitForSelector('.card');
const settingsText = await page.locator('.card').first().innerText();
console.log('设置包含阈值:', settingsText.includes('团身髋角阈值'));
await shot('8-settings');

// 播种自检日志
const seedLogs = logs.filter((l) => l.includes('播种自检'));
console.log('\n--- 播种自检（圈数核对）---');
seedLogs.forEach((l) => console.log(l.replace('[info] ', '')));

console.log('\n控制台错误数:', errors.length);
errors.forEach((e) => console.log('  ✗', e.slice(0, 200)));
await browser.close();
if (errors.length) {
  // headless 下的 WebGL 软告警与 favicon/静态资源 404 非致命
  const fatal = errors.filter(
    (e) =>
      !e.includes('WebGL') &&
      !e.includes('GPU') &&
      !e.includes('swiftshader') &&
      !e.includes('404') &&
      !e.includes('Failed to load resource'),
  );
  if (fatal.length) {
    fatal.forEach((e) => console.log('FATAL:', e));
    process.exit(1);
  }
  console.log('（仅 headless 软告警/静态资源提示，非致命）');
}
console.log('\n✓ 冒烟测试通过');
