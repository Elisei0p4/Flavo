import pytest
from decimal import Decimal
from rest_framework.test import APIClient
from .models import Product, Collection, Tag

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_products():
    tag1 = Tag.objects.create(name='Spicy', slug='spicy')
    tag2 = Tag.objects.create(name='Sweet', slug='sweet')
    collection = Collection.objects.create(name='Grill Master', description='For BBQ', slug='grill-master')
    
    products = []
    Product.objects.create(name='Salt', description='Basic salt', price=Decimal('99.00'), sku='SKU000')
    for i in range(15):
        product = Product.objects.create(
            name=f'Spice Mix {i+1}',
            description=f'Description for mix {i+1}',
            price=Decimal('100.00') + i,
            sku=f'SKU00{i+1}'
        )
        if i % 2 == 0:
            product.tags.add(tag1)
            product.collections.add(collection)
        else:
            product.tags.add(tag2)
        products.append(product)
    return products


@pytest.mark.django_db
class TestProductAPI:
    def test_get_product_list_unauthenticated(self, api_client, create_products):
        """Тест: любой пользователь может получить список продуктов."""
        url = '/api/v1/products/'
        response = api_client.get(url)
        assert response.status_code == 200
        assert 'results' in response.data
        assert 'count' in response.data
        assert response.data['count'] == 16

    def test_product_list_pagination(self, api_client, create_products):
        """Тест: пагинация для списка продуктов работает корректно."""
        url = '/api/v1/products/'
        response = api_client.get(url)
        assert response.status_code == 200

        assert len(response.data['results']) == 6
        assert response.data['next'] is not None
        assert response.data['previous'] is None


        response_page_2 = api_client.get(response.data['next'])
        assert response_page_2.status_code == 200
        assert len(response_page_2.data['results']) == 6

    def test_get_single_product(self, api_client, create_products):
        """Тест: можно получить детали одного продукта."""
        product = create_products[0]
        url = f'/api/v1/products/{product.id}/'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == product.id
        assert response.data['name'] == product.name
        assert 'tags' in response.data
        assert response.data['tags'][0]['name'] == 'Spicy'
        
    def test_filter_by_tag(self, api_client, create_products):
        """Тест: фильтрация по тегу работает."""
        url = '/api/v1/products/?tags__slug=spicy'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['count'] == 8
        for product in response.data['results']:
            assert 'spicy' in [tag['slug'] for tag in product['tags']]
            
    def test_filter_by_price_range(self, api_client, create_products):
        """Тест: фильтрация по диапазону цен работает."""
        url = '/api/v1/products/?min_price=100&max_price=102'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['count'] == 3
        prices = [float(p['price']) for p in response.data['results']]
        assert all(100 <= price <= 102 for price in prices)
        
    def test_filter_by_min_price_only(self, api_client, create_products):
        """Тест: фильтрация только по минимальной цене."""
        url = '/api/v1/products/?min_price=110'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['count'] == 5
        prices = [float(p['price']) for p in response.data['results']]
        assert all(price >= 110 for price in prices)


@pytest.mark.django_db
class TestCollectionAPI:
    def test_get_collection_list(self, api_client, create_products):
        """Тест: можно получить список коллекций."""
        url = '/api/v1/collections/'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['count'] == 1
        assert response.data['results'][0]['name'] == 'Grill Master'

    def test_get_single_collection_with_products(self, api_client, create_products):
        """Тест: можно получить детали коллекции с вложенными продуктами."""
        collection = Collection.objects.get(slug='grill-master')
        url = f'/api/v1/collections/{collection.id}/'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['name'] == collection.name
        assert 'products' in response.data
        assert len(response.data['products']) == 8