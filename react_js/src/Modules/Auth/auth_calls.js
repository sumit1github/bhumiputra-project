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

      if (data.status != 200){
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
