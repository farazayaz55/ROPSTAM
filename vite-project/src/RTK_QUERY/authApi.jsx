import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchWithRefresh } from "./refresh_interceptor";

export const AuthApi = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchWithRefresh,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (body) => ({
        url: `sign-up`,
        method: "POST",
        body,
      }),
    }),
    signIn: builder.mutation({
      query: (body) => ({
        url: `sign-in`,
        method: "POST",
        body,
      }),
    }),
  }),
});

// eslint-disable-next-line react-refresh/only-export-components
export const { useSignUpMutation , useSignInMutation} = AuthApi;
