import { test, expect } from "@playwright/test";

test("kunden kan logga in och ser sin översikt", async ({ page }) => {
  await page.goto("/login");
  await page
    .getByPlaceholder("E-postadress")
    .fill("anna.andersson@example.com");
  await page.getByPlaceholder("Lösenord").fill("kraftly-anna");
  await page.getByRole("button", { name: "Logga in" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hej Anna!");
});
/*
test('fel lösenord släpper ingen in – och token hamnar aldrig i localStorage', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('E-postadress').fill('anna.andersson@example.com')
  await page.getByLabel('Lösenord').fill('fel-losenord')
  await page.getByRole('button', { name: 'Logga in' }).click()

  await expect(page.getByRole('alert')).toHaveText('Fel e-post eller lösenord')
  await expect(page).toHaveURL(/\/login/)
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([])
})

test('utan inloggning skickas man till /login – och tillbaka efteråt', async ({ page }) => {
  await page.goto('/fakturor')
  await expect(page).toHaveURL(/\/login\?redirect=(%2F|\/)fakturor/)
  await page.getByLabel('E-postadress').fill('anna.andersson@example.com')
  await page.getByLabel('Lösenord').fill('kraftly-anna')
  await page.getByRole('button', { name: 'Logga in' }).click()
  await expect(page).toHaveURL(/\/fakturor$/)
  await expect(page.getByRole('cell', { name: 'F-2026-06', exact: true })).toBeVisible()
})
*/
