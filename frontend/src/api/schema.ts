export interface paths {
    "/api/v1/auth/register/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["auth_register_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/token/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["auth_token_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/token/refresh/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["auth_token_refresh_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/categories/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для категорий. Теперь всегда отдает свежие данные из БД. */
        get: operations["categories_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/categories/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для категорий. Теперь всегда отдает свежие данные из БД. */
        get: operations["categories_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/collections/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для коллекций. Теперь всегда отдает свежие данные из БД. */
        get: operations["collections_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/collections/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для коллекций. Теперь всегда отдает свежие данные из БД. */
        get: operations["collections_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/orders/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description API эндпоинт для менеджеров для управления всеми заказами. */
        get: operations["dashboard_orders_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/orders/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description API эндпоинт для менеджеров для управления всеми заказами. */
        get: operations["dashboard_orders_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** @description API эндпоинт для менеджеров для управления всеми заказами. */
        patch: operations["dashboard_orders_partial_update"];
        trace?: never;
    };
    "/api/v1/faqs/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description API эндпоинт для получения списка FAQ. */
        get: operations["faqs_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/faqs/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description API эндпоинт для получения списка FAQ. */
        get: operations["faqs_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/orders/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для просмотра заказов пользователя.
         *     Создание и изменение заказов происходит через систему оплаты. */
        get: operations["orders_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/orders/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для просмотра заказов пользователя.
         *     Создание и изменение заказов происходит через систему оплаты. */
        get: operations["orders_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/orders/{id}/cancel/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Отмена заказа пользователем. */
        post: operations["orders_cancel_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/create-checkout-session/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Создать сессию оплаты Stripe
         * @description Принимает состав корзины и адрес, возвращает URL для оплаты.
         */
        post: operations["payments_create_checkout_session_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/stripe-webhook/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Обработчик вебхуков Stripe
         * @description Этот эндпоинт не предназначен для прямого вызова. Он принимает POST-запросы от Stripe.
         */
        post: operations["payments_stripe_webhook_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для продуктов. Теперь всегда отдает свежие данные из БД. */
        get: operations["products_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для продуктов. Теперь всегда отдает свежие данные из БД. */
        get: operations["products_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/promocodes/validate/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Validate a promo code */
        post: operations["promocodes_validate_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recipe-categories/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для категорий рецептов. */
        get: operations["recipe_categories_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recipe-categories/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для категорий рецептов. */
        get: operations["recipe_categories_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recipe-tags/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для тегов рецептов. */
        get: operations["recipe_tags_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recipe-tags/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для тегов рецептов. */
        get: operations["recipe_tags_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recipes/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для просмотра рецептов. */
        get: operations["recipes_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/recipes/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для просмотра рецептов. */
        get: operations["recipes_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tags/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для тегов. Теперь всегда отдает свежие данные из БД. */
        get: operations["tags_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tags/{slug}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для тегов. Теперь всегда отдает свежие данные из БД. */
        get: operations["tags_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для просмотра информации о пользователях. */
        get: operations["users_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ViewSet для просмотра информации о пользователях. */
        get: operations["users_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/me/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Возвращает данные о текущем аутентифицированном пользователе. */
        get: operations["users_me_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Сериализатор для одной позиции в корзине. */
        CartItem: {
            product_id: number;
            quantity: number;
        };
        /** @description Сериализатор для категорий. */
        Category: {
            readonly id: number;
            /** Название категории */
            name: string;
            slug?: string;
            readonly icon: string;
        };
        Collection: {
            readonly id: number;
            /** Название коллекции */
            name: string;
            /** Описание */
            description: string;
            readonly image: string;
            slug?: string;
        };
        CollectionDetail: {
            readonly id: number;
            /** Название коллекции */
            name: string;
            /** Описание */
            description: string;
            readonly image: string;
            slug?: string;
            readonly products: components["schemas"]["Product"][];
        };
        /** @description Сериализатор для создания сессии оплаты Stripe. */
        CreateCheckoutSession: {
            items: components["schemas"]["CartItem"][];
            promo_code?: string | null;
            address: string;
        };
        /**
         * @description * `EASY` - Легкий
         *     * `MEDIUM` - Средний
         *     * `HARD` - Сложный
         * @enum {string}
         */
        DifficultyEnum: "EASY" | "MEDIUM" | "HARD";
        ErrorResponse: {
            detail?: string;
            errors?: {
                [key: string]: string[];
            };
        };
        FAQ: {
            readonly id: number;
            /** Вопрос */
            question: string;
            /** Ответ */
            answer: string;
        };
        /** @description Сериализатор заказа для дашборда менеджера.
         *     Может включать дополнительную информацию, если потребуется. */
        ManagerOrder: {
            /** Format: uuid */
            readonly id: string;
            readonly customer: string;
            /**
             * Дата создания
             * Format: date-time
             */
            readonly created_at: string;
            /**
             * Итоговая цена
             * Format: decimal
             */
            total_price: string;
            status: components["schemas"]["StatusEnum"];
            /** Адрес доставки */
            address: string;
            readonly items: components["schemas"]["OrderItem"][];
            readonly promo_code: string;
            /**
             * Сумма скидки
             * Format: decimal
             */
            discount_amount?: string;
        };
        /** @description Сериализатор для обновления статуса заказа менеджером. */
        ManagerOrderUpdate: {
            /** Статус заказа */
            status?: components["schemas"]["StatusEnum"];
        };
        Order: {
            /** Format: uuid */
            readonly id: string;
            readonly customer: string;
            /**
             * Дата создания
             * Format: date-time
             */
            readonly created_at: string;
            /**
             * Итоговая цена
             * Format: decimal
             */
            total_price: string;
            status: components["schemas"]["StatusEnum"];
            /** Адрес доставки */
            address: string;
            readonly items: components["schemas"]["OrderItem"][];
            readonly promo_code: string;
            /**
             * Сумма скидки
             * Format: decimal
             */
            discount_amount?: string;
        };
        OrderItem: {
            readonly id: number;
            readonly product: components["schemas"]["Product"];
            /** Количество */
            quantity: number;
            /**
             * Цена на момент заказа
             * Format: decimal
             */
            price_at_order: string;
        };
        PaginatedCategoryList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Category"][];
        };
        PaginatedCollectionList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Collection"][];
        };
        PaginatedFAQList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["FAQ"][];
        };
        PaginatedManagerOrderList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["ManagerOrder"][];
        };
        PaginatedOrderList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Order"][];
        };
        PaginatedProductList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Product"][];
        };
        PaginatedRecipeCategoryList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["RecipeCategory"][];
        };
        PaginatedRecipeList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Recipe"][];
        };
        PaginatedRecipeTagList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["RecipeTag"][];
        };
        PaginatedTagList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Tag"][];
        };
        PaginatedUserList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["User"][];
        };
        /** @description Сериализатор для обновления статуса заказа менеджером. */
        PatchedManagerOrderUpdate: {
            /** Статус заказа */
            status?: components["schemas"]["StatusEnum"];
        };
        Product: {
            readonly id: number;
            /** Название */
            name: string;
            /** URL Slug */
            slug?: string;
            /** Описание */
            description: string;
            /**
             * Цена
             * Format: decimal
             */
            price: string;
            readonly image: string;
            /** Артикул */
            sku?: string;
            /** Остаток на складе */
            stock?: number;
            readonly tags: components["schemas"]["Tag"][];
            /** Рекомендуемый продукт */
            is_featured?: boolean;
            readonly category: components["schemas"]["Category"];
            /** Состав и аллергены */
            ingredients?: string;
            /** Рекомендация от шефа */
            chef_recommendation?: string;
        };
        PromoCode: {
            /** Промокод */
            code: string;
            /** Процент скидки */
            discount_percent: number;
            readonly is_valid: boolean;
        };
        /** @description Основной сериализатор для рецептов. */
        Recipe: {
            readonly id: number;
            /** Название рецепта */
            title: string;
            /** URL Slug */
            slug?: string;
            /**
             * Краткое описание
             * @description Короткое описание для списка рецептов
             */
            short_description: string;
            /**
             * Полное описание
             * @description Подробное пошаговое описание приготовления
             */
            full_description: string;
            readonly image: string;
            /** Время подготовки (мин) */
            prep_time: number;
            /** Время приготовления (мин) */
            cook_time: number;
            /** Количество порций */
            servings?: number;
            difficulty: components["schemas"]["DifficultyEnum"];
            readonly category: components["schemas"]["RecipeCategory"];
            readonly tags: components["schemas"]["RecipeTag"][];
            /**
             * Дата создания
             * Format: date-time
             */
            readonly created_at: string;
            /**
             * Дата обновления
             * Format: date-time
             */
            readonly updated_at: string;
        };
        /** @description Сериализатор для категорий рецептов. */
        RecipeCategory: {
            readonly id: number;
            /** Название категории */
            name: string;
            slug?: string;
            readonly icon: string;
        };
        /** @description Сериализатор для детального просмотра рецепта (может быть расширен в будущем). */
        RecipeDetail: {
            readonly id: number;
            /** Название рецепта */
            title: string;
            /** URL Slug */
            slug?: string;
            /**
             * Краткое описание
             * @description Короткое описание для списка рецептов
             */
            short_description: string;
            /**
             * Полное описание
             * @description Подробное пошаговое описание приготовления
             */
            full_description: string;
            readonly image: string;
            /** Время подготовки (мин) */
            prep_time: number;
            /** Время приготовления (мин) */
            cook_time: number;
            /** Количество порций */
            servings?: number;
            difficulty: components["schemas"]["DifficultyEnum"];
            readonly category: components["schemas"]["RecipeCategory"];
            readonly tags: components["schemas"]["RecipeTag"][];
            /**
             * Дата создания
             * Format: date-time
             */
            readonly created_at: string;
            /**
             * Дата обновления
             * Format: date-time
             */
            readonly updated_at: string;
        };
        /** @description Сериализатор для тегов рецептов. */
        RecipeTag: {
            readonly id: number;
            /** Название тега */
            name: string;
            slug?: string;
        };
        Register: {
            /**
             * Имя пользователя
             * @description Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
             */
            username: string;
            password: string;
            /** Confirm password */
            password2: string;
            /**
             * Адрес электронной почты
             * Format: email
             */
            email: string;
            /** Имя */
            first_name?: string;
            /** Фамилия */
            last_name?: string;
        };
        /**
         * @description * `CUSTOMER` - Customer
         *     * `MANAGER` - Manager
         * @enum {string}
         */
        RoleEnum: "CUSTOMER" | "MANAGER";
        /**
         * @description * `PENDING` - Ожидает подтверждения
         *     * `PREPARING` - Готовится
         *     * `DELIVERING` - Доставляется
         *     * `COMPLETED` - Доставлен
         *     * `CANCELLED` - Отменен
         * @enum {string}
         */
        StatusEnum: "PENDING" | "PREPARING" | "DELIVERING" | "COMPLETED" | "CANCELLED";
        Tag: {
            readonly id: number;
            /** Название тега */
            name: string;
            slug?: string;
        };
        TokenObtainPair: {
            username: string;
            password: string;
            readonly access: string;
            readonly refresh: string;
        };
        TokenRefresh: {
            readonly access: string;
            refresh: string;
        };
        User: {
            readonly id: number;
            /**
             * Имя пользователя
             * @description Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
             */
            username: string;
            /**
             * Адрес электронной почты
             * Format: email
             */
            email?: string;
            /** Имя */
            first_name?: string;
            /** Фамилия */
            last_name?: string;
            /** Format: decimal */
            flavo_coins?: string;
            /** Роль */
            role?: components["schemas"]["RoleEnum"];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    auth_register_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Register"];
                "application/x-www-form-urlencoded": components["schemas"]["Register"];
                "multipart/form-data": components["schemas"]["Register"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Register"];
                };
            };
        };
    };
    auth_token_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenObtainPair"];
                "application/x-www-form-urlencoded": components["schemas"]["TokenObtainPair"];
                "multipart/form-data": components["schemas"]["TokenObtainPair"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenObtainPair"];
                };
            };
        };
    };
    auth_token_refresh_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenRefresh"];
                "application/x-www-form-urlencoded": components["schemas"]["TokenRefresh"];
                "multipart/form-data": components["schemas"]["TokenRefresh"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenRefresh"];
                };
            };
        };
    };
    categories_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedCategoryList"];
                };
            };
        };
    };
    categories_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
                };
            };
        };
    };
    collections_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedCollectionList"];
                };
            };
        };
    };
    collections_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionDetail"];
                };
            };
        };
    };
    dashboard_orders_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedManagerOrderList"];
                };
            };
        };
    };
    dashboard_orders_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this Заказ. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ManagerOrder"];
                };
            };
        };
    };
    dashboard_orders_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this Заказ. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["PatchedManagerOrderUpdate"];
                "application/x-www-form-urlencoded": components["schemas"]["PatchedManagerOrderUpdate"];
                "multipart/form-data": components["schemas"]["PatchedManagerOrderUpdate"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ManagerOrderUpdate"];
                };
            };
        };
    };
    faqs_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedFAQList"];
                };
            };
        };
    };
    faqs_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this Вопрос и ответ (FAQ). */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FAQ"];
                };
            };
        };
    };
    orders_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedOrderList"];
                };
            };
        };
    };
    orders_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this Заказ. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
        };
    };
    orders_cancel_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A UUID string identifying this Заказ. */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Order"];
                "application/x-www-form-urlencoded": components["schemas"]["Order"];
                "multipart/form-data": components["schemas"]["Order"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
        };
    };
    payments_create_checkout_session_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCheckoutSession"];
                "application/x-www-form-urlencoded": components["schemas"]["CreateCheckoutSession"];
                "multipart/form-data": components["schemas"]["CreateCheckoutSession"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    payments_stripe_webhook_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    products_list: {
        parameters: {
            query?: {
                category__slug?: string;
                collections__slug?: string;
                is_featured?: boolean;
                max_price?: number;
                min_price?: number;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
                tags__slug?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedProductList"];
                };
            };
        };
    };
    products_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"];
                };
            };
        };
    };
    promocodes_validate_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    code?: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromoCode"];
                };
            };
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    recipe_categories_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedRecipeCategoryList"];
                };
            };
        };
    };
    recipe_categories_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeCategory"];
                };
            };
        };
    };
    recipe_tags_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedRecipeTagList"];
                };
            };
        };
    };
    recipe_tags_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeTag"];
                };
            };
        };
    };
    recipes_list: {
        parameters: {
            query?: {
                /** @description Which field to use when ordering the results. */
                ordering?: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedRecipeList"];
                };
            };
        };
    };
    recipes_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeDetail"];
                };
            };
        };
    };
    tags_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedTagList"];
                };
            };
        };
    };
    tags_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Tag"];
                };
            };
        };
    };
    users_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedUserList"];
                };
            };
        };
    };
    users_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this пользователь. */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
        };
    };
    users_me_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
        };
    };
}
