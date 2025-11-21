import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contractApi = createApi({
  reducerPath: "contractApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/`,
    
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Contracts"], // Define tag types
  endpoints: (builder) => ({
    getContract: builder.query({
      query: (id) => `/${id}/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getAllPayments: builder.query({
      query: (id) => `/transaction/${id}/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getPayments: builder.query({
      query: () => `/transaction/user/`,
      providesTags: (result, error) => [{ type: "Contracts" }],
    }),
    getTotalContracts: builder.query({
      query: () => `/allcontracts/`,
      providesTags: (result, error) => [{ type: "Contracts" }],
    }),
    getFramerProgress: builder.query({
      query: (id) => `/progress/${id}/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getAllFramerProgress: builder.query({
      query: (id) => `/allprogress/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getAllContractorProgress: builder.query({
      query: (id) => `/alltransaction/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getContractPdf: builder.query({
      query: (id) => `/pdf/${id}/`,
      providesTags: (result, error, id) => [{ type: "Contracts", id }],
    }),
    getAllContracts: builder.query({
      query: () => "/",
      providesTags: ["Contracts"], // Automatically refetches when invalidated
    }),
    createContract: builder.mutation({
      query: (newContract) => ({
        url: "/",
        method: "POST",
        body: newContract,
      }),
      invalidatesTags: ["Contracts"], // Invalidates cache to trigger refetch
    }),
    createPayment: builder.mutation({
      query: (newPayment) => ({
        url: "/transaction/",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Contracts"], // Invalidates cache to trigger refetch
    }),
    createFarmerProgress: builder.mutation({
      query: (newProgress) => ({
        url: "/progress/",
        method: "POST",
        body: newProgress,
      }),
      invalidatesTags: ["Contracts"], // Invalidates cache to trigger refetch
    }),
    // In your contractApi definition
    updateContract: builder.mutation({
      query: ({ contract_id, updatedData }) => ({
        url: `/${contract_id}/`, // Adjust this to match your API endpoint
        method: "PUT", // or "PATCH" depending on your API
        body: updatedData, // Send the data directly as the body
      }),
      invalidatesTags: ["Contract"], // Ensure this matches your tag setup
    }),
    deleteContract: builder.mutation({
      query: (id) => ({
        url: `/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contracts"], // Refetch contracts after deletion
    }),
   
    verifyUser: builder.mutation({
      query: (image) => ({
        url: "/facematch/",
        method: "POST",
        body: image,
      }),
    }),

  }),
});

export const {
  useGetContractQuery,
  useGetAllFramerProgressQuery,
  useGetPaymentsQuery,
  useGetAllContractorProgressQuery,
  useGetAllContractsQuery,
  useGetTotalContractsQuery,
  useVerifyUserMutation,
  useGetContractPdfQuery,
  useGetFramerProgressQuery,
  useCreateFarmerProgressMutation,
  useGetAllPaymentsQuery,
  useCreateContractMutation,
  useCreatePaymentMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
} = contractApi;
