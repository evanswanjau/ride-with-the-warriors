/**
 * One-off: mask surnames inside src/assets/results.json and src/assets/raffle.json so
 * full surnames never ship to the browser. Safe to re-run (masking is idempotent).
 *
 *   node scripts/mask-data.mjs
 *
 * Raffle: ticket AA130 (the car) is placed first with a fully masked name until the real
 * winner is confirmed. TODO: set its `name` to "<First> <Surname>" and run this script
 * again; it will show as "<First> ***rest".
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { maskName, maskSurname } from '../src/utils/maskName.ts';

const dir = new URL('../src/assets/', import.meta.url);
const read = (f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
const write = (f, v) => writeFileSync(new URL(f, dir), JSON.stringify(v, null, 2) + '\n');

// results.json: any object with first_name + last_name (individual lists and team rosters)
const results = read('results.json');
(function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
        if (typeof node.last_name === 'string' && 'first_name' in node) {
            node.last_name = maskSurname(node.last_name);
        }
        Object.values(node).forEach(walk);
    }
})(results);
write('results.json', results);

// raffle.json
const CAR = 'AA130';
const raffle = read('raffle.json').filter((w) => w.raffle_number !== CAR);
const rows = [{ serial_number: 0, item: 'Car', raffle_number: CAR, name: '***' }, ...raffle].map((w, i) => ({
    ...w,
    serial_number: i + 1,
    name: maskName(w.name),
}));
write('raffle.json', rows);
