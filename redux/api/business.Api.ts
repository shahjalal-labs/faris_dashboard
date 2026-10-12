import { baseApi } from "./baseApi";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allBusiness: builder.query({
      query: ({ page, search, city, region, category, isRecent }) => ({
        url: `/admin/all-businesses?page=${page}&search=${search}&city=${city}&region=${region}&category=${category}&isRecent=${isRecent}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    verifyBusiness: builder.mutation({
      query: (payload) => ({
        url: `/admin/business-verify`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["business"],
    }),
    businessProfile: builder.query({
      query: (id) => ({
        url: `/admin/business/${id}`,
        method: "GET",
      }),
      providesTags: ["business", "services"],
    }),
    businessWallet: builder.query({
      query: (id) => ({
        url: `/admin/business-completed-bookings/${id}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    topBusiness: builder.query({
      query: ({ page, search, isTopRated }) => ({
        url: `/admin/top-rated-businesses?page=${page}&search=${search}&isTopRated=${isTopRated}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    businessEarnings: builder.query({
      query: () => ({
        url: `/admin/business-earnings`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    businessEarningsSummary: builder.query({
      query: (type) => ({
        url: `/admin/earnings-summary?type=${type}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    businessPerformanceSummary: builder.query({
      query: (type) => ({
        url: `/admin/performance-summary?type=${type}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    dashboardOverview: builder.query({
      query: () => ({
        url: `/admin/dashboard-overview`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    businessOverview: builder.query({
      query: (type) => ({
        url: `/admin/business-overview?type=${type}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    userOverview: builder.query({
      query: (type) => ({
        url: `/admin/user-overview?type=${type}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    userProfile: builder.query({
      query: (id) => ({
        url: `/admin/user-details/${id}`,
        method: "GET",
      }),
      providesTags: ["business"],
    }),
    updateBusiness: builder.mutation({
      query: (payload) => ({
        url: `/admin/update-business`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["business"],
    }),
  }),
});

export const {
  useBusinessEarningsQuery,
  useBusinessPerformanceSummaryQuery,
  useBusinessOverviewQuery,
  useUserOverviewQuery,
  useAllBusinessQuery,
  useTopBusinessQuery,
  useVerifyBusinessMutation,
  useUserProfileQuery,
  useBusinessProfileQuery,
  useBusinessEarningsSummaryQuery,
  useDashboardOverviewQuery,
  useBusinessWalletQuery,
  useUpdateBusinessMutation,
} = businessApi;
