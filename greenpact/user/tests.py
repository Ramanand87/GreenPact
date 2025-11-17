from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from user.models import CustomUser, FarmerProfile, ContractorProfile, Documents
from rest_framework_simplejwt.tokens import RefreshToken
import io
from PIL import Image


class UserModelTests(TestCase):
    """Test cases for User models"""

    def setUp(self):
        self.farmer_user = CustomUser.objects.create_user(
            username="testfarmer",
            email="farmer@test.com",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.contractor_user = CustomUser.objects.create_user(
            username="testcontractor",
            email="contractor@test.com",
            password="testpass123",
            type=CustomUser.Types.CONTRACTOR
        )

    def test_custom_user_creation(self):
        """Test custom user is created successfully"""
        self.assertEqual(self.farmer_user.username, "testfarmer")
        self.assertEqual(self.farmer_user.type, CustomUser.Types.FARMER)
        self.assertTrue(self.farmer_user.check_password("testpass123"))

    def test_custom_user_str(self):
        """Test custom user string representation"""
        self.assertEqual(str(self.farmer_user), "testfarmer")

    def test_farmer_profile_creation(self):
        """Test farmer profile creation"""
        farmer_profile = FarmerProfile.objects.create(
            user=self.farmer_user,
            name="Test Farmer",
            address="123 Farm Road",
            phoneno="1234567890"
        )
        self.assertEqual(farmer_profile.user, self.farmer_user)
        self.assertEqual(farmer_profile.name, "Test Farmer")
        self.assertFalse(farmer_profile.is_verfied)

    def test_contractor_profile_creation(self):
        """Test contractor profile creation"""
        contractor_profile = ContractorProfile.objects.create(
            user=self.contractor_user,
            name="Test Contractor",
            address="456 Business Ave",
            phoneno="9876543210",
            gstin="22AAAAA0000A1Z5"
        )
        self.assertEqual(contractor_profile.user, self.contractor_user)
        self.assertEqual(contractor_profile.gstin, "22AAAAA0000A1Z5")
        self.assertFalse(contractor_profile.is_verfied)

    def test_documents_creation(self):
        """Test document creation for user"""
        document = Documents.objects.create(
            doc_user=self.farmer_user,
            doc=SimpleUploadedFile("test.pdf", b"file_content")
        )
        self.assertEqual(document.doc_user, self.farmer_user)
        self.assertEqual(str(document), "testfarmer")


class SignUpViewTests(APITestCase):
    """Test cases for SignUp API"""

    def setUp(self):
        self.client = APIClient()
        
    def create_test_image(self):
        """Helper method to create a test image"""
        file = io.BytesIO()
        image = Image.new('RGB', (100, 100), color='red')
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return SimpleUploadedFile("test.png", file.read(), content_type="image/png")

    def test_signup_farmer_success(self):
        """Test successful farmer signup"""
        url = '/user/signup/'
        data = {
            'username': 'newfarmer',
            'password': 'testpass123',
            'email': 'newfarmer@test.com',
            'role': 'farmer',
            'name': 'New Farmer',
            'phoneno': '1111111111',
            'address': 'Farm Address',
            'image': self.create_test_image(),
            'signature': self.create_test_image(),
            'aadhar_image': self.create_test_image(),
            'screenshot': self.create_test_image()
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(username='newfarmer').exists())

    def test_signup_contractor_success(self):
        """Test successful contractor signup"""
        url = '/user/signup/'
        data = {
            'username': 'newcontractor',
            'password': 'testpass123',
            'email': 'newcontractor@test.com',
            'role': 'contractor',
            'name': 'New Contractor',
            'phoneno': '2222222222',
            'address': 'Business Address',
            'gstin': '22AAAAA0000A1Z5',
            'image': self.create_test_image(),
            'signature': self.create_test_image(),
            'aadhar_image': self.create_test_image()
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(username='newcontractor').exists())

    def test_signup_duplicate_username(self):
        """Test signup with duplicate username"""
        CustomUser.objects.create_user(username='existinguser', password='pass', type='farmer')
        url = '/user/signup/'
        data = {
            'username': 'existinguser',
            'password': 'testpass123',
            'email': 'new@test.com',
            'role': 'farmer',
            'name': 'Test',
            'phoneno': '3333333333',
            'address': 'Address',
            'signature': self.create_test_image(),
            'aadhar_image': self.create_test_image()
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTests(APITestCase):
    """Test cases for Login API"""

    def setUp(self):
        self.client = APIClient()
        
        # Create verified farmer
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

    def test_login_success(self):
        """Test successful login"""
        url = '/user/login/'
        data = {
            'username': 'farmer',
            'password': 'testpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        url = '/user/login/'
        data = {
            'username': 'farmer',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_unverified_user(self):
        """Test login with unverified profile"""
        unverified_user = CustomUser.objects.create_user(
            username="unverified",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        FarmerProfile.objects.create(
            user=unverified_user,
            name="Unverified",
            address="Address",
            phoneno="9999999999",
            is_verfied=False
        )
        url = '/user/login/'
        data = {
            'username': 'unverified',
            'password': 'testpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileViewTests(APITestCase):
    """Test cases for Profile API"""

    def setUp(self):
        self.client = APIClient()
        
        # Create farmer user and profile
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer",
            password="testpass123",
            type=CustomUser.Types.FARMER
        )
        self.farmer_profile = FarmerProfile.objects.create(
            user=self.farmer_user,
            name="Farmer",
            address="Farm Address",
            phoneno="1234567890",
            is_verfied=True
        )
        
        # Authenticate
        self.client.force_authenticate(user=self.farmer_user)

    def test_get_profile(self):
        """Test getting user profile"""
        url = f'/user/profile/{self.farmer_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Farmer')

    def test_update_profile(self):
        """Test updating user profile"""
        url = '/user/profile/'
        data = {
            'name': 'Updated Farmer',
            'address': 'New Address'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.farmer_profile.refresh_from_db()
        self.assertEqual(self.farmer_profile.name, 'Updated Farmer')


class AdminViewTests(APITestCase):
    """Test cases for Admin views"""

    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin_user = CustomUser.objects.create_superuser(
            username="admin",
            password="adminpass123",
            email="admin@test.com"
        )
        
        # Create unverified users
        self.unverified_farmer = CustomUser.objects.create_user(
            username="unverified_farmer",
            password="pass",
            type=CustomUser.Types.FARMER
        )
        self.unverified_farmer_profile = FarmerProfile.objects.create(
            user=self.unverified_farmer,
            name="Unverified",
            address="Address",
            phoneno="1111111111",
            is_verfied=False
        )

    def test_admin_login_success(self):
        """Test admin login"""
        url = '/user/login/admin/'
        data = {
            'username': 'admin',
            'password': 'adminpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_admin_login_non_superuser(self):
        """Test non-superuser cannot login as admin"""
        regular_user = CustomUser.objects.create_user(
            username="regular",
            password="pass",
            type=CustomUser.Types.FARMER
        )
        url = '/user/login/admin/'
        data = {
            'username': 'regular',
            'password': 'pass'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_registered_users(self):
        """Test getting unverified users"""
        self.client.force_authenticate(user=self.admin_user)
        url = '/user/verify/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertIn('farmer', response.data)
        self.assertIn('contractor', response.data)

    def test_verify_user(self):
        """Test verifying a user"""
        self.client.force_authenticate(user=self.admin_user)
        url = f'/user/verify/{self.unverified_farmer.username}/'
        data = {'is_verfied': True}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.unverified_farmer_profile.refresh_from_db()
        self.assertTrue(self.unverified_farmer_profile.is_verfied)
