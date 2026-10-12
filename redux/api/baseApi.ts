import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { JWTDecodeToken } from "@/lib/jwtDecode";

const baseUrl = "https://api.shaara.center/api/v1";
// const baseUrl = "http://72.61.94.49:4015/api/v1";
// const baseUrl = "http://localhost:4015/api/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      // const token = state?.auth?.token;
      // console.log(token);

     const {token} = JWTDecodeToken()

      headers.set(
        "Authorization",
        `${token}`
      );

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "profile",
    "report",
    "services",
    "offers",
    "report",
    "user",
    "withdraw",
    "admin",
    "content",
    "bookings",
    "review",
    "business",
    "subscription",
  ],
});
