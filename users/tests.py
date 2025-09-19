import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user():
    return User.objects.create_user(username='testuser', password='testpassword123', email='test@example.com')

@pytest.mark.django_db
class TestRegistrationAPI:
    
    def test_register_user_success(self, api_client):
        """Тест успешной регистрации пользователя со всеми полями."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'password': 'newpassword123',
            'password2': 'newpassword123',
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser').exists()
        user = User.objects.get(username='newuser')
        assert user.check_password('newpassword123')
        assert user.email == 'new@example.com'
        assert user.first_name == 'New'

    def test_register_user_minimal_fields(self, api_client):
        """Тест регистрации только с обязательными полями."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'minimaluser',
            'password': 'password123',
            'password2': 'password123',
            'email': 'minimal@example.com',
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='minimaluser').exists()

    def test_register_user_password_mismatch(self, api_client):
        """Тест регистрации с несовпадающими паролями."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'password': 'newpassword123',
            'password2': 'wrongpassword',
            'email': 'new@example.com'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data
        assert "Password fields didn't match." in str(response.data['password'])

    def test_register_user_email_exists(self, api_client, test_user):
        """Тест регистрации с уже существующим email."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'anotheruser',
            'password': 'password123',
            'password2': 'password123',
            'email': test_user.email
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data
        assert "Пользователь с таким email уже существует." in str(response.data['email'])

    def test_register_user_username_exists(self, api_client, test_user):
        """Тест регистрации с уже существующим именем пользователя."""
        url = '/api/v1/auth/register/'
        data = {
            'username': test_user.username,
            'password': 'password123',
            'password2': 'password123',
            'email': 'another@example.com'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'username' in response.data

@pytest.mark.django_db
class TestTokenAPI:

    def test_obtain_token_success(self, api_client, test_user):
        """Тест успешного получения токена."""
        url = '/api/v1/auth/token/'
        data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_obtain_token_fail(self, api_client, test_user):
        """Тест получения токена с неверными данными."""
        url = '/api/v1/auth/token/'
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_token_success(self, api_client, test_user):
        """Тест успешного обновления токена."""
        refresh = RefreshToken.for_user(test_user)
        url = '/api/v1/auth/token/refresh/'
        data = {
            'refresh': str(refresh)
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' not in response.data 

@pytest.mark.django_db
class TestUserEndpointAPI:

    def test_get_current_user_success(self, api_client, test_user):
        """Тест получения данных текущего пользователя."""
        api_client.force_authenticate(user=test_user)
        url = '/api/v1/users/me/'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == test_user.username
        assert response.data['email'] == test_user.email
    
    def test_get_current_user_unauthorized(self, api_client):
        """Тест получения данных без аутентификации."""
        url = '/api/v1/users/me/'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED