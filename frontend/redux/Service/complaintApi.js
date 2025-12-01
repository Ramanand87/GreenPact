import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const complaintApi = createApi({
  reducerPath: 'complaintApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/complaints`,
    
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Complaint'],
  endpoints: (builder) => ({
    createComplaint: builder.mutation({
      query: (complaintData) => ({
        url: `/`,
        method: 'POST',
        body: complaintData, // FormData with all fields including optional proof image
      }),
      invalidatesTags: ['Complaint'],
    }),
    getComplaints: builder.query({
      query: () => `/`,
      providesTags: ['Complaint'],
    }),
    getComplaintById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Complaint', id }],
    }),
    updateComplaintStatus: builder.mutation({
      query: ({ id, status, priority }) => ({
        url: `/${id}/`,
        method: 'PUT',
        body: { status, priority },
      }),
      invalidatesTags: ['Complaint'],
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useUpdateComplaintStatusMutation,
} = complaintApi;
