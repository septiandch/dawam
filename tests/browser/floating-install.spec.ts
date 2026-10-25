import { test, expect } from '@playwright/test';

test('install action floats until its original position is reached', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto('/');
  const popup = page.getByRole('dialog');
  await expect(popup).toBeVisible();
  await page.keyboard.press('Escape');

  const anchor = page.locator('[data-floating]');
  const button = page.getByRole('button', { name: 'Pasang aplikasi' });
  await expect(anchor).toHaveAttribute('data-floating', 'true');
  await expect(button).toBeInViewport();
  await expect(button).toHaveCount(1);
  await expect.poll(async () => (await button.boundingBox())?.width).toBe(358);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(anchor).toHaveAttribute('data-floating', 'false');
  await expect(button).toBeInViewport();

  await expect
    .poll(async () => (await button.boundingBox())?.width ?? 0)
    .toBeLessThan(358);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(anchor).toHaveAttribute('data-floating', 'true');
  await expect(button).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
