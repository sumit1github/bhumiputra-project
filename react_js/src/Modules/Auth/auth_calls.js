import { toast } from 'react-toastify';

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await apiClient.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access_token);

      if (data.status != 200) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error("Something went wrong during login. Please try again.");
    },
  });
};


// logout user`
export const logOut = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.get("/auth/logout");
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        toast.error("Logout failed. Please try again.");
        return;
      }
      localStorage.removeItem("accessToken");
      toast.success("Logout successful!");
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error("Something went wrong during logout. Please try again.");
    }

  });
};


// http://localhost:8000/auth/logout