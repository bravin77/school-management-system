from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    # Django Admin
    path("admin/", admin.site.urls),

    # REST API
    path("api/", include("school.urls")),

]