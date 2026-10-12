import { baseApi } from "./baseApi";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOffers: builder.query({
      query: ({ page, search, region, city, category }) => ({
        url: `/admin/all-offers?page=${page}&search=${search}&region=${region}&city=${city}&category=${category}`,
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    offerDetails: builder.query({
      query: ({ id }) => ({
        url: `/admin/offer-details/${id}`,
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    offerDetailsForEdit: builder.query({
      query: (id) => ({
        url: `/offer/details-for-admin/${id}`,
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["offers", "business"],
    }),
    addOffer: builder.mutation({
      query: (payload) => ({
        url: `/offer/create/by-admin`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["offers", "business"],
    }),
    updateOffer: builder.mutation({
      query: (payload) => ({
        url: `/offer/create`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["offers", "business"],
    }),
    acceptRejectOffer: builder.mutation({
      query: (payload) => ({
        url: `/admin/accept-reject-offer`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["offers", "business"],
    }),
  }),
});

export const {
  useAllOffersQuery,
  useDeleteOfferMutation,
  useAcceptRejectOfferMutation,
  useOfferDetailsQuery,
  useAddOfferMutation,
  useOfferDetailsForEditQuery,
  useUpdateOfferMutation,
} = offerApi;
