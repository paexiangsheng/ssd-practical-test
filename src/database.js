import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'testdb',
  waitForConnections: true,
  connectionLimit: 5
});

export async function initializeDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS \`2400749\` (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      search_query VARCHAR(80) NOT NULL,
      query_time DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    )
  `);
}

export async function logValidatedSearch(searchTerm) {
  await pool.execute(
    'INSERT INTO `2400749` (search_query, query_time) VALUES (?, CURRENT_TIMESTAMP(3))',
    [searchTerm]
  );
}
