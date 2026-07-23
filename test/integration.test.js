import assert from 'node:assert/strict';
import test from 'node:test';
import mysql from 'mysql2/promise';

const applicationUrl = process.env.APP_URL || 'http://127.0.0.1:3000';

const database = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'testdb'
});

test.after(async () => {
  await database.end();
});

test('accepts a valid search and stores it with a query time', async () => {
  const searchTerm = `integration-${Date.now()}`;
  const body = new URLSearchParams({ searchTerm });

  const response = await fetch(`${applicationUrl}/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    redirect: 'manual'
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), new RegExp(searchTerm));

  const [rows] = await database.execute(
    'SELECT search_query, query_time FROM `2400749` WHERE search_query = ?',
    [searchTerm]
  );

  assert.equal(rows.length, 1);
  assert.equal(rows[0].search_query, searchTerm);
  assert.ok(rows[0].query_time);
});

test('rejects an attack and does not store it', async () => {
  const attack = '<script>alert(1)</script>';
  const body = new URLSearchParams({ searchTerm: attack });

  const response = await fetch(`${applicationUrl}/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    redirect: 'manual'
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/?invalid=1');

  const [rows] = await database.execute(
    'SELECT COUNT(*) AS total FROM `2400749` WHERE search_query = ?',
    [attack]
  );

  assert.equal(Number(rows[0].total), 0);
});
