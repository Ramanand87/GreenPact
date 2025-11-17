from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from contract.models import Contract, Transaction, FarmerProgress
from crops.models import Crops
from user.models import CustomUser, FarmerProfile, ContractorProfile
from datetime import date


class ContractModelTests(TestCase):
    """Test cases for Contract model"""

    def setUp(self):
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.contractor_user = CustomUser.objects.create_user(
            username="contractor", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.crop = Crops.objects.create(
            crop_name="Wheat", publisher=self.farmer_user, crop_price=5000,
            quantity=100, Description="Wheat", harvested_time=date.today(), location="Punjab"
        )
        self.contract = Contract.objects.create(
            farmer=self.farmer_user, buyer=self.contractor_user, crop=self.crop,
            nego_price=5200, quantity=100, delivery_address="Mumbai", delivery_date=date.today()
        )

    def test_contract_creation(self):
        self.assertEqual(self.contract.farmer, self.farmer_user)
        self.assertEqual(self.contract.nego_price, 5200)
        self.assertIsNotNone(self.contract.contract_id)


class ContractViewTests(APITestCase):
    """Test cases for Contract API views"""

    def setUp(self):
        self.client = APIClient()
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.farmer_profile = FarmerProfile.objects.create(
            user=self.farmer_user, name="Farmer", address="Address",
            phoneno="1234567890", is_verfied=True
        )
        self.contractor_user = CustomUser.objects.create_user(
            username="contractor", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.contractor_profile = ContractorProfile.objects.create(
            user=self.contractor_user, name="Contractor", address="Address",
            phoneno="9876543210", gstin="22AAAAA0000A1Z5", is_verfied=True
        )
        self.crop = Crops.objects.create(
            crop_name="Wheat", publisher=self.farmer_user, crop_price=5000,
            quantity=100, Description="Wheat", harvested_time=date.today(), location="Punjab"
        )
        self.contract = Contract.objects.create(
            farmer=self.farmer_user, buyer=self.contractor_user, crop=self.crop,
            nego_price=5200, quantity=100, delivery_address="Mumbai", delivery_date=date.today()
        )

    def test_get_contracts_as_farmer(self):
        self.client.force_authenticate(user=self.farmer_user)
        url = '/contracts/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
