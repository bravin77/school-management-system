from django.http import JsonResponse
from django.shortcuts import render

from rest_framework import filters, viewsets

from .models import (
    Student,
    Teacher,
    Subject,
    Marks,
    Attendance,
)

from .serializers import (
    StudentSerializer,
    TeacherSerializer,
    SubjectSerializer,
    MarksSerializer,
    AttendanceSerializer,
)


# ============================================================
# TEACHER API
# ============================================================

class TeacherViewSet(viewsets.ModelViewSet):

    queryset = Teacher.objects.all()

    serializer_class = TeacherSerializer

    filter_backends = [
        filters.SearchFilter
    ]

    search_fields = [
        "name",
        "email",
    ]


# ============================================================
# SUBJECT API
# ============================================================

class SubjectViewSet(viewsets.ModelViewSet):

    queryset = Subject.objects.all()

    serializer_class = SubjectSerializer

    filter_backends = [
        filters.SearchFilter
    ]

    search_fields = [
        "name",
        "teacher__name",
    ]


# ============================================================
# STUDENT API
# ============================================================

class StudentViewSet(viewsets.ModelViewSet):

    queryset = Student.objects.all()

    serializer_class = StudentSerializer

    filter_backends = [
        filters.SearchFilter
    ]

    search_fields = [
        "name",
        "age",
    ]


# ============================================================
# MARKS API
# ============================================================

class MarksViewSet(viewsets.ModelViewSet):

    queryset = Marks.objects.all()

    serializer_class = MarksSerializer

    filter_backends = [
        filters.SearchFilter
    ]

    search_fields = [
        "student__name",
        "subject__name",
    ]


# ============================================================
# ATTENDANCE API
# ============================================================

class AttendanceViewSet(viewsets.ModelViewSet):

    queryset = Attendance.objects.all()

    serializer_class = AttendanceSerializer

    filter_backends = [
        filters.SearchFilter
    ]

    search_fields = [
        "student__name",
        "status",
    ]


# ============================================================
# BACKEND ROOT
# ============================================================

def home(request):

    return JsonResponse(
        {
            "message":
                "School Management System API is running.",

            "status":
                "online",
        }
    )


# ============================================================
# OPTIONAL DJANGO FRONTEND PAGES
# ============================================================

def students_page(request):

    return render(
        request,
        "students.html"
    )


def teachers_page(request):

    return render(
        request,
        "teachers.html"
    )


def subjects_page(request):

    return render(
        request,
        "subjects.html"
    )


def marks_page(request):

    return render(
        request,
        "marks.html"
    )


def attendance_page(request):

    return render(
        request,
        "attendance.html"
    )


def dashboard(request):

    return render(
        request,
        "dashboard.html"
    )