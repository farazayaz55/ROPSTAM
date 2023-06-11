import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import userReducer from "./userSlice";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {AuthApi} from "../RTK_QUERY/authApi"
import {CategoryApi} from "../RTK_QUERY/categoriesApi"
import {CarsApi} from "../RTK_QUERY/carsApi"
const composedEnhancers = composeWithDevTools();

const persistConfig = {
  key: "user",
  storage,
};



const persistedReducer = persistReducer(persistConfig, userReducer); //instead of reducer we will use this so that userReducer is not gone on page refresh

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    //for rtk query
    [AuthApi.reducerPath]:AuthApi.reducer,
    [CategoryApi.reducerPath]:CategoryApi.reducer,
    [CarsApi.reducerPath]:CarsApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApi.middleware,
      CategoryApi.middleware,
      CarsApi.middleware
    ),
  composedEnhancers,
});

export const persistor = persistStore(store); //that's the store whose value will be persisted

setupListeners(store.dispatch);
