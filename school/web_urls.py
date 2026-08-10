from django.urls import path
from . import views


urlpatterns = [

    path(
        "",
        views.home,
        name="home"
    ),

    path(
        "dashboard/",
        views.dashboard,
        name="dashboard"
    ),

    path(
        "students/",
        views.students_page,
        name="students"
    ),

    path(
        "teachers/",
        views.teachers_page,
        name="teachers"
    ),

    path(
        "subjects/",
        views.subjects_page,
        name="subjects"
    ),

    path(
        "marks/",
        views.marks_page,
        name="marks"
    ),

    path(
        "attendance/",
        views.attendance_page,
        name="attendance"
    ),
]