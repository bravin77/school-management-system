"use strict";

/*
============================================================
SHARED API HELPER
============================================================

config.js MUST be loaded before this file.

config.js provides:

    API_BASE_URL

The same helper works for:

LOCAL:
    http://127.0.0.1:8000

PRODUCTION:
    https://your-render-backend.onrender.com
============================================================
*/


/* ==========================================================
   GET
========================================================== */

async function apiGet(endpoint) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method: "GET",

            headers: {
                "Accept": "application/json"
            },

            cache: "no-store"
        }
    );


    const responseText =
        await response.text();


    if (!response.ok) {

        throw new Error(
            `GET ${endpoint} failed: ` +
            `${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(responseText);

}


/* ==========================================================
   POST
========================================================== */

async function apiPost(endpoint, data) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"
            },

            body:
                JSON.stringify(data)
        }
    );


    const responseText =
        await response.text();


    if (!response.ok) {

        throw new Error(
            `POST ${endpoint} failed: ` +
            `${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(responseText);

}


/* ==========================================================
   PUT
========================================================== */

async function apiPut(endpoint, data) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"
            },

            body:
                JSON.stringify(data)
        }
    );


    const responseText =
        await response.text();


    if (!response.ok) {

        throw new Error(
            `PUT ${endpoint} failed: ` +
            `${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(responseText);

}


/* ==========================================================
   DELETE
========================================================== */

async function apiDelete(endpoint) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method: "DELETE",

            headers: {
                "Accept":
                    "application/json"
            }
        }
    );


    const responseText =
        await response.text();


    if (!response.ok) {

        throw new Error(
            `DELETE ${endpoint} failed: ` +
            `${response.status} ${responseText}`
        );

    }


    return true;

}


/* ==========================================================
   GET ARRAY
========================================================== */

async function apiGetArray(endpoint) {

    const data =
        await apiGet(endpoint);


    /*
    Normal Django REST Framework response:

    [
        {...},
        {...}
    ]
    */

    if (Array.isArray(data)) {

        return data;

    }


    /*
    Paginated DRF response:

    {
        "count": 10,
        "results": [...]
    }
    */

    if (
        data &&
        Array.isArray(data.results)
    ) {

        return data.results;

    }


    throw new Error(
        `Unexpected API response from ${endpoint}`
    );

}