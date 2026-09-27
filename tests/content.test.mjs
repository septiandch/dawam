import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dailyIndex, dailyKey } from '../src/lib/utils/daily.mjs';
import { validate } from '../scripts/validate-content.mjs';

test('daily selection uses local calendar date, stable all day, rotates at midnight', () => {
  const morning = new Date(2026, 8, 6, 0, 1);
  const evening = new Date(2026, 8, 6, 23, 59);
  assert.equal(dailyIndex(morning), dailyIndex(evening));
  assert.notEqual(dailyIndex(evening), dailyIndex(new Date(2026, 8, 7, 0, 0)));
});

test('dailyKey is a local YYYY-MM-DD key, stable all day and rotating at midnight', () => {
  assert.equal(dailyKey(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(dailyKey(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
  assert.equal(dailyKey(new Date(2026, 8, 6, 0, 1)), dailyKey(new Date(2026, 8, 6, 23, 59)));
  assert.notEqual(dailyKey(new Date(2026, 8, 6)), dailyKey(new Date(2026, 8, 7)));
});

test('validator rejects dangling collection references', () => {
  assert.throws(() => validate([], [{ slug: 'morning', itemIds: ['missing'] }]), /Missing reading/);
});

test('validator rejects empty categories', () => {
  assert.throws(() => validate([], [{ slug: 'empty', itemIds: [] }]));
});
