import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/crops/detail`,
    
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.access;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // get all posts
    getAllCrops: builder.query({
      query: () => `/`,
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    getSingleCrop: builder.query({
      query: (id) => `/${id}`,
    }),
    // create post
    createPost: builder.mutation({
      query: (newPost) => ({
        url: `/`,
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/allposts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    likePost: builder.mutation({
      query: (id) => ({
        url: `/likes/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          marketApi.util.updateQueryData(
            'getAllPosts',
            undefined,
            (draftPosts) => {
              const postToUpdate = draftPosts.find((post) => post.id === id);
              if (postToUpdate) {
                postToUpdate.Liked = true; // Update the property name as per your post object structure
                postToUpdate.likes += 1;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),

    dislikePost: builder.mutation({
      query: (id) => ({
        url: `/likes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    savedPost: builder.mutation({
      query: (id) => ({
        url: `/bookmark/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          marketApi.util.updateQueryData(
            'getAllPosts',
            undefined,
            (draftPosts) => {
              const postToUpdate = draftPosts.find((post) => post.id === id);
              if (postToUpdate) {
                postToUpdate.bookmark = true; // Update the property name as per your post object structure
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),

    unSavedPost: builder.mutation({
      query: (id) => ({
        url: `/bookmark/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllCropsQuery,
  useGetSingleCropQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
  useSavedPostMutation,
  useUnSavedPostMutation,
} = marketApi;