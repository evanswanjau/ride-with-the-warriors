// Fails when the public entry bundle grows past its budget.
// Usage: npm run build:dev && npm run budget   (reads dist/)
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = path.resolve('dist');
// gzipped KB. Public pages must stay under 250 KB of JS (plan, Phase 6); the entry has its own tighter cap.
const BUDGETS = { entryJs: 150, entryCss: 25, initialJsTotal: 250 };

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const gz = (file) => zlib.gzipSync(fs.readFileSync(path.join(DIST, file.replace(/^\//, '')))).length / 1024;
const refs = (re) => [...html.matchAll(re)].map((m) => m[1]);
const js = refs(/<(?:script|link)[^>]+(?:src|href)="(\/[^"]+\.js)"/g);
const css = refs(/<link[^>]+href="(\/[^"]+\.css)"/g);

const entryJs = js.reduce((n, f) => n + gz(f), 0);
const entryCss = css.reduce((n, f) => n + gz(f), 0);
const rows = [
    ['entry JS (gzip)', entryJs, BUDGETS.entryJs],
    ['entry CSS (gzip)', entryCss, BUDGETS.entryCss],
    ['initial JS total (gzip)', entryJs, BUDGETS.initialJsTotal],
];
let failed = false;
for (const [name, v, max] of rows) {
    const ok = v <= max;
    failed ||= !ok;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${v.toFixed(1)} KB (budget ${max} KB)`);
}
for (const heavy of ['AdminPage', 'recharts', 'xlsx', 'jspdf', 'html2canvas']) {
    if (js.some((f) => f.includes(heavy))) { console.log(`FAIL ${heavy} is in the entry`); failed = true; }
}
process.exit(failed ? 1 : 0);
