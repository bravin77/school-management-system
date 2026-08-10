document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});


const API_URLS = {
    students: "/api/students/",
    teachers: "/api/teachers/",
    subjects: "/api/subjects/",
    marks: "/api/marks/",
    attendance: "/api/attendance/"
};


/* ================================
   API HELPER
================================ */

async function getDashboardData(url) {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}


/* ================================
   HANDLE DRF RESPONSE
================================ */

function extractResults(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.results)) {
        return data.results;
    }

    return [];
}


/* ================================
   UPDATE COUNTERS
================================ */

function updateCounter(ids, value) {

    for (const id of ids) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
            return;
        }
    }
}


/* ================================
   MAIN DASHBOARD
================================ */

async function loadDashboard() {

    try {

        const [
            studentsResponse,
            teachersResponse,
            subjectsResponse,
            marksResponse,
            attendanceResponse
        ] = await Promise.all([

            getDashboardData(API_URLS.students),
            getDashboardData(API_URLS.teachers),
            getDashboardData(API_URLS.subjects),
            getDashboardData(API_URLS.marks),
            getDashboardData(API_URLS.attendance)

        ]);


        const students = extractResults(studentsResponse);
        const teachers = extractResults(teachersResponse);
        const subjects = extractResults(subjectsResponse);
        const marks = extractResults(marksResponse);
        const attendance = extractResults(attendanceResponse);


        /* ================================
           MAIN COUNTERS
        ================================= */

        updateCounter(
            ["studentCount", "studentsCount", "totalStudents"],
            students.length
        );

        updateCounter(
            ["teacherCount", "teachersCount", "totalTeachers"],
            teachers.length
        );

        updateCounter(
            ["subjectCount", "subjectsCount", "totalSubjects"],
            subjects.length
        );

        updateCounter(
            ["marksCount", "totalMarks"],
            marks.length
        );

        updateCounter(
            ["attendanceCount", "totalAttendance"],
            attendance.length
        );


        /* ================================
           DASHBOARD SECTIONS
        ================================= */

        displayAttendanceStatus(attendance);

        displayAverageMarks(marks);

        displayRecentStudents(students);

        displayRecentAttendance(attendance);
        displayRecentMarks(marks);


        console.log("Dashboard loaded successfully.");

        console.log("Students:", students.length);
        console.log("Teachers:", teachers.length);
        console.log("Subjects:", subjects.length);
        console.log("Marks:", marks.length);
        console.log("Attendance:", attendance.length);


    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

        showDashboardError(
            "Unable to load dashboard data. Please refresh the page."
        );
    }
}


/* =========================================================
   1. ATTENDANCE STATUS
========================================================= */

function displayAttendanceStatus(attendance) {

    let present = 0;
    let absent = 0;
    let late = 0;


    attendance.forEach(record => {

        const status =
            String(record.status || "")
                .trim()
                .toLowerCase();


        if (status === "present") {

            present++;

        } else if (status === "absent") {

            absent++;

        } else if (status === "late") {

            late++;
        }
    });


    updateCounter(
        ["presentCount", "attendancePresent"],
        present
    );

    updateCounter(
        ["absentCount", "attendanceAbsent"],
        absent
    );

    updateCounter(
        ["lateCount", "attendanceLate"],
        late
    );


    /*
     * Optional percentage calculations.
     */

    const total = present + absent + late;


    if (total > 0) {

        const presentPercentage =
            ((present / total) * 100).toFixed(1);

        const absentPercentage =
            ((absent / total) * 100).toFixed(1);

        const latePercentage =
            ((late / total) * 100).toFixed(1);


        updateCounter(
            ["presentPercentage"],
            `${presentPercentage}%`
        );

        updateCounter(
            ["absentPercentage"],
            `${absentPercentage}%`
        );

        updateCounter(
            ["latePercentage"],
            `${latePercentage}%`
        );
    }
}


/* =========================================================
   2. AVERAGE MARKS PER SUBJECT
========================================================= */

