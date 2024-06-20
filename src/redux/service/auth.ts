import {iDataApi} from "@/redux/api";

export const authApi = iDataApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, {email:string; password:string}>({
            query: ({ email, password }) => ({
                url:`/api/v1/auth/login`,
                method: "POST",
                body: JSON.stringify({email, password}),
            })
        }),
    })
})

export const {
    useLoginMutation
} = authApi