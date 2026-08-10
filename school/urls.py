from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    StudentViewSet,
    TeacherViewSet,
    SubjectViewSet,
    MarksViewSet,
    AttendanceViewSet,
)

router = DefaultRouter()

router.register(
    r"students",
    StudentViewSet,
    basename="students"
)

router.register(
    r"teachers",
    TeacherViewSet,
    basename="teachers"
)

router.register(
    r"subjects",
    SubjectViewSet,
    basename="subjects"
)

router.register(
    r"marks",
    MarksViewSet,
    basename="marks"
)

router.register(
    r"attendance",
    AttendanceViewSet,
    basename="attendance"
)

urlpatterns = router.urls