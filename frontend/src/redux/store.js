// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import architectReducer from "./slices/architectSlice";
import marketplaceReducer from "./slices/marketplaceSlice";
import projectReducer from "./slices/ProjectSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    architect: architectReducer,
    marketplace: marketplaceReducer,
    projects: projectReducer,
  },
});

export default store;
