import { scrapingTable } from "../api";

// Define a service using a base URL from the "scrapingTable" and injects endpoints to it
export const scrapeTable = scrapingTable.injectEndpoints({
    endpoints: (builder) => ({
        // get all products
        //                        <result type,         args type>
        getProducts: builder.query<any, { page: number; pageSize: number }>({
            query: ({ page = 1, pageSize = 10 }) =>
                `api/products/?page=${page}&page_size=${pageSize}`,
        }),
        // get single product
        getProductById: builder.query<any, number>({
            query: (id) => `api/products/${id}/`,
        }),
        // create a userdata
        createProduct: builder.mutation<any, { newProduct: object,}>({
            query: ({ newProduct}) => ({
                url: "/api/v1/products/",
                method: "POST",
                body: newProduct,
            }),
        }),
        // update a product
        updateProduct: builder.mutation<
            any,
            { id: number; updatedProduct: object}
        >({
            query: ({ id, updatedProduct }) => ({
                url: `/api/products/${id}/`,
                method: "PATCH",
                body: updatedProduct,
            }),
        }),
        // delete a product
        deleteProduct: builder.mutation<any, { id: number}>({
            query: ({ id}) => ({
                url: `/api/products/${id}/`,
                method: "DELETE",
            }),
        }),
        // get all product image
        //                        <result type,         args type>
        getProductsImage: builder.query<any, { page: number; pageSize: number }>({
            query: ({ page = 1, pageSize = 4 }) =>
                `/api/file/product/?page=${page}&page_size=${pageSize}`,
        }),
        // get all category icon
        getCategoryIcon: builder.query<any, { page: number; pageSize: number }>({
            query: ({ page = 1, pageSize = 4 }) =>
                `/api/file/icon/?page=${page}&page_size=${pageSize}`,
        }),
    }),
});


// Export hooks for usage in components, which are
export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoryIconQuery,
    useGetProductsImageQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = scrapeTable;