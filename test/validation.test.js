import assert from 'node:assert/strict';
import test from 'node:test';
import {
  escapeHtml,
  maximumSearchLength,
  validateSearchTerm
} from '../src/validation.js';

test('accepts and trims an ordinary search term', () => {
  assert.deepEqual(validateSearchTerm('  secure coding  '), {
    valid: true,
    value: 'secure coding'
  });
});

test('rejects missing, short and long search terms', () => {
  assert.equal(validateSearchTerm('').valid, false);
  assert.equal(validateSearchTerm('a').valid, false);
  assert.equal(validateSearchTerm('a'.repeat(maximumSearchLength + 1)).valid, false);
});

test('rejects common XSS attack input', () => {
  assert.equal(validateSearchTerm('<script>alert(1)</script>').valid, false);
  assert.equal(validateSearchTerm('javascript:alert(1)').valid, false);
});

test('rejects common SQL injection input', () => {
  assert.equal(validateSearchTerm("' OR 1=1 --").valid, false);
  assert.equal(validateSearchTerm('UNION SELECT password FROM users').valid, false);
});

test('encodes output before inserting it into HTML', () => {
  assert.equal(escapeHtml('<script>"test"</script>'), '&lt;script&gt;&quot;test&quot;&lt;/script&gt;');
});
