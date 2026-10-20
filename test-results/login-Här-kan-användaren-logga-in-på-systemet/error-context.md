# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Här kan användaren logga in på systemet
- Location: e2e\login.spec.js:4:5

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
  1  |
  2  | import { test, expect } from "@playwright/test";
  3  |
  4  | test("Här kan användaren logga in på systemet", async ({ page }) => {
  5  |   await page.goto("/login");
  6  |
  7  |   await page.getByPlaceholder("E-postadress").fill(
  8  |     "anna.andersson@example.com"
  9  |   );
  10 |   await page.getByPlaceholder("Lösenord").fill("sommar2026");
  11 |
  12 |   await page.getByRole("button", { name: "Logga in" }).click();
  13 |
> 14 |   await expect(page).toHaveURL("/");
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  15 |   await expect(page.getByText("Mina uppgifter")).toBeVisible();
  16 | });
  17 |
```
