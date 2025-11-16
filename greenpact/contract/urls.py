from django.urls import path
from . import views
urlpatterns = [
    path('',views.ContractView.as_view()),
    path('<uuid:pk>/',views.ContractView.as_view()),
    # path('pdf/<uuid:pk>/',views.ContractDocView.as_view()),
    path('transaction/<uuid:pk>/',views.TransactionView.as_view()),
    path('transaction/',views.TransactionView.as_view()),
    path('progress/detail/<uuid:pk>/',views.GetProgressView.as_view()),
    path('progress/<uuid:pk>/',views.FarmerProgressView.as_view()),
    path('progress/',views.FarmerProgressView.as_view()),
    path('allprogress/',views.AllFarmerProgressView.as_view()),
    path('alltransaction/',views.AllTransactionView.as_view()),
    path('facematch/',views.FaceMatchView.as_view()),
    path('transaction/user/',views.TransactionUser.as_view()),
    path('allcontracts/',views.AllContracts.as_view()),
]
