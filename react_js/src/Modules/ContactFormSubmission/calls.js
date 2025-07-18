import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

// get all contacts
export const getAllContacts = () => {
    return useMutation({
        mutationFn: async (filter) => {
            const res = await apiClient.get(`/api/contact/?filter=${filter}`);
            return res.data;
        },
    });
};

// Mark as resolve
export const markResolve = () => {
    return useMutation({
        mutationFn: async (cid) => {
            const res = await apiClient.patch(`/api/contact/?cid=${cid}`);
            return res.data;
        },
    });
};