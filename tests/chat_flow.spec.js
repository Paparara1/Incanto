const { test, expect } = require('@playwright/test');

test('navigation to chat and iframe presence', async ({ page }) => {
  // Go to the home page
  await page.goto('http://localhost:5173/');

  // Check title
  await expect(page).toHaveTitle(/Inkanto ✨/);

  // Since we have a login gate now, we need to mock the authentication
  await page.evaluate(() => {
    localStorage.setItem('inkanto_user', JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
  });

  // Reload to see the "Porozmawiaj" button
  await page.reload();

  // Click the chat button
  const chatButton = page.getByRole('link', { name: '💬 Porozmawiaj z Inkanto' });
  await expect(chatButton).toBeVisible();
  await chatButton.click();

  // Check if we are on the chat page (using Browser routing, no hash)
  await expect(page).toHaveURL(/\/chat$/);

  // Check for the iframe
  const iframe = page.locator('iframe[title="Inkanto Chat"]');
  await expect(iframe).toBeVisible();

  // Check for the "Back" button
  const backButton = page.getByRole('link', { name: '← Powrót' });
  await expect(backButton).toBeVisible();

  // Click the back button
  await backButton.click();

  // Check if we are back on the home page
  await expect(page).toHaveURL(/\/$/);
});
