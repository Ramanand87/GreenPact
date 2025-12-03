import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/crops/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Crop"],
  endpoints: (builder) => ({
    getCrops: builder.query({
      query: (username) => `detail/curr/${username}`,
      providesTags: ["Crop"],
    }),
    getAllCrops: builder.query({
      query: () => "detail/",
      providesTags: ["Crop"],
    }),
    getMarketPrice: builder.query({
      query: (crop_name) => `prices/commodity/${crop_name}`,
      providesTags: ["Crop"],
    }),
    addCrop: builder.mutation({
      query: (newCrop) => ({
        url: "detail/",
        method: "POST",
        body: newCrop,
      }),
      invalidatesTags: ["Crop"],
    }),
    updateCrop: builder.mutation({
      query: ({ id, body }) => ({
        url: `detail/${id}`,
        method: "PATCH",
        body: body,
        // Do not set Content-Type header manually
      }),
      invalidatesTags: ["Crop"],
    }),
    deleteCrop: builder.mutation({
      query: (id) => ({
        url: `detail/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Crop"],
    }),
  }),
});

export const {
  useGetCropsQuery,
  useGetMarketPriceQuery,
  useAddCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
  useGetAllCropsQuery,
} = cropApi;
