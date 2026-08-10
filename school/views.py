from rest_framework import viewsets,filters
from django.shortcuts import render
from .models import Student, Teacher, Subject,Marks,Attendance
from .serializers import (
StudentSerializer,
TeacherSerializer,
SubjectSerializer,
MarksSerializer,
AttendanceSerializer
)
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    filter_backends = [filters.SearchFilter]

    search_fields = ["name", "email"]
class SubjectViewSet(viewsets.ModelViewSet):

    queryset = Subject.objects.all()

    serializer_class = SubjectSerializer

    filter_backends = [filters.SearchFilter]

    search_fields = [
        "name",
        "teacher__name",
    ]
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    # Search support
    filter_backends = [filters.SearchFilter]

    search_fields = [
        "name",
        "age",
        
    ]
class MarksViewSet(viewsets.ModelViewSet):

    queryset = Marks.objects.all()

    serializer_class = MarksSerializer

    filter_backends = [

        filters.SearchFilter

    ]

    search_fields = [

        "student__name",

        "subject__name"

    ]
class AttendanceViewSet(viewsets.ModelViewSet):

    queryset = Attendance.objects.all()

    serializer_class = AttendanceSerializer

    filter_backends = [

        filters.SearchFilter

    ]

    search_fields = [

        "student__name",

        "status"

    ]
def students_page(request):
    return render(request,"students.html")
def teachers_page(request):
    return render(request, "teachers.html")
def subjects_page(request):
    return render(request, "subjects.html")
def marks_page(request):
    return render(request, "marks.html")
def attendance_page(request):
    return render(request, "attendance.html")
def dashboard(request):
    return render(request, "dashboard.html")
def home(request):
    return render(request, "home.html")




# Create your views here.
