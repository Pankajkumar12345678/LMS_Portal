// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/authSlice"; 
// export const appStore=configureStore({
//     reducer:{
//         auth:authReducer,

//     }
// })


import { configureStore } from "@reduxjs/toolkit"
import rootRedcuer from "./rootRedcuer";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware: (defaultMiddleware) => defaultMiddleware().concat(courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
});

// const initializeApp = async () => {
//     await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
// }
// initializeApp();