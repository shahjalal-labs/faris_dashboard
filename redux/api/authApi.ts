import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (body) => ({
        url: `/admin/login`,
        method: `POST`,
        body: body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/admin/send-otp`,
        method: `POST`,
        body: body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (body) => ({
        url: `/admin/verify-otp`,
        method: `POST`,
        body: body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/reset-password`,
          method: `PATCH`,
          body: body,
        };
      },
    }),
    createAdmin: builder.mutation({
      query: (payload) => {
        return {
          url: `/admin/create`,
          method: `POST`,
          body: payload,
        };
      },
      invalidatesTags: ["profile"],
    }),
    admins: builder.query({
      query: () => {
        return {
          url: `/admin/all`,
          method: `GET`,
        };
      },
      providesTags: ["profile"],
    }),
    admin: builder.query({
      query: (id) => {
        return {
          url: `/admin/single/${id}`,
          method: `GET`,
        };
      },
      providesTags: ["profile"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/delete/${id}`,
          method: `DELETE`,
        };
      },
      invalidatesTags: ["profile"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/admin/change-password`,
        method: `PATCH`,
        body: body,
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: `/admin/profile`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    userDetails: builder.query({
      query: (id) => ({
        url: `/admin/user-details/${id}`,
        method: "GET",
      }),
      providesTags: ["profile", "business"],
    }),
    workerDetails: builder.query({
      query: (id) => ({
        url: `/admin/worker-details/${id}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    allUsers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-users?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    topClients: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/top-clients?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    blockedUsers: builder.query({
      query: ({ role, search }) => ({
        url: `/admin/blocked-users?role=${role}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["business", "profile"],
    }),
    allWorkers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-workers?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    allPendingWorkers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-pending-workers?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: `/admin/update-profile`,
        method: `PUT`,
        body: body,
      }),
      invalidatesTags: ["profile"],
    }),
    blockUnblock: builder.mutation({
      query: (id) => ({
        url: `/admin/block-unblock-user/${id}`,
        method: `PATCH`,
      }),
      invalidatesTags: ["business"],
    }),
    acceptReject: builder.mutation({
      query: (payload) => ({
        url: `/admin/accept-reject-application`,
        method: `PUT`,
        body: payload,
      }),
      invalidatesTags: ["profile"],
    }),
    notifyUsres: builder.query({
      query: () => ({
        url: `/admin/all-notify-users`,
        method: `GET`,
      }),
      providesTags: ["profile"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: `DELETE`,
      }),
      invalidatesTags: ["business", "profile"],
    }),
  }),
});

export const {
  useBlockedUsersQuery,
  useAdminLoginMutation,
  useLazyGetMyProfileQuery,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useDeleteAdminMutation,
  useDeleteUserMutation,
  useAllUsersQuery,
  useAdminsQuery,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useAdminQuery,
  useUpdateMyProfileMutation,
  useAllPendingWorkersQuery,
  useWorkerDetailsQuery,
  useUserDetailsQuery,
  useBlockUnblockMutation,
  useAcceptRejectMutation,
  useAllWorkersQuery,
  useCreateAdminMutation,
  useTopClientsQuery,
  useNotifyUsresQuery
} = authApi;
