from django.urls import path
from . import views
urlpatterns = [
    path('',views.RatingView.as_view()),
    path('<str:pk>/',views.RatingView.as_view()),
    path('delete/<uuid:id>/',views.RatingView.as_view()),
    path('update/<uuid:id>',views.RatingView.as_view()),
]
