from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from crops.models import Crops
from user.models import CustomUser, FarmerProfile
from datetime import date
import io
from PIL import Image


class CropsModelTests(TestCase):
    """Test cases for Crops model"""

    def setUp(self):
        self.farmer_user = CustomUser.objects.create_user(
            username="testfarmer",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.crop = Crops.objects.create(
            crop_name="Wheat",
            publisher=self.farmer_user,
            crop_price=5000,
            quantity=100,
            Description="Fresh wheat harvest",
            harvested_time=date.today(),
            location="Punjab, India"
        )

    def test_crop_creation(self):
        """Test crop is created successfully"""
        self.assertEqual(self.crop.crop_name, "Wheat")
        self.assertEqual(self.crop.publisher, self.farmer_user)
        self.assertEqual(self.crop.crop_price, 5000)
        self.assertEqual(self.crop.quantity, 100)
        self.assertIsNotNone(self.crop.crop_id)

    def test_crop_uuid_unique(self):
        """Test crop UUID is unique"""
        crop2 = Crops.objects.create(
            crop_name="Rice",
            publisher=self.farmer_user,
            crop_price=4000,
            quantity=50,
            Description="Fresh rice",
            harvested_time=date.today(),
            location="Punjab"
        )
        self.assertNotEqual(self.crop.crop_id, crop2.crop_id)


class CropViewTests(APITestCase):
    """Test cases for Crop API views"""

    def setUp(self):
        self.client = APIClient()
        
        # Create farmer user
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.farmer_profile = FarmerProfile.objects.create(
            user=self.farmer_user,
            name="Farmer",
            address="Address",
            phoneno="1234567890",
            is_verfied=True
        )
        
        # Create test crop
        self.crop = Crops.objects.create(
            crop_name="Wheat",
            publisher=self.farmer_user,
            crop_price=5000,
            quantity=100,
            Description="Fresh wheat",
            harvested_time=date.today(),
            location="Punjab"
        )
        
        self.client.force_authenticate(user=self.farmer_user)

    def create_test_image(self):
        """Helper method to create test image"""
        file = io.BytesIO()
        image = Image.new('RGB', (100, 100), color='green')
        image.save(file, 'png')
        file.name = 'crop.png'
        file.seek(0)
        return SimpleUploadedFile("crop.png", file.read(), content_type="image/png")

    def test_get_all_crops(self):
        """Test getting all crops"""
        url = '/crops/detail/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertEqual(len(response.data['data']), 1)

    def test_get_single_crop(self):
        """Test getting a single crop by ID"""
        url = f'/crops/detail/{self.crop.crop_id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['crop_name'], 'Wheat')

    def test_create_crop(self):
        """Test creating a new crop"""
        url = '/crops/detail/'
        data = {
            'crop_name': 'Rice',
            'crop_price': 4000,
            'quantity': 50,
            'Description': 'Fresh rice harvest',
            'harvested_time': str(date.today()),
            'location': 'Punjab, India',
            'crop_image': self.create_test_image()
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Crops.objects.filter(crop_name='Rice').exists())

    def test_update_crop(self):
        """Test updating an existing crop"""
        url = f'/crops/detail/{self.crop.crop_id}'
        data = {
            'crop_price': 5500,
            'quantity': 120
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.crop.refresh_from_db()
        self.assertEqual(self.crop.crop_price, 5500)
        self.assertEqual(self.crop.quantity, 120)

    def test_delete_crop(self):
        """Test deleting a crop"""
        url = f'/crops/detail/{self.crop.crop_id}'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Crops.objects.filter(crop_id=self.crop.crop_id).exists())


class CurrUserCropsTests(APITestCase):
    """Test cases for current user crops view"""

    def setUp(self):
        self.client = APIClient()
        
        # Create farmer user
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.farmer_profile = FarmerProfile.objects.create(
            user=self.farmer_user,
            name="Farmer",
            address="Address",
            phoneno="1234567890",
            is_verfied=True
        )
        
        # Create crops for farmer
        Crops.objects.create(
            crop_name="Wheat",
            publisher=self.farmer_user,
            crop_price=5000,
            quantity=100,
            Description="Wheat",
            harvested_time=date.today(),
            location="Punjab"
        )
        Crops.objects.create(
            crop_name="Rice",
            publisher=self.farmer_user,
            crop_price=4000,
            quantity=50,
            Description="Rice",
            harvested_time=date.today(),
            location="Punjab"
        )
        
        self.client.force_authenticate(user=self.farmer_user)

    def test_get_current_user_crops(self):
        """Test getting crops for current user"""
        url = f'/crops/detail/curr/{self.farmer_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_user_with_no_crops(self):
        """Test getting crops for user with no crops"""
        other_user = CustomUser.objects.create_user(
            username="otherfarmer",
            password="pass",
            type=CustomUser.Types.FARMER
        )
        url = f'/crops/detail/curr/{other_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data'], [])


class CropsPricesViewTests(APITestCase):
    """Test cases for crop prices API view"""

    def setUp(self):
        self.client = APIClient()
        
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.client.force_authenticate(user=self.farmer_user)

    def test_get_crop_prices_unauthorized(self):
        """Test accessing crop prices without authentication"""
        self.client.force_authenticate(user=None)
        url = '/crops/prices/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_crop_prices_authenticated(self):
        """Test accessing crop prices with authentication"""
        url = '/crops/prices/'
        response = self.client.get(url)
        # This test may fail if external API is down, but structure is valid
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_502_BAD_GATEWAY])


class CommodityWisePricesTests(APITestCase):
    """Test cases for commodity-wise prices view"""

    def setUp(self):
        self.client = APIClient()
        
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.client.force_authenticate(user=self.farmer_user)

    def test_get_commodity_prices(self):
        """Test getting prices for a specific commodity"""
        url = '/crops/prices/commodity/Wheat'
        response = self.client.get(url)
        # Response depends on external API
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_502_BAD_GATEWAY])
