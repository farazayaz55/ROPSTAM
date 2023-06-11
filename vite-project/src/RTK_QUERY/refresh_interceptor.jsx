/* eslint-disable no-undef */
import {  fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Logout, tokenRefresh } from "../Redux/userSlice";

const baseQueryAuth = fetchBaseQuery({ 
    baseUrl: "http://localhost:4000",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.accessToken; //we get the token from redux store
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  })



export const fetchWithRefresh=async(args,api,extraOptions)=>{
  console.log("fetch with ref")
    const result =await baseQueryAuth(args,api,extraOptions)
  
    if(result.error?.status===401){
      const refreshResult=await baseQueryAuth(`${process.env.REACT_APP_SERVER_URL}/refreshToken`,api,extraOptions)
      if(refreshResult.data){
        api.dispatch(tokenRefresh(refreshResult.data))
  
        const retryResult=await baseQueryAuth(args,api,extraOptions)
        return retryResult
      }
      else{
        localStorage.removeItem("persist:user")
        api.dispatch(Logout())
      }
    }
    else{
      return result
    }
  }



 


