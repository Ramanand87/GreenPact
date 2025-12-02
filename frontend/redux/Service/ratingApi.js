import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ratingApi = createApi({
  reducerPath: 'ratingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ratings`,
    
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Rating'], // Define tag type
  endpoints: (builder) => ({
    getRating: builder.query({
      query: (username) => `/${username}`, // Fetch ratings by username
      providesTags: (result, error, username) => [{ type: 'Rating', id: username }],
    }),
    createRating: builder.mutation({
      query: ({ ratingData }) => ({
        url: `/`,
        method: 'POST',
        body: ratingData,
      }),
      invalidatesTags: ['Rating'], // Invalidate rating cache
    }),
    updateRating: builder.mutation({
      query: ({ ratingId, updatedRatingData }) => ({
        url: `/update/${ratingId}/`,
        method: 'PUT',
        body: updatedRatingData, // updatedRatingData is already FormData
      }),
      invalidatesTags: (result, error, { ratingId }) => [{ type: 'Rating', id: ratingId }],
    }),
    deleteRating: builder.mutation({
        query: (ratingId) => ({
          url: `/delete/${ratingId}/`, // Delete a rating
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, ratingId) => [{ type: 'Rating', id: ratingId }],  // ✅ Invalidate specific rating
      }),
    deleteRatingImage: builder.mutation({
      query: (imageId) => ({
        url: `/update/image/${imageId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rating'],
    }),
    addRatingImage: builder.mutation({
      query: (imageData) => ({
        url: `/update/image/`,
        method: 'POST',
        body: imageData,
      }),
      invalidatesTags: ['Rating'],
    }),
  }),
});

export const {
  useGetRatingQuery,
  useCreateRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useDeleteRatingImageMutation,
  useAddRatingImageMutation,
} = ratingApi;