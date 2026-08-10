from rest_framework import serializers
from .models import Student, Teacher, Subject,Marks,Attendance
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'
class SubjectSerializer(serializers.ModelSerializer):

    teacher_name = serializers.SerializerMethodField()

    class Meta:

        model = Subject

        fields = [
            "id",
            "name",
            "teacher",
            "teacher_name",
        ]

    def get_teacher_name(self, obj):

        return obj.teacher.name
class StudentSerializer(serializers.ModelSerializer):

    subject_names = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "age",
            "subjects",
            "subject_names",
        ]

    def get_subject_names(self, obj):

        return [
            subject.name
            for subject in obj.subjects.all()
        ]
class MarksSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()

    subject_name = serializers.SerializerMethodField()

    class Meta:

        model = Marks

        fields = [

            "id",

            "student",

            "student_name",

            "subject",

            "subject_name",

            "score"

        ]

    def get_student_name(self, obj):

        return obj.student.name

    def get_subject_name(self, obj):

        return obj.subject.name

class AttendanceSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()

    class Meta:

        model = Attendance

        fields = [

            "id",

            "student",

            "student_name",

            "date",

            "status"

        ]

    def get_student_name(self, obj):

        return obj.student.name