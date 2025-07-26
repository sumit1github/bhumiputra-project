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

export const placeOrder = () => {
    return useMutation({
        mutationFn: async (order_data) => {
            const res = await apiClient.post("/order/create/", order_data);
            return res.data;
        },

    });
};

export const getJoiningPackageList = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await apiClient.get(`/product/get_joining_packages`);
            return res.data;
        },
    });
};

export const distributePackage = () => {
    return useMutation({
        mutationFn: async (package_data) => {
            const res = await apiClient.post("/order/distribute_joining_package/", package_data);
            return res.data;
        },
    });
};