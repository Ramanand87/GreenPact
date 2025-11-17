from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from demands.models import Demand
from user.models import CustomUser, ContractorProfile
from datetime import date


class DemandModelTests(TestCase):
    """Test cases for Demand model"""

    def setUp(self):
        self.contractor_user = CustomUser.objects.create_user(
            username="testcontractor",
            password="testpass123",
            type=CustomUser.Types.CONTRACTOR
        )
        self.demand = Demand.objects.create(
            crop_name="Wheat",
            demand_user=self.contractor_user,
            crop_price=5000,
            contact_no="1234567890",
            quantity=100,
            description="Need fresh wheat",
            location="Mumbai, India",
            harvested_time=date.today()
        )

    def test_demand_creation(self):
        """Test demand is created successfully"""
        self.assertEqual(self.demand.crop_name, "Wheat")
        self.assertEqual(self.demand.demand_user, self.contractor_user)
        self.assertEqual(self.demand.crop_price, 5000)
        self.assertEqual(self.demand.quantity, 100)
        self.assertIsNotNone(self.demand.demand_id)

    def test_demand_str(self):
        """Test demand string representation"""
        expected_str = f'Wheat demanded by {self.contractor_user.username}'
        self.assertEqual(str(self.demand), expected_str)

    def test_demand_uuid_unique(self):
        """Test demand UUID is unique"""
        demand2 = Demand.objects.create(
            crop_name="Rice",
            demand_user=self.contractor_user,
            crop_price=4000,
            contact_no="1234567890",
            quantity=50,
            description="Need rice",
            location="Mumbai",
            harvested_time=date.today()
        )
        self.assertNotEqual(self.demand.demand_id, demand2.demand_id)


class DemandViewTests(APITestCase):
    """Test cases for Demand API views"""

    def setUp(self):
        self.client = APIClient()
        
        # Create contractor user
        self.contractor_user = CustomUser.objects.create_user(
            username="contractor",
            password="testpass123",
            type=CustomUser.Types.CONTRACTOR
        )
        self.contractor_profile = ContractorProfile.objects.create(
            user=self.contractor_user,
            name="Contractor",
            address="Address",
            phoneno="1234567890",
            gstin="22AAAAA0000A1Z5",
            is_verfied=True
        )
        
        # Create test demand
        self.demand = Demand.objects.create(
            crop_name="Wheat",
            demand_user=self.contractor_user,
            crop_price=5000,
            contact_no="1234567890",
            quantity=100,
            description="Need wheat",
            location="Mumbai",
            harvested_time=date.today()
        )
        
        self.client.force_authenticate(user=self.contractor_user)

    def test_get_all_demands(self):
        """Test getting all demands"""
        url = '/demands/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertEqual(len(response.data['data']), 1)

    def test_get_single_demand(self):
        """Test getting a single demand by ID"""
        url = f'/demands/{self.demand.demand_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['crop_name'], 'Wheat')

    def test_create_demand(self):
        """Test creating a new demand"""
        url = '/demands/'
        data = {
            'crop_name': 'Rice',
            'crop_price': 4000,
            'contact_no': '9876543210',
            'quantity': 50,
            'description': 'Need fresh rice',
            'location': 'Mumbai, India',
            'harvested_time': str(date.today())
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Demand.objects.filter(crop_name='Rice').exists())

    def test_update_demand(self):
        """Test updating an existing demand"""
        url = f'/demands/{self.demand.demand_id}'
        data = {
            'crop_price': 5500,
            'quantity': 120
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.demand.refresh_from_db()
        self.assertEqual(self.demand.crop_price, 5500)
        self.assertEqual(self.demand.quantity, 120)

    def test_delete_demand(self):
        """Test deleting a demand"""
        url = f'/demands/{self.demand.demand_id}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Demand.objects.filter(demand_id=self.demand.demand_id).exists())

    def test_get_nonexistent_demand(self):
        """Test getting a demand that doesn't exist"""
        url = '/demands/00000000-0000-0000-0000-000000000000'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DemandCurrUserTests(APITestCase):
    """Test cases for current user demands view"""

    def setUp(self):
        self.client = APIClient()
        
        # Create contractor user
        self.contractor_user = CustomUser.objects.create_user(
            username="contractor",
            password="testpass123",
            type=CustomUser.Types.CONTRACTOR
        )
        self.contractor_profile = ContractorProfile.objects.create(
            user=self.contractor_user,
            name="Contractor",
            address="Address",
            phoneno="1234567890",
            gstin="22AAAAA0000A1Z5",
            is_verfied=True
        )
        
        # Create demands for contractor
        Demand.objects.create(
            crop_name="Wheat",
            demand_user=self.contractor_user,
            crop_price=5000,
            contact_no="1234567890",
            quantity=100,
            description="Wheat",
            location="Mumbai",
            harvested_time=date.today()
        )
        Demand.objects.create(
            crop_name="Rice",
            demand_user=self.contractor_user,
            crop_price=4000,
            contact_no="1234567890",
            quantity=50,
            description="Rice",
            location="Mumbai",
            harvested_time=date.today()
        )
        
        self.client.force_authenticate(user=self.contractor_user)

    def test_get_current_user_demands(self):
        """Test getting demands for current user"""
        url = f'/demands/curr/{self.contractor_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 2)

    def test_get_user_with_no_demands(self):
        """Test getting demands for user with no demands"""
        other_user = CustomUser.objects.create_user(
            username="othercontractor",
            password="pass",
            type=CustomUser.Types.CONTRACTOR
        )
        url = f'/demands/curr/{other_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data'], [])

    def test_unauthorized_access(self):
        """Test accessing demands without authentication"""
        self.client.force_authenticate(user=None)
        url = f'/demands/curr/{self.contractor_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
