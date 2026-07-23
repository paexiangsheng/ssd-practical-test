import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 3000);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(currentDirectory, '..', 'public')));

app.post('/search', (request, response) => {
  const searchTerm = String(request.body.searchTerm || '');

  response.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Search result</title>
      </head>
      <body>
        <main>
          <h1>Search result</h1>
          <p>You searched for: ${searchTerm}</p>
          <a href="/">Return to home page</a>
        </main>
      </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Web application listening on port ${port}`);
});
