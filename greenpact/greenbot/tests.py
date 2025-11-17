from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock


class GreenBotChatViewTests(APITestCase):
    """Test cases for GreenBot Chat API"""

    def setUp(self):
        self.client = APIClient()

    @patch('greenbot.views.call_llama')
    def test_greenbot_chat_success(self, mock_call_llama):
        """Test successful greenbot chat interaction"""
        mock_call_llama.return_value = "This is a helpful response"
        
        url = '/greenbot/chat/'
        data = {
            'message': 'What crops should I plant?',
            'history': []
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('reply', response.data)
        self.assertIn('history', response.data)
        self.assertEqual(response.data['reply'], "This is a helpful response")
        
        # Verify history is updated
        self.assertEqual(len(response.data['history']), 2)
        self.assertEqual(response.data['history'][0]['role'], 'user')
        self.assertEqual(response.data['history'][1]['role'], 'assistant')

    @patch('greenbot.views.call_llama')
    def test_greenbot_chat_with_history(self, mock_call_llama):
        """Test greenbot chat with existing conversation history"""
        mock_call_llama.return_value = "Based on your previous question..."
        
        url = '/greenbot/chat/'
        data = {
            'message': 'Tell me more',
            'history': [
                {'role': 'user', 'content': 'What is wheat farming?'},
                {'role': 'assistant', 'content': 'Wheat farming is...'}
            ]
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('reply', response.data)
        
        # Verify history grows correctly
        self.assertEqual(len(response.data['history']), 4)

    @patch('greenbot.views.call_llama')
    def test_greenbot_chat_api_error(self, mock_call_llama):
        """Test greenbot chat when API fails"""
        mock_call_llama.side_effect = Exception("API connection failed")
        
        url = '/greenbot/chat/'
        data = {
            'message': 'What crops should I plant?',
            'history': []
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)

    def test_greenbot_chat_missing_message(self):
        """Test greenbot chat with missing message field"""
        url = '/greenbot/chat/'
        data = {
            'history': []
        }
        response = self.client.post(url, data, format='json')
        
        # Should handle missing message gracefully
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_500_INTERNAL_SERVER_ERROR])

    @patch('greenbot.views.call_llama')
    def test_greenbot_chat_empty_history(self, mock_call_llama):
        """Test greenbot chat with no history (new conversation)"""
        mock_call_llama.return_value = "Hello! How can I help you today?"
        
        url = '/greenbot/chat/'
        data = {
            'message': 'Hello',
            'history': []
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['history']), 2)

    @patch('greenbot.views.call_llama')
    def test_greenbot_chat_multiple_exchanges(self, mock_call_llama):
        """Test greenbot chat maintains conversation context"""
        mock_call_llama.return_value = "The best time is spring"
        
        url = '/greenbot/chat/'
        
        # First exchange
        data1 = {
            'message': 'What is the best crop?',
            'history': []
        }
        response1 = self.client.post(url, data1, format='json')
        
        # Second exchange using history from first
        data2 = {
            'message': 'When should I plant it?',
            'history': response1.data['history']
        }
        response2 = self.client.post(url, data2, format='json')
        
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response2.data['history']), 4)


class GreenBotIntegrationTests(TestCase):
    """Integration tests for GreenBot functionality"""

    def test_greenbot_model_configuration(self):
        """Test that greenbot model is properly configured"""
        from django.conf import settings
        
        # Verify settings are configured
        self.assertTrue(hasattr(settings, 'GREENBOT_BASE_URL'))
        self.assertTrue(hasattr(settings, 'GREENBOT_MODEL'))
        self.assertEqual(settings.GREENBOT_MODEL, "meta-llama/llama-3.3-8b-instruct")

