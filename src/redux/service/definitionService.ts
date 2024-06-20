import { iDataApi } from "@/redux/api";

export const definitionService = iDataApi.injectEndpoints({
    endpoints: (builder) => ({
        createUserDefinition: builder.mutation<any, { uuid: string, schema: object }>({
            query: ({ uuid, schema }) => ({
                url: `/api/v1/definition/${uuid}`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ schema: schema }),
            }),
        }),
    }),
});

export const {
    useCreateUserDefinitionMutation,
} = definitionService;
