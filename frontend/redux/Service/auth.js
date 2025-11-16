"use client";

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/user",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "User",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/login/`,
        method: "POST",
        body: data,
      }),
    }),
    Adminlogin: builder.mutation({
      query: (data) => ({
        url: `/login/admin/`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `/signup/`,
        method: "POST",
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: "/verify/",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/allusers/",
      }),
    }),

    verifyUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `verify/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    rejectUser: builder.mutation({
      query: (userId) => ({
        url: `allusers/${userId}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useAdminloginMutation,
  useRejectUserMutation,
  useGetUsersQuery,
  useRegisterMutation,
  useGetAllUsersQuery,
  useVerifyUserMutation,
} = authApi;
