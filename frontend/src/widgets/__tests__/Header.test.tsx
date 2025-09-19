import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';



import { Header } from '@/widgets/Header/Header';


import { useSelectTotalItems } from '@/entities/cart';
import { useCollections } from '@/entities/product';
import { useAuthStore } from '@/entities/user';

type MockAuthStoreType = typeof useAuthStore & {
  setState: (updater: any) => void;
  getState: () => {
    accessToken: string | null;
    refreshToken: string | null;
    user: { username: string; flavo_coins: string; role: string; id: number; email: string } | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;
    login: jest.Mock;
    logout: jest.Mock;
    fetchUser: jest.Mock;
    refreshAccessToken: jest.Mock;
    setError: jest.Mock;
    clearError: () => void;
    error: Record<string, string> | null;
  };
  subscribe: jest.Mock;
  destroy: jest.Mock;
};

const createInitialMockAuthState = () => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: true,
  error: null,
  init: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  fetchUser: jest.fn(),
  refreshAccessToken: jest.fn(),
  setError: jest.fn(),
  clearError: jest.fn(),
});

// Глобальная переменная для текущего состояния мока.
let currentMockAuthState = createInitialMockAuthState();

// Мокируем весь модуль '@/entities/user'
jest.mock('@/entities/user', () => {
  const actualModule = jest.requireActual('@/entities/user');

  const useAuthStoreMock = jest.fn((selector) => selector(currentMockAuthState));

  Object.assign(useAuthStoreMock, {
    setState: jest.fn((updater) => {
      currentMockAuthState = typeof updater === 'function' ? updater(currentMockAuthState) : { ...currentMockAuthState, ...updater };
      useAuthStoreMock.mockImplementation((selector) => selector(currentMockAuthState));
    }),
    getState: jest.fn(() => currentMockAuthState),
    subscribe: jest.fn(),
    destroy: jest.fn(),
  });

  const MockUserChip = jest.fn(() => {
    const { isAuthenticated, user, logout } = (useAuthStore as MockAuthStoreType).getState();

    if (!isAuthenticated || !user) {
      return (
        <button
          className="font-heading text-lg text-text-light hover:text-hover-gold transition-colors duration-200 py-2"
          data-testid="login-button"
        >
          Войти
        </button>
      );
    }
    return (
      <div data-testid="user-menu-toggle">
        <span className="font-heading text-lg hidden lg:inline">{user.username}</span>
        <button onClick={() => logout()} data-testid="logout-button">Выйти</button>
      </div>
    );
  });

  return {
    ...actualModule,
    useAuthStore: useAuthStoreMock,
    UserChip: MockUserChip,
  };
});

// Мокируем useSelectTotalItems (селектор Zustand)
jest.mock('@/entities/cart', () => ({
  useSelectTotalItems: jest.fn(() => 0),
  CartIcon: jest.fn(() => {
    const totalItems = useSelectTotalItems();
    return (
      <div data-testid="header-cart">
        {totalItems > 0 && <span>{totalItems}</span>}
      </div>
    );
  }),
}));

// Мокируем useCollections (react-query хук)
jest.mock('@/entities/product', () => ({
  useCollections: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

// Приводим мокированные функции к правильному типу для TypeScript
const mockUseAuthStore = useAuthStore as MockAuthStoreType;
const mockUseSelectTotalItems = useSelectTotalItems as jest.MockedFunction<typeof useSelectTotalItems>;
const mockUseCollections = useCollections as jest.MockedFunction<any>;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderHeader = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Widget: Header', () => {
  let userEventInstance: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();

    currentMockAuthState = createInitialMockAuthState();
    mockUseAuthStore.setState(currentMockAuthState);

    mockUseSelectTotalItems.mockReturnValue(0);
    mockUseCollections.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
    });

    userEventInstance = userEvent.setup();
  });

  test('должен отображать кнопку "Войти" для гостя', () => {
    renderHeader();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.queryByText(/testuser/i)).not.toBeInTheDocument();
  });

  test('должен отображать имя пользователя и иконку корзины с количеством товаров для авторизованного пользователя', () => {
    mockUseAuthStore.setState({
      isAuthenticated: true,
      user: { username: 'testuser', flavo_coins: "100.00", role: 'CUSTOMER', id: 1, email: 'test@mail.com' },
      logout: jest.fn(),
    });
    mockUseSelectTotalItems.mockReturnValue(3);

    renderHeader();

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
  });

  test('счетчик корзины должен быть скрыт, если в корзине 0 товаров', () => {
    mockUseAuthStore.setState({
      isAuthenticated: true,
      user: { username: 'testuser', flavo_coins: "100.00", role: 'CUSTOMER', id: 1, email: 'test@mail.com' },
      logout: jest.fn(),
    });
    mockUseSelectTotalItems.mockReturnValue(0);

    renderHeader();

    const cartIconLink = screen.getByTestId('header-cart');
    expect(cartIconLink).toBeInTheDocument();
    expect(cartIconLink.querySelector('span')).not.toBeInTheDocument();
  });

  test('должен отображать "Профиль" для авторизованного пользователя в мобильном меню', async () => {
    mockUseAuthStore.setState({
      isAuthenticated: true,
      user: { username: 'testuser', flavo_coins: "100.00", role: 'CUSTOMER', id: 1, email: 'test@mail.com' },
      logout: jest.fn(),
    });
    mockUseSelectTotalItems.mockReturnValue(0);

    renderHeader();

    const mobileMenuToggleButton = screen.getByRole('button', { name: /bars icon|Меню/i });
    await userEventInstance.click(mobileMenuToggleButton);

    expect(screen.getByRole('link', { name: /Профиль/i })).toBeInTheDocument();
  });

  test('должен отображать "Войти" для гостя в мобильном меню', async () => {
    mockUseSelectTotalItems.mockReturnValue(0);

    renderHeader();

    const mobileMenuToggleButton = screen.getByRole('button', { name: /bars icon|Меню/i });
    await userEventInstance.click(mobileMenuToggleButton);

    expect(screen.getByRole('link', { name: /Войти/i })).toBeInTheDocument();
  });
});