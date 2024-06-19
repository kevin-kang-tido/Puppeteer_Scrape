// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import {setAccessToken} from "@/redux/feature/auth/authSlice";
// import {setAccessToken} from "@/redux/feature/auth/authSlice";


// Setting up prepareHeaders to include the auth in the headers
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.IDATA_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        // if we have a auth, let's set the authorization header
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});
// args: for the request details // api: for Redux api object // extraOptions: for additional
const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
    // check result of each query. if it's a 401, we'll try to re-authenticate
    let result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        const res = await fetch("http://localhost:3000/api/refresh", {
            method: "POST",
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            api.dispatch(setAccessToken(data.accessToken));
            // re-run the query with the new auth
            result = await baseQuery(args, api, extraOptions);
        } else {
            const res = await fetch("http://localhost:3000/api/logout", {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
        }
    }
    return result;
};

export const scrapingTable = createApi({
    reducerPath: "scrapingTable",
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
});
