//slice to handle the  user state in our app
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: "NoLogin",
    isLoggedIn: false,
    accessToken: "Nothing",
  },
  reducers: {
    Login: (state, action) => {
      //assign the user update whether they are admin ,logged in etc and what's their access token
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
    },

    Logout:(state)=>{
      state.user="NoLogin",
      state.isLoggedIn=false,
      state.accessToken="Nothing",
      state.refreshToken="Nothing"
    },
    tokenRefresh:(state,action)=>{
      state.accessToken=action.payload.accessToken
    }
  },
});

export const { Login, changeImage,Logout,tokenRefresh } = userSlice.actions;
export default userSlice.reducer;
