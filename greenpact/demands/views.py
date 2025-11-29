from django.shortcuts import render,get_object_or_404,get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import models
from . import serializers
from django.http import Http404

class DemandView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get(self,request,pk=None):
        if pk is None:
            try:
                demands=models.Demand.objects.all()
                serial=serializers.DemandSerializer(demands,many=True,context={'request': request})
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            try:
                demand=get_object_or_404(models.Demand,demand_id=pk)
                serial=serializers.DemandSerializer(demand, context={'request': request})
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            except Http404:
                return Response({'Error': 'No Demand found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                    return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self,request):
        try:
            serial=serializers.DemandSerializer(data=request.data,context={'request':request})
            if serial.is_valid():
                serial.save()
                return Response({"Success":"Demand Successfully Created"},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self,request,pk):
        try:
            demand=get_object_or_404(models.Demand,demand_id=pk)
            serial=serializers.DemandSerializer(demand,data=request.data,partial=True, context={'request': request})
            if serial.is_valid():
                serial.save()
                return Response({"Success":"Demand Successfully Created"},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'Error': 'No Demand found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self,request,pk):
        try:
            demand=get_object_or_404(models.Demand,demand_id=pk)
            demand.delete()
            return Response({'Sucess':'Deleted Sucessfully'},status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'Error': 'No Demand found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class DemandCurrUser(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request,pk):
        try:
            demands=get_list_or_404(models.Demand,demand_user__username=pk)
            serial=serializers.DemandSerializer(demands,many=True, context={'request': request})
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Http404:
            return Response({'data':[]}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)