from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models
from . import serializers

class RatingView(APIView):  
    def get(self,request,pk):
        try:
            ratings = models.Rating.objects.filter(rated_user__username=pk)
            serializer = serializers.RatingSerializer(ratings, many=True)
            return Response({'data':serializer.data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self,request):
        try:
            serializer=serializers.RatingSerializer(data=request.data,context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({'Sucess':'Rating Giving Successfull'},status=status.HTTP_201_CREATED)
            else:
                return Response({'Error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self,request,id):
        try:
            ratings = models.Rating.objects.get(id=id)
            serializer = serializers.RatingSerializer(ratings,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'Sucess':'Rating Updated'},status=status.HTTP_201_CREATED)
            return Response({'Error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def delete(self, request, id):
        try:
            rating = get_object_or_404(models.Rating, id=id)
            if rating.rating_user != request.user:
                return Response({"Error": "You can only delete your own ratings"}, status=status.HTTP_403_FORBIDDEN)
            rating.delete()
            return Response({"Success": "Rating deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)