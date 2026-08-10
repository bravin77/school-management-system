"use strict";

/*
============================================================
FRONTEND API CONFIGURATION
============================================================
*/

const API_BASE_URL =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? ""
        : "https://school-management-backend-igpt.onrender.com";


/*
============================================================
API ENDPOINTS
============================================================
*/

const API = {

    students:
        `${API_BASE_URL}/api/students/`,

    teachers:
        `${API_BASE_URL}/api/teachers/`,

    subjects:
        `${API_BASE_URL}/api/subjects/`,

    marks:
        `${API_BASE_URL}/api/marks/`,

    attendance:
        `${API_BASE_URL}/api/attendance/`

};


/*
============================================================
BUILD URL WITH ID
============================================================
*/

function apiUrl(endpoint, id = null) {

    if (id === null || id === undefined) {
        return endpoint;
    }

    return `${endpoint}${id}/`;
}