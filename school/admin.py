from django.contrib import admin
from .models import Student, Teacher, Subject,Marks,Attendance
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Subject)
admin.site.register(Marks)
admin.site.register(Attendance)

# Register your models here.
