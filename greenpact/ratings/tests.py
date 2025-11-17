from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from ratings.models import Rating
from user.models import CustomUser


class RatingModelTests(TestCase):
    """Test cases for Rating model"""

    def setUp(self):
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.contractor_user = CustomUser.objects.create_user(
            username="contractor", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.rating = Rating.objects.create(
            rated_user=self.farmer_user,
            rating_user=self.contractor_user,
            description="Great farmer",
            rate=5
        )

    def test_rating_creation(self):
        """Test rating is created successfully"""
        self.assertEqual(self.rating.rated_user, self.farmer_user)
        self.assertEqual(self.rating.rating_user, self.contractor_user)
        self.assertEqual(self.rating.rate, 5)
        self.assertEqual(self.rating.description, "Great farmer")

    def test_rating_str(self):
        """Test rating string representation"""
        expected = f'{self.contractor_user.username} rated {self.farmer_user.username}'
        self.assertEqual(str(self.rating), expected)

    def test_rating_uuid_unique(self):
        """Test rating UUID is unique"""
        rating2 = Rating.objects.create(
            rated_user=self.contractor_user,
            rating_user=self.farmer_user,
            rate=4
        )
        self.assertNotEqual(self.rating.id, rating2.id)

    def test_rating_choices(self):
        """Test rating value is within valid range"""
        self.assertIn(self.rating.rate, [1, 2, 3, 4, 5])


class RatingViewTests(APITestCase):
    """Test cases for Rating API views"""

    def setUp(self):
        self.client = APIClient()
        
        # Create users
        self.farmer_user = CustomUser.objects.create_user(
            username="farmer", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.contractor_user = CustomUser.objects.create_user(
            username="contractor", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        
        # Create existing rating
        self.rating = Rating.objects.create(
            rated_user=self.farmer_user,
            rating_user=self.contractor_user,
            description="Good work",
            rate=4
        )
        
        self.client.force_authenticate(user=self.contractor_user)

    def test_get_ratings_for_user(self):
        """Test getting all ratings for a specific user"""
        url = f'/ratings/{self.farmer_user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertEqual(len(response.data['data']), 1)

    def test_create_rating(self):
        """Test creating a new rating"""
        url = '/ratings/'
        data = {
            'rated_user': 'farmer',
            'rate': 5,
            'description': 'Excellent farmer'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_rating(self):
        """Test updating an existing rating"""
        url = f'/ratings/update/{self.rating.id}'
        data = {
            'rate': 5,
            'description': 'Updated: Excellent work'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.rating.refresh_from_db()
        self.assertEqual(self.rating.rate, 5)

    def test_delete_rating_own(self):
        """Test deleting own rating"""
        url = f'/ratings/delete/{self.rating.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Rating.objects.filter(id=self.rating.id).exists())

    def test_delete_rating_not_owner(self):
        """Test cannot delete rating created by another user"""
        other_user = CustomUser.objects.create_user(
            username="other", password="testpass123", type=CustomUser.Types.FARMER
        )
        other_rating = Rating.objects.create(
            rated_user=self.farmer_user,
            rating_user=other_user,
            rate=3
        )
        
        url = f'/ratings/delete/{other_rating.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_rating_invalid_rate(self):
        """Test creating rating with invalid rate value"""
        url = '/ratings/'
        data = {
            'rated_user': 'farmer',
            'rate': 6,  # Invalid - should be 1-5
            'description': 'Test'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
