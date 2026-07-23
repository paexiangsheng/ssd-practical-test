import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, validateSearchTerm } from './validation.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

app.use(helmet());
app.use(express.urlencoded({ extended: false, limit: '2kb' }));
app.use(express.static(path.join(currentDirectory, '..', 'public')));

app.post('/search', (request, response) => {
  const validation = validateSearchTerm(request.body.searchTerm);

  if (!validation.valid) {
    response.redirect(303, '/?invalid=1');
    return;
  }

  const safeSearchTerm = escapeHtml(validation.value);

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
          <p>You searched for: <strong>${safeSearchTerm}</strong></p>
          <form action="/" method="get">
            <button type="submit">Return to home page</button>
          </form>
        </main>
      </body>
    </html>
  `);
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(400).redirect('/?invalid=1');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Web application listening on port ${port}`);
});
