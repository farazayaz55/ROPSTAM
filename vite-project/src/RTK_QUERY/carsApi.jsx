import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchWithRefresh } from "./refresh_interceptor";

export const CarsApi = createApi({
  reducerPath: "carsApi",
  baseQuery: fetchWithRefresh,
  tagTypes: ["Cars"],
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (body) => ({
        url: `cars/create`,
        method: "POST",
        body,
      }),
      invalidatesTags:["Cars"]
    }),
    delete: builder.mutation({
        query: (id) => ({
          url: `cars/delete/${id}`,
          method: "DELETE",
        }),
      invalidatesTags:["Cars"]
      }),
      update: builder.mutation({
        query: ({id,name,categories,color,model,registrationNumber,make}) => ({
          url: `cars/update?id=${id}&name=${name}&categories=${categories}&color=${color}&model=${model}&registrationNumber=${registrationNumber}&make=${make}`,
          method: "PATCH",
        }),
      invalidatesTags:["Cars"]
      }),  
      
      get: builder.query({
        query: () => ({
          url: `cars/getAll`,
        }),
        providesTags:["Cars"]
      }),  

      getAgainstCategory: builder.query({
        query: (id) => ({
          url: `cars/getAgainstCategory/${id}`,
        }),
        providesTags:["Cars"]
      }),  
  }),
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
    useCreateMutation,
    useDeleteMutation,
    useUpdateMutation,
    useGetQuery,
    useGetAgainstCategoryQuery,
  } = CarsApi;