import { baseApi } from "./baseApi";

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reasons: builder.query({
      query: (role) => ({
        url: `/admin/all-cancel-reasons?role=${role}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    createReason: builder.mutation({
      query: (payload) => ({
        url: `/admin/cancel-reason-create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
    createFaq: builder.mutation({
      query: (payload) => ({
        url: `/admin/faq-create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
    deleteReason: builder.mutation({
      query: (id) => ({
        url: `/admin/cancel-reason/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/admin/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
    updateFaq: builder.mutation({
      query: (payload) => ({
        url: `/admin/faq/update`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
    feedbacks: builder.query({
      query: () => ({
        url: `/admin/feedbacks`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    faqs: builder.query({
      query: () => ({
        url: `/admin/all-faqs`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    faq: builder.query({
      query: (id) => ({
        url: `/admin/faq/${id}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    onboarding: builder.query({
      query: () => ({
        url: `/feedback/onboarding`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    dashboardNotify: builder.query({
      query: () => ({
        url: `/admin/all-notify`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    deleteNotify: builder.mutation({
      query: (id) => ({
        url: `/admin/notify/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
    deleteAllNotify: builder.mutation({
      query: () => ({
        url: `/admin/all-notify`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
    updateOnboarding: builder.mutation({
      query: (payload) => ({
        url: `/feedback/onboarding`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/feedback/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
    sendNotification: builder.mutation({
      query: (payload) => ({
        url: `/admin/send-notification`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/admin/notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
    updatePrivay: builder.mutation({
      query: (body) => ({
        url: `/admin/create-privacy-policy`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["content"],
    }),
    updateWelcome: builder.mutation({
      query: (body) => ({
        url: `/admin/welcome-message`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["content"],
    }),
    getAllPrivacyPolicy: builder.query({
      query: (key) => ({
        url: `/admin/privacy-policy?key=${key}`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    currentFormula: builder.query({
      query: (key) => ({
        url: `/admin/formula`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    updateFormula: builder.mutation({
      query: (payload) => ({
        url: `/admin/formula`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["content"],
    }),
    getNotifyOptions: builder.query({
      query: (key) => ({
        url: `/admin/notify-options`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    updateNotifyOptions: builder.mutation({
      query: (payload) => ({
        url: `/admin/notify-options`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["content"],
    }),
    getWelcome: builder.query({
      query: (key) => ({
        url: `/admin/welcome-message?key=${key}`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    allNotification: builder.query({
      query: () => ({
        url: `/admin/all-notifications`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    responseWorkerReport: builder.mutation({
      query: (payload) => ({
        url: `/admin/response-worker-report`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
  }),
});

export const {
  useReasonsQuery,
  useDeleteAllNotifyMutation,
  useDeleteNotifyMutation,
  useUpdateWelcomeMutation,
  useGetWelcomeQuery,
  useAllNotificationQuery,
  useCreateReasonMutation,
  useDeleteNotificationMutation,
  useFeedbacksQuery,
  useDeleteFeedbackMutation,
  useResponseWorkerReportMutation,
  useDeleteReasonMutation,
  useFaqsQuery,
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useOnboardingQuery,
  useUpdateOnboardingMutation,
  useGetAllPrivacyPolicyQuery,
  useUpdatePrivayMutation,
  useSendNotificationMutation,
  useGetNotifyOptionsQuery,
  useUpdateNotifyOptionsMutation,
  useDashboardNotifyQuery,
  useCurrentFormulaQuery,
  useUpdateFormulaMutation,
  useFaqQuery,
  useUpdateFaqMutation,
} = contentApi;
