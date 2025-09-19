"""
Tests using factory-boy and hypothesis for property-based testing.
"""
import pytest
from decimal import Decimal
from hypothesis import given, strategies as st
from django.test import TestCase
from django.core.exceptions import ValidationError

from products.factories import ProductFactory, TagFactory, CollectionFactory
from products.models import Product, Tag, Collection


class FactoryTestCase(TestCase):
    """Test cases using factory-boy."""
    
    def test_product_factory_creates_valid_product(self):
        """Test that ProductFactory creates valid products."""
        product = ProductFactory()
        
        self.assertIsInstance(product, Product)
        self.assertIsNotNone(product.name)
        self.assertIsNotNone(product.description)
        self.assertGreater(product.price, 0)
        self.assertGreaterEqual(product.stock, 0)
        self.assertGreaterEqual(product.rating, 0)
        self.assertLessEqual(product.rating, 5)
        self.assertGreaterEqual(product.review_count, 0)
    
    def test_product_factory_with_custom_data(self):
        """Test ProductFactory with custom data."""
        product = ProductFactory(
            name="Custom Product",
            price=Decimal('99.99'),
            stock=50
        )
        
        self.assertEqual(product.name, "Custom Product")
        self.assertEqual(product.price, Decimal('99.99'))
        self.assertEqual(product.stock, 50)
    
    def test_product_factory_creates_tags(self):
        """Test that ProductFactory creates products with tags."""
        product = ProductFactory()
        
        self.assertGreater(product.tags.count(), 0)
        self.assertTrue(all(isinstance(tag, Tag) for tag in product.tags.all()))
    
    def test_product_factory_creates_collections(self):
        """Test that ProductFactory creates products with collections."""
        product = ProductFactory()
        
        self.assertGreater(product.collections.count(), 0)
        self.assertTrue(all(isinstance(collection, Collection) for collection in product.collections.all()))
    
    def test_tag_factory_creates_valid_tag(self):
        """Test that TagFactory creates valid tags."""
        tag = TagFactory()
        
        self.assertIsInstance(tag, Tag)
        self.assertIsNotNone(tag.name)
        self.assertIsNotNone(tag.slug)
        self.assertEqual(tag.slug, tag.name.lower().replace(' ', '-'))
    
    def test_collection_factory_creates_valid_collection(self):
        """Test that CollectionFactory creates valid collections."""
        collection = CollectionFactory()
        
        self.assertIsInstance(collection, Collection)
        self.assertIsNotNone(collection.name)
        self.assertIsNotNone(collection.description)
        self.assertIsNotNone(collection.slug)
        self.assertEqual(collection.slug, collection.name.lower().replace(' ', '-'))


class HypothesisTestCase(TestCase):
    """Test cases using hypothesis for property-based testing."""
    
    @given(
        name=st.text(min_size=1, max_size=100),
        price=st.decimals(min_value=Decimal('0.01'), max_value=Decimal('9999.99'), places=2),
        stock=st.integers(min_value=0, max_value=1000)
    )
    def test_product_creation_with_various_inputs(self, name, price, stock):
        """Test product creation with various inputs using hypothesis."""
        product = ProductFactory(
            name=name,
            price=price,
            stock=stock
        )
        
        self.assertEqual(product.name, name)
        self.assertEqual(product.price, price)
        self.assertEqual(product.stock, stock)
        self.assertIsInstance(product, Product)
    
    @given(
        rating=st.decimals(min_value=Decimal('0.00'), max_value=Decimal('5.00'), places=2),
        review_count=st.integers(min_value=0, max_value=1000)
    )
    def test_product_rating_properties(self, rating, review_count):
        """Test product rating properties with various inputs."""
        product = ProductFactory(
            rating=rating,
            review_count=review_count
        )
        
        self.assertEqual(product.rating, rating)
        self.assertEqual(product.review_count, review_count)
        self.assertGreaterEqual(product.rating, Decimal('0.00'))
        self.assertLessEqual(product.rating, Decimal('5.00'))
        self.assertGreaterEqual(product.review_count, 0)
    
    @given(
        tag_count=st.integers(min_value=1, max_value=5)
    )
    def test_product_with_multiple_tags(self, tag_count):
        """Test product creation with multiple tags."""
        tags = TagFactory.create_batch(tag_count)
        product = ProductFactory(tags=tags)
        
        self.assertEqual(product.tags.count(), tag_count)
        self.assertEqual(set(product.tags.all()), set(tags))
    
    @given(
        collection_count=st.integers(min_value=1, max_value=3)
    )
    def test_product_with_multiple_collections(self, collection_count):
        """Test product creation with multiple collections."""
        collections = CollectionFactory.create_batch(collection_count)
        product = ProductFactory(collections=collections)
        
        self.assertEqual(product.collections.count(), collection_count)
        self.assertEqual(set(product.collections.all()), set(collections))
