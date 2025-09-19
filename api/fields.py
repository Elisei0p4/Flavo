from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

class EnumChoiceField(serializers.ChoiceField):
    """
    A ChoiceField that handles Django's TextChoices enums and integrates with drf-spectacular.
    """
    def __init__(self, enum_class, **kwargs):
        self.enum_class = enum_class
        kwargs['choices'] = [(choice.value, choice.label) for choice in enum_class]
        super().__init__(**kwargs)

    def to_representation(self, value):
        if isinstance(value, self.enum_class):
            return value.value
        return value

    def to_internal_value(self, data):
        if isinstance(data, self.enum_class):
            return data
        try:
            return self.enum_class(data)
        except ValueError:
            self.fail('invalid_choice', input=data)

extend_schema_field(EnumChoiceField)
