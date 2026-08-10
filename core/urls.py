from django.contrib import admin
from django.urls import include, path

urlpatterns = [

    path("admin/", admin.site.urls),

    # REST API
    path("api/", include("school.urls")),

    # Frontend pages
    path("", include("school.web_urls")),
]