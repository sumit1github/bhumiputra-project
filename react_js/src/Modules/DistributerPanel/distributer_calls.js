import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export const getProductList = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await apiClient.get(`/product/get_all_products`);
            return res.data;
        },
    });
};

export const searchUser = () => {
    return useMutation({
        mutationFn: async (user_search_data) => {
            const res = await apiClient.post("/users/user_cache_search", user_search_data);
            return res.data;
        },

    });
};