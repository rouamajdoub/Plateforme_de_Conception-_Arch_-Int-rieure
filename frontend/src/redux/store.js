// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import architectReducer from "./slices/architectSlice";
import marketplaceReducer from "./slices/marketplaceSlice";
import projectReducer from "./slices/ProjectSlice";
import eventReducer from "./slices/eventSlice";
import clientsReducer from "./slices/clientsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    architect: architectReducer,
    marketplace: marketplaceReducer,
    projects: projectReducer,
    events: eventReducer,
    clients: clientsReducer,
  },
});

export default store;
