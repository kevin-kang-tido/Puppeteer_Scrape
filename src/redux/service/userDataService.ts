import { iDataApi } from "@/redux/api";

export const userDataService = iDataApi.injectEndpoints({
    endpoints: (builder) => ({
        createUserData: builder.mutation<any, { tableName: string, inputData: Array<Record<string, any>> }>({
            query: ({ tableName,  inputData }) => ({
                url: `/api/v1/rest-api/${tableName}`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData), // Correctly format the body
            }),
        }),
    }),
});

export const {
    useCreateUserDataMutation,
} = userDataService;
