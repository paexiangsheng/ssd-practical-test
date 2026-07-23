import assert from 'node:assert/strict';
import test from 'node:test';
import { Builder, By, until } from 'selenium-webdriver';

const seleniumUrl = process.env.SELENIUM_URL || 'http://127.0.0.1:4444/wd/hub';
const applicationUrl = process.env.APP_URL || 'http://host.docker.internal:3000';

test('accepts safe searches and blocks attack input in the browser', async () => {
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(seleniumUrl)
    .build();

  try {
    await driver.get(applicationUrl);

    const searchInput = await driver.findElement(By.id('searchTerm'));
    await searchInput.sendKeys('secure coding');
    await driver.findElement(By.css('button[type="submit"]')).click();

    const result = await driver.wait(
      until.elementLocated(By.css('main strong')),
      10000
    );
    assert.equal(await result.getText(), 'secure coding');

    await driver.get(applicationUrl);

    const attackInput = await driver.findElement(By.id('searchTerm'));
    await attackInput.sendKeys('<script>alert(1)</script>');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(
      async () => (await attackInput.getAttribute('value')) === '',
      10000
    );
    assert.equal(await attackInput.getAttribute('value'), '');

    const validationMessage = await driver.findElement(By.id('validationMessage'));
    assert.match(await validationMessage.getText(), /unsafe/i);
  } finally {
    await driver.quit();
  }
});
