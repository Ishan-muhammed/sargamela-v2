import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/അറബിക് അധ്യാപക സംഗമം 2026/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('അറബിക് അധ്യാപക സംഗമം 2026')
  })
})
