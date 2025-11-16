import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/chat',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.access;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // get all posts
    getRooms: builder.query({
      query: () => `/rooms/`,
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    getSingleCrop: builder.query({
      query: (id) => `/${id}`,
    }),
    // create post
    createRoom: builder.mutation({
        query: (username) => ({
          url: `/create/`,
          method: 'POST',
          body: { username }, // Ensure it's an object
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
          chatApi.util.updateQueryData(
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
          chatApi.util.updateQueryData(
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
  useGetRoomsQuery,
  useGetSingleCropQuery,
  useCreateRoomMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
  useSavedPostMutation,
  useUnSavedPostMutation,
} = chatApi;