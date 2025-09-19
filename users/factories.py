import factory
from factory.django import DjangoModelFactory
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class UserFactory(DjangoModelFactory):
    """Factory for creating CustomUser instances."""
    
    class Meta:
        model = User
        django_get_or_create = ('username', 'email',)
    
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True
    is_staff = False
    is_superuser = False
    flavo_coins = factory.Faker('pydecimal', left_digits=3, right_digits=2, positive=True, max_value=1000)
    role = User.Role.CUSTOMER

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        if not create:
            return
        
        password = extracted or 'testpass123'
        self.set_password(password)
        self.save()

class AdminUserFactory(UserFactory):
    username = 'root'
    email = 'admin@example.com'
    is_staff = True
    is_superuser = True
    role = User.Role.MANAGER
    password = factory.PostGenerationMethodCall('set_password', 'admin')