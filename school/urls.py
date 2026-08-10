from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
StudentViewSet,
TeacherViewSet,
SubjectViewSet,
MarksViewSet,
AttendanceViewSet
)
router = DefaultRouter()
router.register('students', StudentViewSet)
router.register('teachers', TeacherViewSet)
router.register('subjects', SubjectViewSet)
router.register("marks", MarksViewSet)
router.register("attendance", AttendanceViewSet)
urlpatterns = [
path('', include(router.urls)),
]