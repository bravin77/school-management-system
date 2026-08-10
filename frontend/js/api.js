"use strict";

/*
============================================================
SHARED API HELPER
============================================================
*/

/*
============================================================
GET
============================================================
*/

async function apiGet(endpoint) {

    const response = await fetch(
        endpoint,
        {
            method: "GET",

            headers: {
                "Accept": "application/json"
            },

            cache: "no-store"
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `GET failed: ${response.status} ${errorText}`
        );

    }


    return await response.json();
}


/*
============================================================
POST
============================================================
*/

async function apiPost(endpoint, data) {

    const response = await fetch(
        endpoint,
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
            `POST failed: ${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(responseText);
}


/*
============================================================
PUT
============================================================
*/

async function apiPut(endpoint, data) {

    const response = await fetch(
        endpoint,
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
            `PUT failed: ${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(responseText);
}


/*
============================================================
DELETE
============================================================
*/

async function apiDelete(endpoint) {

    const response = await fetch(
        endpoint,
        {
            method: "DELETE",

            headers: {
                "Accept":
                    "application/json"
            }
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `DELETE failed: ${response.status} ${errorText}`
        );

    }


    return true;
}


/*
============================================================
GET ARRAY
============================================================
*/

async function apiGetArray(endpoint) {

    const data =
        await apiGet(endpoint);


    /*
    Normal DRF response
    */

    if (Array.isArray(data)) {

        return data;

    }


    /*
    Paginated DRF response
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