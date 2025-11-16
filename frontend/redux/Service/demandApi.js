import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const demandApi = createApi({
  reducerPath: "demandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/demands",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Demand"],
  endpoints: (builder) => ({
    getDemands: builder.query({
      query: (username) => `/curr/${username}`,
      providesTags: ["Demand"],
    }),
    getAllDemands: builder.query({
      query: () => "/",
      providesTags: ["Demand"],
    }),
    getSingleDemand: builder.query({
      query: (id) => `/${id}`,
    }),
    addDemand: builder.mutation({
      query: (newDemand) => ({
        url: "/",
        method: "POST",
        body: newDemand,
      }),
      invalidatesTags: ["Demand"],
    }),
    updateDemand: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Demand"],
    }),
    deleteDemand: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Demand"],
    }),
  }),
});

export const {
  useGetDemandsQuery,
  useGetSingleDemandQuery,
  useAddDemandMutation,
  useUpdateDemandMutation,
  useDeleteDemandMutation,
  useGetAllDemandsQuery,
} = demandApi;
