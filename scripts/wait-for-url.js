const url = process.argv[2];
const timeoutMilliseconds = Number(process.argv[3] || 60000);
const startedAt = Date.now();

if (!url) {
  console.error('Usage: node scripts/wait-for-url.js <url> [timeout-ms]');
  process.exit(1);
}

while (Date.now() - startedAt < timeoutMilliseconds) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      console.log(`${url} is ready`);
      process.exit(0);
    }
  } catch {
    // The service is still starting.
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

console.error(`${url} was not ready within ${timeoutMilliseconds}ms`);
process.exit(1);
