import './ui/styles.css';
import { mountApp } from './ui/app';
import { store } from './core/store';
import { seedDemoData, resetDemoData, isSeeded } from './core/demoData';

async function bootstrap(): Promise<void> {
  await store.init();
  await seedDemoData();

  const root = document.getElementById('app')!;
  mountApp(root);

  // 控制台提供重置演示数据的入口
  (window as any).diveApp = {
    resetDemoData,
    isSeeded,
    store,
  };
  console.info('%c跳水动作分析系统已就绪', 'color:#38bdf8;font-size:14px');
  console.info('如需重置演示数据,在控制台执行 diveApp.resetDemoData()');
}

bootstrap().catch((err) => {
  console.error(err);
  document.getElementById('app')!.innerHTML =
    `<pre style="padding:24px;color:#fca5a5">启动失败:${err instanceof Error ? err.stack : err}</pre>`;
});
