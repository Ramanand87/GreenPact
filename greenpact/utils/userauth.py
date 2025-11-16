from user.models import FarmerProfile, ContractorProfile
from django.contrib.auth import authenticate

def authen(username, password):
    if username.isdigit():
        try:
            prof = FarmerProfile.objects.get(phoneno=username)
            return authenticate(username=prof.user.username, password=password)
        except FarmerProfile.DoesNotExist:
            pass
        try:
            prof = ContractorProfile.objects.get(phoneno=username)
            return authenticate(username=prof.user.username, password=password)
        except ContractorProfile.DoesNotExist:
            return None 
    return authenticate(username=username, password=password)
