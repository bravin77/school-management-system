"use strict";

/*
=========================================================
ATTENDANCE MANAGEMENT
=========================================================
*/

const ATTENDANCE_API =
    `${API_BASE_URL}/api/attendance/`;

const STUDENTS_API =
    `${API_BASE_URL}/api/students/`;

let attendanceRecords = [];
let students = [];


/*
=========================================================
INITIALIZATION
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("ATTENDANCE.JS LOADED");

    loadStudents();
    loadAttendance();

    const form =
        document.getElementById(
            "attendanceForm"
        );

    if (form) {

        form.addEventListener(
            "submit",
            saveAttendance
        );

    }

});


/*
=========================================================
LOAD STUDENTS
=========================================================
*/

async function loadStudents() {

    const select =
        document.getElementById(
            "attendanceStudent"
        );


    if (!select) {
        return;
    }


    try {

        select.innerHTML =
            '<option value="">Loading students...</option>';


        const response =
            await fetch(
                STUDENTS_API,
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
                `Failed to load students: HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        students =
            Array.isArray(data)
                ? data
                : (data.results || []);


        select.innerHTML =
            '<option value="">Select student</option>';


        students.forEach(
            student => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    student.id;


                option.textContent =
                    student.name;


                select.appendChild(
                    option
                );

            }
        );


        console.log(
            "Attendance students loaded:",
            students.length
        );


    } catch (error) {

        console.error(
            "Attendance student loading error:",
            error
        );


        select.innerHTML =
            '<option value="">Failed to load students</option>';
    }
}


/*
=========================================================
LOAD ATTENDANCE
=========================================================
*/

async function loadAttendance() {

    const tbody =
        document.getElementById(
            "attendanceTableBody"
        );


    if (!tbody) {
        return;
    }


    try {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Loading attendance...
                </td>
            </tr>
        `;


        const response =
            await fetch(
                ATTENDANCE_API,
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
                `Failed to load attendance: HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        attendanceRecords =
            Array.isArray(data)
                ? data
                : (data.results || []);


        console.log(
            "Attendance records loaded:",
            attendanceRecords.length
        );


        displayAttendance();


    } catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load attendance.
                </td>
            </tr>
        `;
    }
}


/*
=========================================================
DISPLAY ATTENDANCE
=========================================================
*/

function displayAttendance() {

    const tbody =
        document.getElementById(
            "attendanceTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (attendanceRecords.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No attendance records found.
                </td>
            </tr>
        `;

        return;
    }


    attendanceRecords.forEach(
        record => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(record.id)}
                </td>

                <td>
                    ${escapeHTML(
                        record.student_name ||
                        getStudentName(record.student)
                    )}
                </td>

                <td>
                    ${escapeHTML(record.date)}
                </td>

                <td>
                    ${escapeHTML(record.status)}
                </td>

                <td class="actions">

                    <button
                        type="button"
                        class="btn-edit"
                        data-id="${record.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-delete"
                        data-id="${record.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            const editButton =
                row.querySelector(
                    ".btn-edit"
                );


            const deleteButton =
                row.querySelector(
                    ".btn-delete"
                );


            editButton.addEventListener(
                "click",
                () => editAttendance(record.id)
            );


            deleteButton.addEventListener(
                "click",
                () => deleteAttendance(record.id)
            );


            tbody.appendChild(row);

        }
    );
}


/*
=========================================================
GET STUDENT NAME FALLBACK
=========================================================
*/

function getStudentName(id) {

    const student =
        students.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    return student
        ? student.name
        : `Student #${id}`;
}


/*
=========================================================
SAVE / UPDATE ATTENDANCE
=========================================================
*/

async function saveAttendance(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "attendanceId"
        ).value;


    const student =
        document.getElementById(
            "attendanceStudent"
        ).value;


    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    const status =
        document.getElementById(
            "attendanceStatus"
        ).value;


    if (!student) {

        alert(
            "Please select a student."
        );

        return;
    }


    if (!date) {

        alert(
            "Please select a date."
        );

        return;
    }


    if (!status) {

        alert(
            "Please select attendance status."
        );

        return;
    }


    const payload = {

        student:
            Number(student),

        date:
            date,

        status:
            status

    };


    const url = id
        ? `${ATTENDANCE_API}${id}/`
        : ATTENDANCE_API;


    const method = id
        ? "PUT"
        : "POST";


    try {

        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                `HTTP ${response.status}`
            );
        }


        alert(
            id
                ? "Attendance updated successfully."
                : "Attendance saved successfully."
        );


        resetAttendanceForm();


        await loadAttendance();


    } catch (error) {

        console.error(
            "Attendance save error:",
            error
        );


        alert(
            "Failed to save attendance.\n\n" +
            error.message
        );
    }
}


/*
=========================================================
EDIT ATTENDANCE
=========================================================
*/

function editAttendance(id) {

    const record =
        attendanceRecords.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!record) {

        alert(
            "Attendance record not found."
        );

        return;
    }


    document.getElementById(
        "attendanceId"
    ).value =
        record.id;


    document.getElementById(
        "attendanceStudent"
    ).value =
        record.student;


    document.getElementById(
        "attendanceDate"
    ).value =
        record.date;


    document.getElementById(
        "attendanceStatus"
    ).value =
        record.status;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/*
=========================================================
DELETE ATTENDANCE
=========================================================
*/

async function deleteAttendance(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this attendance record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${ATTENDANCE_API}${id}/`,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const text =
                await response.text();


            throw new Error(
                text ||
                `HTTP ${response.status}`
            );
        }


        alert(
            "Attendance deleted successfully."
        );


        resetAttendanceForm();


        await loadAttendance();


    } catch (error) {

        console.error(
            "Delete attendance error:",
            error
        );


        alert(
            "Failed to delete attendance.\n\n" +
            error.message
        );
    }
}


/*
=========================================================
RESET FORM
=========================================================
*/

function resetAttendanceForm() {

    const form =
        document.getElementById(
            "attendanceForm"
        );


    if (form) {
        form.reset();
    }


    document.getElementById(
        "attendanceId"
    ).value = "";
}


/*
=========================================================
ESCAPE HTML
=========================================================
*/

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;
}