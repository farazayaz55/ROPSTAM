import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchWithRefresh } from "./refresh_interceptor";

export const CategoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchWithRefresh,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (body) => ({
        url: `categories/create`,
        method: "POST",
        body,
      }),
      invalidatesTags:["Category"]
    }),
    delete: builder.mutation({
        query: (id) => ({
          url: `categories/delete/${id}`,
          method: "DELETE",
        }),
      invalidatesTags:["Category"]
      }),
      update: builder.mutation({
        query: ({id,name}) => ({
          url: `categories/update?id=${id}&name=${name}`,
          method: "PATCH",
        }),
      invalidatesTags:["Category"]
      }),  
      
      get: builder.query({
        query: () => ({
          url: `categories/getAll`,
        }),
        providesTags:["Category"]
      }),  
  }),
});

// eslint-disable-next-line react-refresh/only-export-components
export const { useCreateMutation,useGetQuery,useDeleteMutation,useUpdateMutation} = CategoryApi;
