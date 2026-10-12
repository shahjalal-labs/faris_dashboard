import { baseApi } from "./baseApi";

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allServices: builder.query({
      query: ({ page, search, region, city, category }) => ({
        url: `/admin/all-services?page=${page}&search=${search}&region=${region}&city=${city}&category=${category}`,
        method: "GET",
      }),
      providesTags: ["services"],
    }),
    serviceDetails: builder.query({
      query: (id) => ({
        url: `/admin/service-details/${id}`,
        method: "GET",
      }),
      providesTags: ["services"],
    }),
    serviceDetailsForEdit: builder.query({
      query: (id) => ({
        url: `/service/details/${id}`,
        method: "GET",
      }),
      providesTags: ["services"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["services", "business"],
    }),
    addService: builder.mutation({
      query: (payload) => ({
        url: `/service/create/by-admin`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["services"],
    }),
    updateService: builder.mutation({
      query: (payload) => ({
        url: `/service/update`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["services", "business"],
    }),
    mostRequested: builder.query({
      query: ({ page, limit, search, city, region, category }) => ({
        url: `/admin/most-requested-services?page=${page}&limit=${limit}&search=${search}&city=${city}&region=${region}&category=${category}`,
        method: "GET",
      }),
      providesTags: ["services"],
    }),
  }),
});

export const {
  useAllServicesQuery,
  useServiceDetailsQuery,
  useDeleteServiceMutation,
  useAddServiceMutation,
  useMostRequestedQuery,
  useServiceDetailsForEditQuery,
  useUpdateServiceMutation,
} = servicesApi;
