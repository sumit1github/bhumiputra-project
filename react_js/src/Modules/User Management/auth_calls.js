import { toast } from 'react-toastify';

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export const getUserList = () => {
  return useMutation({
    mutationFn: async (page) => {
      const res = await apiClient.get(`/users/get_user_list?page=${page}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        return;
      }
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
};

// invite new user by admin
export const InviteUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const res = await apiClient.post("/users/invite_user", userData);
      return res.data;
    },

  });
};

// get user details
export const UserDetailsApiCall = () => {
  return useMutation({
    mutationFn: async (user_id) => {
      const res = await apiClient.get(`/users/detail_update_user/${user_id}`);
      return res.data;
    },
  });
};

// user details post request
export const UserUpdateApiCall = () => {
  return useMutation({
    mutationFn: async ({ user_id, formData }) => {
      const res = await apiClient.post(`/users/detail_update_user/${user_id}`, formData);
      return res.data;
    },
  });
};

// user search API call
export const UserSearchApiCall = () => {
  return useMutation({
    mutationFn: async ({ search_by, query }) => {
      console.log("Search By:", search_by);
      console.log("Query:", query);
      const res = await apiClient.get(`/users/get_user_list?${search_by}=${query}`);
      return res.data;
    },
  });
};

// get direct users of the user
export const GetDirectUsersApiCall = () => {
  return useMutation({
    mutationFn: async (user_prefix_id) => {
      const res = await apiClient.get(`users/team/${user_prefix_id}`);
      return res.data;
    },
  });
};