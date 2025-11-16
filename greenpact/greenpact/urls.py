
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/',include('user.urls')),
    path('crops/',include('crops.urls')),
    path('ratings/',include('ratings.urls')),
    path('demands/',include('demands.urls')),
    path('chat/',include('chat.urls')),
    path('contracts/',include('contract.urls')),
    path('greenbot/',include('greenbot.urls')),
]

urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)   
urlpatterns+=static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)   
