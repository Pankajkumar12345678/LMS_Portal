import { create } from "zustand";
import axios from "axios";
import { userLoggedIn, userLoggedOut } from "../features/authSlice";
// const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8084/api/auth" : "/api/auth";
const API_URL ="http://localhost:8084/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password, dispatch) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});		
			dispatch(userLoggedIn({user: response.data.user}));
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async (dispatch) => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false, message:"isSuccess" });
			dispatch(userLoggedOut());
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error checking authentication", isCheckingAuth: false, isAuthenticated: false });
        }
    },
    
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

	loadUser: async()=>{
        set({ isCheckingAuth: true, error: null });
		try {
            const response = await axios.get(`${API_URL}/profile`);
            set({ user: response.data.user, isAuthenticated: true,isCheckingAuth: false, });
			 //dispatch(userLoggedIn({ user: response.data.user }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error loading user", isAuthenticated: false ,isCheckingAuth: false });
        }
	},

	updateUser: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/profile/update`, formData);
			// console.log("response.data.user",response.data.user)
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, message:"updateisSuccess" });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error updating profile", isAuthenticated: false, isLoading: false, message:"updateisFailed" });
            throw error;
        }
    },

}));