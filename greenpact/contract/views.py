from django.shortcuts import render,get_object_or_404,get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import models
from django.db.models import Sum
from . import serializers
from django.http import Http404
from user.models import FarmerProfile
import tempfile
from utils.contract_pdf import attach_contract_pdf
class ContractView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset_for_user(self, user):
        qs = models.Contract.objects.select_related("farmer", "buyer", "crop")
        if user.type == "farmer":
            return qs.filter(farmer=user)
        return qs.filter(buyer=user)

    def get(self, request, pk=None):
        try:
            if pk is None:
                contracts = self.get_queryset_for_user(request.user)
                serial = serializers.ContractSerializer(
                    contracts, many=True, context={"request": request}
                )
                return Response({"data": serial.data}, status=status.HTTP_200_OK)

            contract = get_object_or_404(
                models.Contract.objects.select_related("farmer", "buyer", "crop"),
                contract_id=pk,
            )
            serial = serializers.ContractSerializer(
                contract, context={"request": request}
            )
            return Response({"data": serial.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serial = serializers.ContractSerializer(
                data=request.data, context={"request": request}
            )
            if serial.is_valid():
                # Save contract instance
                contract = serial.save()

                # ✅ Generate and attach PDF
                try:
                    attach_contract_pdf(contract)
                except Exception as pdf_err:
                    # You can decide:
                    # - either fail the whole request
                    # - or just log and still succeed
                    print("Error generating contract PDF:", pdf_err)

                return Response(
                    {"Success": "Contract Successfully Created"},
                    status=status.HTTP_200_OK,
                )

            return Response({"Error": serial.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        try:
            if request.user.type == "farmer":
                return Response(
                    {"Access Denied": "You cannot change the Contract"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            contract = get_object_or_404(models.Contract, contract_id=pk)
            serial = serializers.ContractSerializer(
                contract,
                data=request.data,
                partial=True,
                context={"request": request},
            )
            if serial.is_valid():
                serial.save()
                return Response(
                    {"Sucess": "Contract Updated"},
                    status=status.HTTP_200_OK,
                )
            return Response({"Error": serial.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TransactionView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            transaction=get_list_or_404(models.Transaction,contract=contract)
            serial=serializers.TransactionSerializer(transaction,many=True, context={'request': request})
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self,request):
        try:
            serial=serializers.TransactionSerializer(data=request.data)
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Transaction added'},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self,request,pk):
        try:
            transaction=get_object_or_404(models.Transaction,id=pk)
            serial=serializers.TransactionSerializer(transaction,data=request.data,partial=True)
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Transaction Updated'},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self,request,pk):
        try:
            transaction=get_object_or_404(models.Transaction,id=pk)
            transaction.delete()
            return Response({'Sucess':'Transaction deleted'},status=status.HTTP_200_OK)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class ContractDocView(APIView):
#     authentication_classes=[JWTAuthentication]
#     permission_classes=[IsAuthenticated]
#     def get(self,request,pk=None):
#         try:
#             contractDoc=get_object_or_404(models.ContractDoc,contract__contract_id=pk)
#             serial=serializers.ContractDocSerializer(contractDoc,context={'request':request})
#             return Response({'data':serial.data},status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetProgressView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(sel,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            total_paid = models.Transaction.objects.filter(contract=contract).aggregate(total=Sum('amount'))['total'] or 0
            total_price=contract.nego_price*contract.quantity 
            remaining_amount = total_price - total_paid
            return Response({
                "contract_id": str(contract.contract_id),
                "total_price": total_price,
                "total_paid": total_paid,
                "remaining_amount": remaining_amount,
                "payment_complete": remaining_amount <= 0
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FarmerProgressView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            progress=get_list_or_404(models.FarmerProgress,contract=contract)
            serial=serializers.FarmerProgressSerializer(progress,many=True,context={'request':request})
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        try:
            serial=serializers.FarmerProgressSerializer(data=request.data,context={'request':request})
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Progress Saved'},status=status.HTTP_201_CREATED)
            return Response(serial.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self,request,pk):
        try:
            progress=get_object_or_404(models.FarmerProgress,id=pk)
            progress.delete()
            return Response({'Sucess':'Progress Deleted'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AllFarmerProgressView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            progress_qs = models.FarmerProgress.objects.select_related('farmer', 'contract__crop')
            data = []

            for progress in progress_qs:
                crop_name = progress.contract.crop.crop_name if progress.contract and progress.contract.crop else None

                data.append({
                    "contract_id": progress.contract.contract_id if progress.contract else None,
                    "farmer_name": progress.farmer.username,
                    "crop_name": crop_name,
                    "current_status": progress.current_status,
                    "date": progress.date,
                    "image": progress.image.url if progress.image else None
                })

            return Response({"data": data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AllTransactionView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            transactions = models.Transaction.objects.select_related("contract__buyer")
            serializer = serializers.TransactionListSerializer(transactions, many=True,context={'request': request})
            return Response({"data": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class FaceMatchView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            image = request.FILES.get('image')
            if not image:
                return Response({"error": "No image provided"}, status=400)

            try:
                farmer_profile = request.user.farmer_profile
            except FarmerProfile.DoesNotExist:
                return Response({"error": "Farmer profile not found"}, status=404)

            print(f"Farmer Profile: {farmer_profile}")
            try:
                stored_image_path = farmer_profile.image.url
                print(f"Stored Image Path: {stored_image_path}")
            except Exception as e:
                return Response({"error": f"Could not download stored image: {str(e)}"}, status=500)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_uploaded:
                for chunk in image.chunks():
                    temp_uploaded.write(chunk)
                uploaded_image_path = temp_uploaded.name
                print(f"Uploaded Image Path: {uploaded_image_path}")
            try:
                result = True
                return Response({"Verification": result}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": f"Face verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TransactionUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            role=request.user.type
            contract=None
            if role=="farmer":
                contract=get_list_or_404(models.Contract,farmer=request.user)
            else:
                contract=get_list_or_404(models.Contract,buyer=request.user)
            transaction=get_list_or_404(models.Transaction,contract__in=contract)
            serial=serializers.TransactionSerializer(transaction,many=True,context={'request': request})
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AllContracts(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            contracts = models.Contract.objects.all().select_related("farmer", "buyer", "crop")
            serial = serializers.ContractSerializer(
                contracts, many=True, context={"request": request}
            )
            return Response({"data": serial.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
