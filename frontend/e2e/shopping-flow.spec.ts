import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('should allow a user to add a product to the cart', async ({ page }) => {
    // 1. Переходим на главную страницу
    await page.goto('/');

    // 2. Ждем, пока исчезнет сплэш-скрин
    await expect(page.locator('.headline')).toBeVisible(); // Проверяем, что заголовок Hero стал видимым
    await expect(page.locator('.splash-screen')).toBeHidden(); // Проверяем, что сплэш-скрин скрылся

    // 3. Переходим на страницу продуктов
    await page.getByTestId('nav-products').click();
    await expect(page).toHaveURL('/products');

    // 4. Ждем загрузки карточек товаров
    await expect(page.getByRole('heading', { name: 'Наше Меню' })).toBeVisible();
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    // 5. Находим первую карточку и кликаем "В корзину"
    const firstCard = productCards.first();
    const productName = await firstCard.getByTestId('product-name').textContent();
    expect(productName).not.toBeNull();

    const addToCartButton = firstCard.getByRole('button', { name: 'Добавить в корзину' });
    await addToCartButton.click();

    // 6. Проверяем, что иконка корзины в хедере обновилась до "1"
    const cartIcon = page.getByTestId('header-cart');
    await expect(cartIcon.locator('span')).toHaveText('1'); // Проверяем span внутри CartIcon

    // 7. Переходим в корзину
    await cartIcon.click(); // Кликаем по иконке
    await expect(page).toHaveURL('/cart');

    // 8. Проверяем, что в корзине есть добавленный товар
    await expect(page.getByRole('heading', { name: 'Ваша Корзина' })).toBeVisible();
    await expect(page.locator('.flex.items-center.space-x-4')).toContainText(productName!);
  });

  test('should allow a user to register, log in, and see profile', async ({ page }) => {
    // 1. Переходим на страницу регистрации
    await page.goto('/register');
    await expect(page).toHaveURL('/register');

    // Генерируем уникальные данные для каждого запуска
    const username = `testuser_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`;
    const password = 'testpassword123';

    // 2. Заполняем форму регистрации
    await page.getByLabel('Имя пользователя').fill(username);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Пароль', { exact: true }).fill(password);
    await page.getByLabel('Повторите пароль').fill(password);

    // 3. Отправляем форму
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    // 4. Ожидаем редиректа на страницу профиля
    await expect(page).toHaveURL('/profile');
    await expect(page.getByText(`Добро пожаловать в FLAVO!`)).toBeVisible(); // Проверяем тост

    // 5. Проверяем, что имя пользователя отображается в профиле
    await expect(page.getByTestId('profile-username')).toContainText(username);
    await expect(page.getByText(email)).toBeVisible();

    // 6. Выходим из системы
    await page.getByTestId('user-menu-toggle').click();
    await page.getByTestId('logout-button').click();

    // 7. Проверяем редирект на главную и что кнопка "Войти" видна
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible();

    // 8. Переходим на страницу логина
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page).toHaveURL('/login');

    // 9. Заполняем форму логина
    await page.getByLabel('Имя пользователя').fill(username);
    await page.getByLabel('Пароль').fill(password);
    await page.getByRole('button', { name: 'Войти' }).click();

    // 10. Ожидаем редиректа на страницу профиля
    await expect(page).toHaveURL('/profile');
    await expect(page.getByText(`С возвращением, ${username}!`)).toBeVisible();
    await expect(page.getByTestId('profile-username')).toContainText(username);
  });
  
  test('should allow a user to complete a full shopping and checkout flow', async ({ page }) => {

    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Наше Меню' })).toBeVisible();
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    const firstCard = productCards.first();
    const productName = await firstCard.getByTestId('product-name').textContent();
    expect(productName).not.toBeNull();
    await firstCard.getByRole('button', { name: 'Добавить в корзину' }).click();
    await expect(page.getByTestId('header-cart').locator('span')).toHaveText('1');


    await page.getByTestId('header-cart').click();
    await expect(page).toHaveURL('/cart');
    await expect(page.getByRole('heading', { name: 'Ваша Корзина' })).toBeVisible();
    await expect(page.locator('.flex.items-center.space-x-4')).toContainText(productName!);
    await page.getByTestId('checkout-button').click();
    await expect(page).toHaveURL('/checkout');


    await expect(page.getByRole('heading', { name: 'Оформление заказа' })).toBeVisible();
    await page.getByLabel('Адрес доставки').fill('123 Pizza Lane, Test City');



    await page.route('**/api/payments/create-checkout-session/', async route => {

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        // // Использование baseURL из конфига Playwright, которое подставляется автоматически при page.goto
        body: JSON.stringify({ url: `/payment/success?session_id=mock_session_id_12345` }),
      });
    });


    await page.getByRole('button', { name: 'Перейти к оплате' }).click();


    await page.waitForURL('**/payment/success?session_id=mock_session_id_12345');
    await expect(page).toHaveURL('/payment/success?session_id=mock_session_id_12345');
    await expect(page.getByTestId('order-success-message')).toBeVisible();
    await expect(page.getByTestId('order-success-message')).toContainText('Ваш заказ успешно оформлен');
  });
});