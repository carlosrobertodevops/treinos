import { expect, test } from '@playwright/test'

test.describe('Figma screens smoke', () => {
  test('login renders FIT.AI brand and Google CTA', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/FIT\.AI/)
    await expect(page.getByText('Fit.ai', { exact: true })).toBeVisible()
    await expect(
      page.getByText('O app que vai transformar a forma como você treina.'),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Fazer login com Google/i }),
    ).toBeVisible()
    await expect(page.getByText(/©2026 Copyright FIT\.AI/)).toBeVisible()
  })

  test('ai entry redirects to onboarding chat', async ({ page }) => {
    await page.goto('/ai')
    await expect(page).toHaveURL(/\/ai\/onboarding$/)
    await expect(page.getByText('Coach AI')).toBeVisible()
    await expect(page.getByText('Online')).toBeVisible()
    await expect(page.getByText('Bem-vindo ao FIT.AI!', { exact: false })).toBeVisible()
    await expect(
      page.getByPlaceholder('Digite sua mensagem'),
    ).toBeVisible()
  })

  test('ai/coach renders sheet with quick actions', async ({ page }) => {
    await page.goto('/ai/coach')
    await expect(page.getByText('Coach AI')).toBeVisible()
    await expect(
      page.getByText('Olá! Sou sua IA personal.', { exact: false }),
    ).toBeVisible()
    for (const label of [
      'Alterar plano de treino',
      'Mudar objetivo',
      'Atualizar informações',
    ]) {
      await expect(page.getByRole('button', { name: label })).toBeVisible()
    }
  })

  test('profile renders FIT.AI header, stat cards and logout', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByRole('heading', { name: 'FIT.AI' })).toBeVisible()
    for (const label of ['KG', 'CM', 'GC', 'ANOS']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible()
    }
    await expect(page.getByText('Sair da conta')).toBeVisible()
  })

  test('evolution renders streak, consistencia heatmap and stats', async ({
    page,
  }) => {
    await page.goto('/evolution')
    await expect(page.getByText('Sequência Atual')).toBeVisible()
    await expect(page.getByText('Consistência')).toBeVisible()
    await expect(page.getByText('Tempo Total')).toBeVisible()
  })

  test('home renders hero greeting and bottom nav', async ({ page }) => {
    await page.goto('/home')
    await expect(page.getByText(/Bora treinar hoje\?/)).toBeVisible()
    await expect(page.getByText('Consistência')).toBeVisible()
    await expect(page.getByText('Treino de Hoje')).toBeVisible()
  })

  test('workout-plans renders Plano de Treino hero', async ({ page }) => {
    await page.goto('/workout-plans')
    await expect(
      page.getByRole('heading', { name: 'Plano de Treino' }),
    ).toBeVisible()
  })
})
