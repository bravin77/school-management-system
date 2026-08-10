from django.db import models
class Teacher(models.Model):
        name = models.CharField(max_length=100)
        email = models.EmailField(unique=True)
        def __str__(self):
            return self.name
class Subject(models.Model):
        name = models.CharField(max_length=100)
        teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
        )
        def __str__(self):
            return self.name
class Student(models.Model):
        name = models.CharField(max_length=100)
        age = models.IntegerField()
        subjects = models.ManyToManyField(Subject)
        def __str__(self):
         return self.name
class Marks(models.Model):

    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    score = models.IntegerField()

    class Meta:

        constraints = [

            models.UniqueConstraint(

                fields=["student", "subject"],

                name="unique_student_subject"

            )

        ]
    def __str__(self):
        return f"{self.student} - {self.subject} ({self.score})"
class Attendance(models.Model):

    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Late', 'Late'),
    ]

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )

    date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "date"],
                name="unique_student_date"
            )
        ]

    def __str__(self):
        return f"{self.student} - {self.date} - {self.status}"    

# Create your models here.
