import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Cookies from "js-cookie";

interface AuthState {
    token: string | null;
}

const initialState: AuthState = {
    token: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = null;
            Cookies.remove("token");
        }
    }
});

export const { setUserToken, logout } = authSlice.actions;
export default authSlice.reducer;
export const useAuth = (state: RootState) => state.auth;