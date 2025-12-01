from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from user.models import CustomUser
from .models import Complaint

class ComplaintAPITests(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = CustomUser.objects.create_user(username='user1', password='password123')
        self.user2 = CustomUser.objects.create_user(username='user2', password='password123')
        self.user3 = CustomUser.objects.create_user(username='user3', password='password123')
        self.admin_user = CustomUser.objects.create_user(username='admin', password='password123', is_staff=True)

        # URLs
        self.list_create_url = reverse('complaint-list')

    def test_create_complaint(self):
        """
        Ensure we can create a new complaint object.
        """
        self.client.force_authenticate(user=self.user1)
        data = {
            'accused_username': 'user2',
            'category': 'fraud',
            'description': 'He scammed me.',
            'priority': 'High'
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Complaint.objects.count(), 1)
        self.assertEqual(Complaint.objects.get().complainant, self.user1)
        self.assertEqual(Complaint.objects.get().accused, self.user2)

    def test_create_complaint_self_accused(self):
        """
        Ensure we cannot file a complaint against ourselves.
        """
        self.client.force_authenticate(user=self.user1)
        data = {
            'accused_username': 'user1',
            'description': 'I am bad.'
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_complaints_permissions(self):
        """
        Ensure users only see relevant complaints.
        """
        # Create a complaint: user1 vs user2
        c1 = Complaint.objects.create(complainant=self.user1, accused=self.user2, description="C1")
        
        # User1 should see it
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # User2 should see it
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.list_create_url)
        self.assertEqual(len(response.data), 1)

        # User3 should NOT see it
        self.client.force_authenticate(user=self.user3)
        response = self.client.get(self.list_create_url)
        self.assertEqual(len(response.data), 0)

        # Admin should see it
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_create_url)
        self.assertEqual(len(response.data), 1)

    def test_update_complaint_user(self):
        """
        Regular users can update description but NOT status.
        """
        c1 = Complaint.objects.create(complainant=self.user1, accused=self.user2, description="Original", status="pending")
        url = reverse('complaint-detail', args=[c1.id])

        self.client.force_authenticate(user=self.user1)
        data = {'description': 'Updated', 'status': 'resolved'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        c1.refresh_from_db()
        self.assertEqual(c1.description, 'Updated')
        self.assertEqual(c1.status, 'pending')  # Status should NOT change

    def test_update_complaint_admin(self):
        """
        Admins can update status.
        """
        c1 = Complaint.objects.create(complainant=self.user1, accused=self.user2, description="Original", status="pending")
        url = reverse('complaint-detail', args=[c1.id])

        self.client.force_authenticate(user=self.admin_user)
        data = {'status': 'resolved'}
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        c1.refresh_from_db()
        self.assertEqual(c1.status, 'resolved')

    def test_delete_complaint(self):
        """
        Ensure we can delete a complaint.
        """
        c1 = Complaint.objects.create(complainant=self.user1, accused=self.user2, description="To delete")
        url = reverse('complaint-detail', args=[c1.id])

        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Complaint.objects.count(), 0)
