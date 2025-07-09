import { toast } from 'react-toastify';

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export const getProductList = () => {
  return useMutation({
    mutationFn: async (page) => {
      const res = await apiClient.get(`/product/get_all_products?page=${page}`);
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

// create new product
export const productCreate = () => {
  return useMutation({
    mutationFn: async (productData) => {
      const res = await apiClient.post("/product/product_create_update_delete_detail", productData);
      return res.data;
    },

  });
};


// product details page API call
export const productDetailsApiCall = () => {
  return useMutation({
    mutationFn: async (product_id) => {
      const res = await apiClient.get(`/product/product_create_update_delete_detail?pid=${product_id}`);
      return res.data;
    },

  });
};


// create update product
export const productUpdate = () => {
  return useMutation({
    mutationFn: async ({ product_id, productData }) => {
      const res = await apiClient.patch(`/product/product_create_update_delete_detail?pid=${product_id}`, productData);
      return res.data;
    },

  });
};


// user search API call
// export const UserSearchApiCall = () => {
//   return useMutation({
//     mutationFn: async ({search_by, query }) => {
//       const res = await apiClient.get(`/users/get_user_list?${search_by}=${query}`);
//       return res.data;
//     },
//   });
// };