from django.urls import path
from . import views
urlpatterns = [
    path('detail/',views.CropView.as_view()),
    path('detail/<uuid:pk>',views.CropView.as_view()),
    path('detail/curr/<str:pk>/',views.CurrUserCrops.as_view()),
    path('prices/<str:pk>',views.CropsPricesView.as_view()),
    path('prices/',views.CropsPricesView.as_view()),
    path('prices/commodity/<str:pk>',views.CommodityWisePrices.as_view()),
]
