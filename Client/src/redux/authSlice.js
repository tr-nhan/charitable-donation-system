import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { checkLoginStatus } from "../services/api/authApi";

export const fetchLoginStatus = createAsyncThunk("auth/checkLogin", async () => {
    const res = await checkLoginStatus();

    if (res.error !== 0) throw new Error(res.message);

    return res.results;
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: { user_id: "", email: "" },
        status: "idle",
        error: null,
        isLoggedIn: false
    },
    reducers: {
        logout: (state) => {
            // state.user = null;
            state.isLoggedIn = false;
        },
        login: (state, action) => {            
            state.status = "succeeded";
            state.user = action.payload;
            state.isLoggedIn = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoginStatus.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchLoginStatus.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(fetchLoginStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
