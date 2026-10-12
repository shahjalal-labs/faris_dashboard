import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allbookings: builder.query({
      query: ({ page, limit, search, region, city, category, status }) => ({
        url: `/admin/all-bookings?page=${page}&limit=${limit}&search=${search}&region=${region}&city=${city}&category=${category}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),
    acceptRejectBooking: builder.mutation({
      query: (payload) => ({
        url: `/booking/accept-or-reject`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["profile", "business"],
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/booking/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["profile", "business", "bookings"],
    }),
  }),
});

export const { useAllbookingsQuery, useAcceptRejectBookingMutation, useDeleteBookingMutation } =
  bookingApi;
