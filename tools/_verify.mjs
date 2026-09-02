/**
 * cathi-ui 可视化/程序化校验（开发用，非发布物）
 *
 * 用法:
 *   node tools/_verify.mjs
 *
 * 环境变量（均有默认值，按需覆盖）:
 *   PPTR_PATH  puppeteer-core 入口 js 的绝对路径
 *   EDGE_PATH  本地 Chromium/Edge 可执行文件绝对路径
 *
 * 做了什么:
 *   - 打开 index.html，在亮/暗两种主题下采样关键 getComputedStyle
 *   - 对比 cathi-ui.css 与 cathi-ui.min.css 的渲染结果是否完全一致
 *   - 收集 console / requestfailed 错误（例如字体 404）
 *   - 输出全页截图到仓库上级目录
 */
// 通过环境变量注入 puppeteer-core 位置，避免把 devDependency 写进仓库
const PPTR = process.env.PPTR_PATH
  || 'D:/Users/79281/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const { default: puppeteer } = await import(pathToFileURL(PPTR).href);
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EDGE = process.env.EDGE_PATH
  || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(ROOT, '..');

const SAMPLES = [
  ['body', ['backgroundColor', 'color']],
  ['.cathi-btn', ['backgroundColor', 'color', 'borderRadius', 'boxShadow']],
  ['.cathi-btn[data-variant="outline"]', ['backgroundColor', 'borderColor', 'color']],
  ['.cathi-card', ['backgroundColor', 'borderColor', 'borderRadius']],
  ['#demo-name', ['borderColor', 'borderRadius', 'backgroundColor', 'fontSize']],
  ['#demo-mail', ['borderColor', 'boxShadow']],
  ['.cathi-input[data-size="sm"]', ['fontSize', 'paddingTop']],
  ['.cathi-input[data-size="lg"]', ['fontSize', 'paddingTop']],
  ['.cathi-badge', ['backgroundColor', 'color', 'borderRadius']],
  ['.cathi-alert[data-variant="success"]', ['backgroundColor', 'borderLeftColor']],
  ['.cathi-progress__fill', ['backgroundColor', 'borderRadius']],
  ['.cathi-table th', ['backgroundColor', 'color']],
  ['.cathi-kbd', ['borderBottomWidth', 'backgroundColor']],
  ['.cathi-separator', ['height', 'backgroundColor']],
  ['.cathi-tooltip__bubble', ['backgroundColor', 'color', 'borderRadius', 'opacity']],
  ['.cathi-skeleton', ['backgroundColor', 'borderRadius']],
  ['.cathi-checkbox', ['borderRadius', 'width']],
  ['.cathi-slider', ['height']],
  ['.cathi-switch__track', ['backgroundColor', 'borderRadius']],
  ['.cathi-tag', ['backgroundColor', 'borderRadius']],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function collectFn(sels) {
  const out = {};
  for (const [sel, props] of sels) {
    const el = document.querySelector(sel);
    if (!el) { out[sel] = 'MISSING'; continue; }
    const cs = getComputedStyle(el);
    out[sel] = props.map((p) => `${p}=${cs[p]}`).join(' | ');
  }
  out.__counts = JSON.stringify({
    sections: document.querySelectorAll('.section').length,
    dialogs: document.querySelectorAll('dialog').length,
    codeBlocks: document.querySelectorAll('.cathi-code').length,
    sheets: [...document.styleSheets].map((s) => {
      const name = (s.href || 'inline').split('/').pop();
      try { return name + ':' + s.cssRules.length; } catch { return name + ':CORS'; }
    }),
  });
  return out;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--allow-file-access-from-files', '--font-render-hinting=none'],
  });

  const report = { errors: {}, samples: {}, counts: {}, diffs: [] };

  for (const cssFile of ['cathi-ui.css', 'cathi-ui.min.css']) {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const tmp = path.join(ROOT, `_verify_${cssFile.replace(/\.css$/, '')}.html`);
    fs.writeFileSync(tmp, html.replace(/href="cathi-ui\.css"/g, `href="${cssFile}"`), 'utf8');

    for (const mode of ['light', 'dark']) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
      page.on('requestfailed', (r) => errs.push('REQFAIL ' + r.url().split('/').pop()));
      await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
      if (mode === 'dark') {
        await page.evaluate(() => document.documentElement.classList.add('cathi-dark'));
      }
      await sleep(500);
      const res = await page.evaluate(collectFn, SAMPLES);
      const key = `${cssFile}/${mode}`;
      report.errors[key] = errs;
      report.samples[key] = res;
      report.counts[key] = res.__counts;
      if (cssFile === 'cathi-ui.css') {
        await page.screenshot({
          path: path.join(OUT, mode === 'light' ? 'cathi_v4_light.png' : 'cathi_v4_dark.png'),
          fullPage: true,
        });
      }
      await page.close();
    }
    fs.rmSync(tmp);
  }

  for (const mode of ['light', 'dark']) {
    const a = report.samples[`cathi-ui.css/${mode}`];
    const b = report.samples[`cathi-ui.min.css/${mode}`];
    for (const sel of Object.keys(a)) {
      if (sel === '__counts') continue;
      if (a[sel] !== b[sel]) report.diffs.push({ mode, sel, src: a[sel], min: b[sel] });
    }
  }

  // 三主题切换验证（动森 / 终末地 / 液态玻璃）
  for (const theme of ['cozy', 'endfield', 'liquidglass']) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'networkidle0' });
    await page.evaluate((t) => { document.body.setAttribute('data-theme', t); }, theme);
    await sleep(500);
    const res = await page.evaluate(collectFn, SAMPLES);
    const cs = await page.evaluate(() => {
      const card = getComputedStyle(document.querySelector('.cathi-card'));
      return { cardBackdrop: card.backdropFilter || card.webkitBackdropFilter };
    });
    console.log(`\n===== THEME ${theme} =====`);
    console.log('  body:', res['body']);
    console.log('  btn :', res['.cathi-btn']);
    console.log('  card:', res['.cathi-card'], '| backdrop:', cs.cardBackdrop);
    if (errs.length) console.log('  console errors:', errs);
    await page.screenshot({ path: path.join(OUT, `cathi_theme_${theme}.png`), fullPage: true });
    await page.close();
  }

  await browser.close();

  for (const mode of ['light', 'dark']) {
    console.log(`\n===== ${mode.toUpperCase()} (cathi-ui.css) =====`);
    console.log('counts:', report.counts[`cathi-ui.css/${mode}`]);
    for (const [k, v] of Object.entries(report.samples[`cathi-ui.css/${mode}`])) {
      if (k === '__counts') continue;
      console.log(' ', k.padEnd(40), v);
    }
    const e = report.errors[`cathi-ui.css/${mode}`];
    console.log(' console errors:', e.length ? e : 'none');
  }

  console.log('\n===== src vs min 差异 =====');
  if (!report.diffs.length) console.log(' 无差异 OK');
  else for (const d of report.diffs) console.log(' X', d.mode, d.sel, '\n   src:', d.src, '\n   min:', d.min);

  for (const k of Object.keys(report.errors)) {
    if (report.errors[k] && report.errors[k].length) console.log(` [${k}] errors:`, report.errors[k]);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
