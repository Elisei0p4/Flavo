import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.models import FAQ


@pytest.mark.django_db
class TestFAQAPI:
    def setup_method(self):
        self.client = APIClient()

    def test_faq_list_empty(self):
        url = reverse("faq-list")
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.json()['results'] == []

    def test_faq_list_with_items(self):
        FAQ.objects.create(question="Q1", answer="A1", order=1)
        FAQ.objects.create(question="Q2", answer="A2", order=2)

        url = reverse("faq-list")
        response = self.client.get(url)

        assert response.status_code == 200
        data = response.json()
        assert len(data['results']) == 2
        assert data['results'][0]["question"] == "Q1"
        assert data['results'][0]["answer"] == "A1"