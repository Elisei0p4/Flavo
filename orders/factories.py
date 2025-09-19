import factory
from factory.django import DjangoModelFactory
from users.factories import UserFactory
from products.factories import ProductFactory
from .models import Order, OrderItem, PromoCode
from decimal import Decimal
from django.utils import timezone
import random

class PromoCodeFactory(DjangoModelFactory):
    """Factory for creating PromoCode instances."""
    
    class Meta:
        model = PromoCode
        django_get_or_create = ('code',)
    
    code = factory.Sequence(lambda n: f"PROMO{n:03d}")
    discount_percent = factory.Faker('random_int', min=5, max=50)
    valid_from = factory.LazyFunction(lambda: timezone.now() - timezone.timedelta(days=random.randint(1, 30)))
    valid_to = factory.LazyFunction(lambda: timezone.now() + timezone.timedelta(days=random.randint(1, 60)))
    is_active = True
    stripe_coupon_id = factory.Sequence(lambda n: f"coupon_{n}")

class OrderFactory(DjangoModelFactory):
    """Factory for creating Order instances."""
    
    class Meta:
        model = Order
    
    customer = factory.SubFactory(UserFactory)
    address = factory.Faker('address')
    total_price = Decimal('0.00') 
    discount_amount = Decimal('0.00')
    
    status = factory.Faker('random_element', elements=[c[0] for c in Order.OrderStatus.choices])
    
    promo_code = factory.SubFactory(PromoCodeFactory) 
    
    stripe_session_id = factory.Sequence(lambda n: f"cs_test_{n}")
    stripe_payment_intent_id = factory.Sequence(lambda n: f"pi_test_{n}")

    @factory.post_generation
    def items(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for item_data in extracted:
                OrderItemFactory.create(order=self, **item_data)
        else:
            num_items = random.randint(1, 3)
            products_for_order = ProductFactory.create_batch(num_items)
            for product in products_for_order:
                OrderItemFactory.create(order=self, product=product)
        
        if create:
            total_before_discount = sum(item.product.price * item.quantity for item in self.items.all())
            self.total_price = total_before_discount
            
            if self.promo_code and self.promo_code.is_active:
                self.discount_amount = total_before_discount * (Decimal(self.promo_code.discount_percent) / 100)
                self.total_price = max(Decimal('0.00'), self.total_price - self.discount_amount)
            
            self.save(update_fields=['total_price', 'discount_amount'])


class OrderItemFactory(DjangoModelFactory):
    """Factory for creating OrderItem instances."""
    
    class Meta:
        model = OrderItem
    
    order = factory.SubFactory(OrderFactory)
    product = factory.SubFactory(ProductFactory)
    quantity = factory.Faker('random_int', min=1, max=5)
    price_at_order = factory.LazyAttribute(lambda o: o.product.price)