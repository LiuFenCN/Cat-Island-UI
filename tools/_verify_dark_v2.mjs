import puppeteer from 'file:///D:/Users/79281/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = 'F:/缓存/软件缓存/workboddy/2026-07-23-14-54-24/Cat-Island-UI';

const browser = await puppeteer.launch({
  executablePath: EDGE, headless: 'new',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--force-color-profile=srgb']
});

let allOk = true;
for (const t of ['cozy', 'liquidglass', 'endfield']) {
  const page = await browser.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 120)));
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(process.env.DEMO_URL || ('file:///' + ROOT + '/react/dist/index.html'), { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate((theme) => { document.body.setAttribute('data-theme', theme); document.body.setAttribute('data-dark', ''); }, t);
  await new Promise(r => setTimeout(r, 400));

  const res = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    const g = (n) => cs.getPropertyValue(n).trim();
    const bright = [];
    for (const el of document.querySelectorAll('*')) {
      const bg = getComputedStyle(el).backgroundColor;
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) continue;
      const a = m[4] === undefined ? 1 : parseFloat(m[4]);
      if (a < 0.5) continue;
      const lum = 0.2126 * (+m[1]) + 0.7152 * (+m[2]) + 0.0722 * (+m[3]);
      const rect = el.getBoundingClientRect();
      if (lum > 150 && rect.width * rect.height > 20000) {
        bright.push({ cls: (el.className && el.className.toString ? el.className.toString() : '').slice(0, 40), bg, area: Math.round(rect.width * rect.height) });
      }
    }
    return { bg: g('--cathi-background'), card: g('--cathi-card'), bgAlt: g('--cathi-bg-alt'), bodyBg: cs.backgroundColor, bright: bright.slice(0, 6) };
  });
  const ok = !!res.bg && !!res.bgAlt && errs.length === 0;
  if (!ok) allOk = false;
  console.log(`${t.padEnd(12)} bg="${res.bg}" card="${res.card}" bgAlt="${res.bgAlt}" | bodyBg=${res.bodyBg} | brightLeaks=${res.bright.length} | errors=${errs.length}${errs.length ? ' -> ' + errs[0] : ''}`);
  await page.screenshot({ path: ROOT + '/_shots/react-' + t + '-dark.png', fullPage: false });
  await page.close();
}
await browser.close();
console.log(allOk ? 'ALL OK' : 'ISSUES FOUND');
