import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userReview: builder.query({
      query: (page) => ({
        url: `/admin/all-user-reviews?page=${page}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/admin/review/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["business"],
    }),
    updateReview: builder.mutation({
      query: (payload) => ({
        url: `/admin/review/update`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["business"],
    }),
    workerReview: builder.query({
      query: (page) => ({
        url: `/admin/all-worker-reviews?page=${page}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
  }),
});

export const {
  useUserReviewQuery,
  useWorkerReviewQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} = reviewApi;
