from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('signup/',views.SignUp.as_view()),
    path('login/',views.Login.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('profile/<str:pk>/', views.ProfileView.as_view()),
    path('profile/', views.ProfileView.as_view()),
    path('verify/<str:pk>/',views.RegisteredFarmers.as_view()),
    path('verify/',views.RegisteredFarmers.as_view()),
    path('login/admin/',views.AdminLoginView.as_view()),
    path('allusers/',views.AllUsersView.as_view()),
    path('allusers/<str:pk>/',views.AllUsersView.as_view()),

]
