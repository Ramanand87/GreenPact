import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/user/profile',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access; 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (username) => `/${username}`,  // Fetch user profile by username
      providesTags: (result, error, username) => [{ type: 'Profile', id: username }],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: `/`,  
        method: "PUT",
        body,  
       
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
