from django.shortcuts import render,get_object_or_404,get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import models
from . import serializers
from rest_framework.pagination import PageNumberPagination
import requests
from django.http import Http404

class CropView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request,pk=None):
        if pk is None:
            try:
                crops=models.Crops.objects.all()
                serial=serializers.CropsSerializer(crops,many=True,context={'request': request})
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            try: 
                crops=get_object_or_404(models.Crops,crop_id=pk)
                serial=serializers.CropsSerializer(crops,context={'request': request})
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        try:
            serial=serializers.CropsSerializer(data=request.data,context={'request': request})
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Crop Advertisement Created'},status=status.HTTP_201_CREATED)
            else:
                return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, pk):
        try:
            # Print incoming request data for debugging
            print("Incoming request data:", request.data)
            
            crop = get_object_or_404(models.Crops, crop_id=pk)
            serial = serializers.CropsSerializer(crop, data=request.data, partial=True,context={'request': request})
            
            if serial.is_valid():
                serial.save()
                return Response({'Success': 'Crop Advertisement Updated'}, status=status.HTTP_200_OK)
            else:
                # Print serializer errors for debugging
                print("Serializer errors:", serial.errors)
                return Response({'Error': serial.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Print exception for debugging
            print("Exception:", str(e))
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self,request,pk):
        crop=get_object_or_404(models.Crops,crop_id=pk)
        crop.delete()
        return Response({'Sucess':'Deleted Sucessfully'},status=status.HTTP_204_NO_CONTENT)

class CurrUserCrops(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            crops=get_list_or_404(models.Crops,publisher__username=pk)
            serial=serializers.CropsSerializer(crops,many=True,context={'request': request})
            return Response(serial.data,status=status.HTTP_200_OK)
        except Http404:
            return Response({'data':[]}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CropsPricesView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request,pk=None):
        if pk is None:
            try:
                api_key = "579b464db66ec23bdd000001cabc1a6c11bb4e037101f662c2766a83"
                api_url = f'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&offset=0&limit=10000'
                response = requests.get(api_url)
                if response.status_code != 200:
                    return Response({'Error': 'Failed to fetch data from API'}, status=status.HTTP_502_BAD_GATEWAY)
                api_data = response.json()["records"]
                return Response({'data':api_data},status=status.HTTP_200_OK)
            except requests.exceptions.RequestException as e:
                return Response({'Error': f'API request error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)
            except Exception as e:  
                return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            try:
                api_key = "579b464db66ec23bdd000001cabc1a6c11bb4e037101f662c2766a83"
                api_url = f'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&offset=0&limit=10000&filters%5Bstate.keyword%5D={pk}'
                response = requests.get(api_url)
                if response.status_code != 200:
                    return Response({'Error': 'Failed to fetch data from API'}, status=status.HTTP_502_BAD_GATEWAY)
                api_data = response.json()["records"]
                fields_to_exclude = {"grade", "variety", "market"}

                filtered_data = [
                    {key: value for key, value in item.items() if key not in fields_to_exclude}
                    for item in api_data
                ]
                return Response({'data':filtered_data},status=status.HTTP_200_OK)
            except requests.exceptions.RequestException as e:
                return Response({'Error': f'API request error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)
            except Exception as e:
                return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CommodityWisePrices(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            api_key = "579b464db66ec23bdd000001cabc1a6c11bb4e037101f662c2766a83"
            api_url = f'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&offset=0&limit=10000&filters%5Bcommodity%5D={pk}'
            
            response = requests.get(api_url)
            if response.status_code != 200:
                return Response({'Error': 'Failed to fetch data from API'}, status=status.HTTP_502_BAD_GATEWAY)
            
            api_data = response.json().get("records", [])

            fields_to_exclude = {"grade", "variety", "market"}

            filtered_data = [
                {key: value for key, value in item.items() if key not in fields_to_exclude}
                for item in api_data
            ]
            paginator = CustomPagination()
            paginator.page_size = paginator.get_page_size(request) or 10
            paginated_data = paginator.paginate_queryset(filtered_data, request, view=self)
            return paginator.get_paginated_response(paginated_data)

        except requests.exceptions.RequestException as e:
            return Response({'Error': f'API request error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)