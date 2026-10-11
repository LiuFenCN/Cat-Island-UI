/**
 * 针对性校验：data-dark 下三套主题的输入/控件表面是否真正翻转。
 * 重点修复：endfield 输入背景 hsl(var(--cathi-field)/.92) 在层内只取到 light 值。
 *
 * 用法: node tools/_verify_dark_surface.mjs
 */
const PPTR = process.env.PPTR_PATH
  || 'D:/Users/79281/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const { default: puppeteer } = await import('file:///' + PPTR.replace(/\\/g, '/'));
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EDGE = process.env.EDGE_PATH
  || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 取一个真实输入元素（#demo-name），返回 token 与解析后的背景
function readInput() {
  const el = document.querySelector('#demo-name') || document.querySelector('.cathi-input');
  const field = document.querySelector('.cathi-input');
  const cs = getComputedStyle(el);
  const fcs = getComputedStyle(field);
  return {
    inputBg: cs.backgroundColor,
    fieldToken: fcs.getPropertyValue('--cathi-field').trim(),
    bgToken: fcs.getPropertyValue('--cathi-background').trim(),
    cardBg: getComputedStyle(document.querySelector('.cathi-card')).backgroundColor,
    bodyBg: getComputedStyle(document.body).backgroundColor,
  };
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--allow-file-access-from-files', '--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'networkidle0' });

  const results = [];
  for (const theme of ['cozy', 'endfield', 'liquidglass']) {
    // LIGHT
    await page.evaluate((t) => {
      const b = document.body;
      b.setAttribute('data-theme', t);
      b.removeAttribute('data-dark');
    }, theme);
    await sleep(400);
    const light = await page.evaluate(readInput);
    // DARK
    await page.evaluate((t) => {
      const b = document.body;
      b.setAttribute('data-theme', t);
      b.setAttribute('data-dark', '');
    }, theme);
    await sleep(400);
    const dark = await page.evaluate(readInput);

    const flipped = light.inputBg !== dark.inputBg && dark.inputBg !== 'rgba(0, 0, 0, 0)';
    results.push({ theme, light, dark, flipped });
  }

  await browser.close();

  for (const r of results) {
    console.log(`\n===== ${r.theme} =====`);
    console.log('  LIGHT inputBg   :', r.light.inputBg);
    console.log('  DARK  inputBg   :', r.dark.inputBg);
    console.log('  LIGHT --cathi-field :', r.light.fieldToken);
    console.log('  DARK  --cathi-field :', r.dark.fieldToken);
    console.log('  LIGHT bodyBg    :', r.light.bodyBg);
    console.log('  DARK  bodyBg    :', r.dark.bodyBg);
    console.log('  flipped(input)  :', r.flipped);
  }
  console.log('\nconsole errors:', errs.length ? errs : 'none');
  const allFlipped = results.every((r) => r.flipped);
  console.log('\n==== RESULT:', allFlipped ? 'ALL FLIPPED OK' : 'REGRESSION/NO-FLIP DETECTED', '====');
  if (!allFlipped) process.exit(2);
}

main().catch((e) => { console.error(e); process.exit(1); });
