# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Här kan användaren logga in på systemet
- Location: e2e\login.spec.js:3:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:8080/"
Received: "http://localhost:8080/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:8080/login"

```

```yaml
- text: LOKAL
- main:
    - img
    - heading "Logga in på Mina sidor" [level=1]
    - textbox "E-postadress": anna.andersson@example.com
    - textbox "Lösenord": sommar2026
    - alert: Fel e-postadress eller lösenord.
    - button "Logga in"
    - paragraph: Problem att logga in? Ring kundservice 020-123 456
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test("Här kan användaren logga in på systemet", async ({ page }) => {
  4  |   await page.goto("/login");
  5  |
  6  |   await page
  7  |     .getByPlaceholder("E-postadress")
  8  |     .fill("anna.andersson@example.com");
  9  |   await page.getByPlaceholder("Lösenord").fill("sommar2026");
  10 |
  11 |   await page.getByRole("button", { name: "Logga in" }).click();
  12 |
> 13 |   await expect(page).toHaveURL("/");
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  14 |   await expect(page.getByText("Mina uppgifter")).toBeVisible();
  15 | });
  16 |
```
