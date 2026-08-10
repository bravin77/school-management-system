from django.urls import path

from .views import (

    home,

    students_page,

    teachers_page,

    subjects_page,

    marks_page,

    attendance_page,

     dashboard,

)

urlpatterns = [

    path("", home, name="home"),

    path(
        "students/",
        students_page,
        name="students"
    ),

    path(
        "teachers/",
        teachers_page,
        name="teachers"
    ),

    path(
        "subjects/",
        subjects_page,
        name="subjects"
    ),

    path(
        "marks/",
        marks_page,
        name="marks"
    ),

    path(
        "attendance/",
        attendance_page,
        name="attendance"
    ),
    path(
    "dashboard/",
    dashboard,
    name="dashboard"
    ),

]