function displayAverageMarks(marks) {

    /*
     * Group marks by subject.
     */

    const subjectGroups = {};


    marks.forEach(mark => {

        const subjectId = mark.subject;

        const subjectName =
            mark.subject_name || "Unknown Subject";

        const score = Number(mark.score);


        if (!Number.isNaN(score)) {

            if (!subjectGroups[subjectId]) {

                subjectGroups[subjectId] = {
                    name: subjectName,
                    total: 0,
                    count: 0
                };
            }


            subjectGroups[subjectId].total += score;

            subjectGroups[subjectId].count++;
        }
    });


    const averages = Object.values(subjectGroups)
        .map(subject => {

            return {
                name: subject.name,

                average:
                    subject.total / subject.count
            };
        });


    /*
     * Find dashboard table.
     */

    const tableBody =
        document.getElementById("averageMarksBody") ||
        document.getElementById("averageMarksTableBody") ||
        document.getElementById("marksAverageBody");


    if (!tableBody) {

        console.warn(
            "Average marks table body not found."
        );

        return;
    }


    tableBody.innerHTML = "";


    if (averages.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    No marks available.
                </td>
            </tr>
        `;

        return;
    }


    averages.forEach(subject => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${escapeHTML(subject.name)}
            </td>

            <td>
                ${subject.average.toFixed(2)}
            </td>
        `;


        tableBody.appendChild(row);
    });
}


/* =========================================================
   3. RECENT STUDENTS
========================================================= */

function displayRecentStudents(students) {

    const tableBody =
        document.getElementById("recentStudentsBody") ||
        document.getElementById("studentsTableBody") ||
        document.getElementById("recentStudentsTableBody");


    if (!tableBody) {

        console.warn(
            "Recent students table body not found."
        );

        return;
    }


    tableBody.innerHTML = "";


    if (students.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No students available.
                </td>
            </tr>
        `;

        return;
    }


    /*
     * Display the newest five students.
     *
     * Your current API returns students in ID order,
     * therefore the highest IDs are treated as newest.
     */

    const recentStudents =
        [...students]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 5);


    recentStudents.forEach(student => {

        const row =
            document.createElement("tr");


        const subjects =
            Array.isArray(student.subject_names)
                ? student.subject_names.join(", ")
                : "No subjects";


        row.innerHTML = `

            <td>
                ${escapeHTML(student.name || "Unknown")}
            </td>

            <td>
                ${student.age ?? "-"}
            </td>

            <td>
                ${escapeHTML(subjects)}
            </td>

        `;


        tableBody.appendChild(row);
    });
}


/* =========================================================
   4. RECENT ATTENDANCE
========================================================= */

function displayRecentAttendance(attendance) {

    const tableBody =
        document.getElementById("recentAttendanceBody") ||
        document.getElementById("attendanceTableBody") ||
        document.getElementById("recentAttendanceTableBody");


    if (!tableBody) {

        console.warn(
            "Recent attendance table body not found."
        );

        return;
    }


    tableBody.innerHTML = "";


    if (attendance.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No attendance records available.
                </td>
            </tr>
        `;

        return;
    }


    /*
     * Sort by date.
     */

    const recentAttendance =
        [...attendance]
            .sort((a, b) => {

                return new Date(b.date) -
                       new Date(a.date);

            })
            .slice(0, 5);


    recentAttendance.forEach(record => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    record.student_name || "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    record.date || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    record.status || "-"
                )}
            </td>

        `;


        tableBody.appendChild(row);
    });
}


/* =========================================================
   OPTIONAL RECENT MARKS
========================================================= */

function displayRecentMarks(marks) {

    const tableBody =
        document.getElementById("recentMarksBody") ||
        document.getElementById("marksTableBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (marks.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No marks records available.
                </td>
            </tr>
        `;

        return;
    }


    const recentMarks =
        [...marks]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 5);


    recentMarks.forEach(mark => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    mark.student_name || "Unknown"
                )}
            </td>

            <td>
                ${escapeHTML(
                    mark.subject_name || "Unknown"
                )}
            </td>

            <td>
                ${mark.score ?? "-"}
            </td>

        `;


        tableBody.appendChild(row);
    });
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showDashboardError(message) {

    const errorElement =
        document.getElementById("dashboardError");


    if (errorElement) {

        errorElement.textContent = message;

        errorElement.style.display = "block";

        return;
    }


    console.error(message);
}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}