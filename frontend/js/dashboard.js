"use strict";

/*
=========================================================
DASHBOARD MANAGEMENT
=========================================================
*/

const API_URLS = {

    students:
        "https://school-management-backend-igpt.onrender.com/api/students/",

    teachers:
        "https://school-management-backend-igpt.onrender.com/api/teachers/",

    subjects:
        "https://school-management-backend-igpt.onrender.com/api/subjects/",

    marks:
        "https://school-management-backend-igpt.onrender.com/api/marks/",

    attendance:
        "https://school-management-backend-igpt.onrender.com/api/attendance/"

};


/*
=========================================================
INITIALIZATION
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "DASHBOARD.JS LOADED"
        );

        loadDashboard();

    }
);


/*
=========================================================
API REQUEST
=========================================================
*/

async function getDashboardData(url) {

    const response =
        await fetch(
            url,
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
                },

                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Request failed: HTTP ${response.status}`
        );

    }


    return await response.json();

}


/*
=========================================================
HANDLE DRF RESPONSE
=========================================================
*/

function extractResults(data) {

    if (Array.isArray(data)) {

        return data;

    }


    if (
        data &&
        Array.isArray(data.results)
    ) {

        return data.results;

    }


    return [];

}


/*
=========================================================
UPDATE COUNTER
=========================================================
*/

function updateCounter(
    ids,
    value
) {

    for (const id of ids) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value;

            return;

        }

    }

}


/*
=========================================================
LOAD DASHBOARD
=========================================================
*/

async function loadDashboard() {

    try {

        console.log(
            "Loading dashboard data..."
        );


        const [
            studentsResponse,
            teachersResponse,
            subjectsResponse,
            marksResponse,
            attendanceResponse
        ] =
            await Promise.all([

                getDashboardData(
                    API_URLS.students
                ),

                getDashboardData(
                    API_URLS.teachers
                ),

                getDashboardData(
                    API_URLS.subjects
                ),

                getDashboardData(
                    API_URLS.marks
                ),

                getDashboardData(
                    API_URLS.attendance
                )

            ]);


        const students =
            extractResults(
                studentsResponse
            );

        const teachers =
            extractResults(
                teachersResponse
            );

        const subjects =
            extractResults(
                subjectsResponse
            );

        const marks =
            extractResults(
                marksResponse
            );

        const attendance =
            extractResults(
                attendanceResponse
            );


        /*
        =================================================
        COUNTERS
        =================================================
        */

        updateCounter(
            [
                "studentCount",
                "studentsCount",
                "totalStudents"
            ],
            students.length
        );


        updateCounter(
            [
                "teacherCount",
                "teachersCount",
                "totalTeachers"
            ],
            teachers.length
        );


        updateCounter(
            [
                "subjectCount",
                "subjectsCount",
                "totalSubjects"
            ],
            subjects.length
        );


        updateCounter(
            [
                "marksCount",
                "totalMarks"
            ],
            marks.length
        );


        updateCounter(
            [
                "attendanceCount",
                "totalAttendance"
            ],
            attendance.length
        );


        /*
        =================================================
        DASHBOARD TABLES
        =================================================
        */

        displayAttendanceStatus(
            attendance
        );

        displayAverageMarks(
            marks
        );

        displayRecentStudents(
            students
        );

        displayRecentAttendance(
            attendance
        );

        displayRecentMarks(
            marks
        );


        const loading =
            document.getElementById(
                "dashboardLoading"
            );

        if (loading) {

            loading.style.display =
                "none";

        }


        console.log(
            "Dashboard loaded successfully."
        );

        console.log(
            "Students:",
            students.length
        );

        console.log(
            "Teachers:",
            teachers.length
        );

        console.log(
            "Subjects:",
            subjects.length
        );

        console.log(
            "Marks:",
            marks.length
        );

        console.log(
            "Attendance:",
            attendance.length
        );

    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );


        showDashboardError(
            "Unable to load dashboard data. Check the browser console."
        );

    }

}


/*
=========================================================
ATTENDANCE STATUS
=========================================================
*/

function displayAttendanceStatus(
    attendance
) {

    let present = 0;

    let absent = 0;

    let late = 0;


    attendance.forEach(
        record => {

            const status =
                String(
                    record.status || ""
                )
                .trim()
                .toLowerCase();


            if (
                status === "present"
            ) {

                present++;

            } else if (
                status === "absent"
            ) {

                absent++;

            } else if (
                status === "late"
            ) {

                late++;

            }

        }
    );


    updateCounter(
        [
            "presentCount",
            "attendancePresent"
        ],
        present
    );


    updateCounter(
        [
            "absentCount",
            "attendanceAbsent"
        ],
        absent
    );


    updateCounter(
        [
            "lateCount",
            "attendanceLate"
        ],
        late
    );

}


/*
=========================================================
AVERAGE MARKS
=========================================================
*/

function displayAverageMarks(
    marks
) {

    const tableBody =
        document.getElementById(
            "averageMarksBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (marks.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    No marks available.
                </td>
            </tr>
        `;

        return;
    }


    const groups = {};


    marks.forEach(
        mark => {

            const subjectId =
                mark.subject;

            const subjectName =
                mark.subject_name ||
                "Unknown Subject";

            const score =
                Number(mark.score);


            if (
                Number.isNaN(score)
            ) {

                return;

            }


            if (
                !groups[subjectId]
            ) {

                groups[subjectId] = {

                    name:
                        subjectName,

                    total:
                        0,

                    count:
                        0

                };

            }


            groups[subjectId].total +=
                score;

            groups[subjectId].count++;

        }
    );


    const averages =
        Object.values(groups);


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


    averages.forEach(
        subject => {

            const row =
                document.createElement(
                    "tr"
                );


            const average =
                subject.total /
                subject.count;


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        subject.name
                    )}
                </td>

                <td>
                    ${average.toFixed(2)}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/*
=========================================================
RECENT STUDENTS
=========================================================
*/

function displayRecentStudents(
    students
) {

    const tableBody =
        document.getElementById(
            "recentStudentsBody"
        );


    if (!tableBody) {
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


    const recentStudents =
        [...students]
            .sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            )
            .slice(0, 5);


    recentStudents.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            const subjects =
                Array.isArray(
                    student.subject_names
                )
                    ? student.subject_names.join(
                        ", "
                    )
                    : "No subjects";


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        student.name ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.age ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        subjects
                    )}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/*
=========================================================
RECENT ATTENDANCE
=========================================================
*/

function displayRecentAttendance(
    attendance
) {

    const tableBody =
        document.getElementById(
            "recentAttendanceBody"
        );


    if (!tableBody) {
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


    const recentAttendance =
        [...attendance]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 5);


    recentAttendance.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        record.student_name ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.date ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.status ||
                        "-"
                    )}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/*
=========================================================
RECENT MARKS
=========================================================
*/

function displayRecentMarks(
    marks
) {

    const tableBody =
        document.getElementById(
            "recentMarksBody"
        );


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
            .sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            )
            .slice(0, 5);


    recentMarks.forEach(
        mark => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        mark.student_name ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        mark.subject_name ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        mark.score ??
                        "-"
                    )}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/*
=========================================================
ERROR
=========================================================
*/

function showDashboardError(
    message
) {

    const errorElement =
        document.getElementById(
            "dashboardError"
        );


    if (errorElement) {

        errorElement.textContent =
            message;

        errorElement.style.display =
            "block";

    }


    const loading =
        document.getElementById(
            "dashboardLoading"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

}


/*
=========================================================
ESCAPE HTML
=========================================================
*/

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;

}