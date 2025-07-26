import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export const getOrderList = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await apiClient.get(`/order/list/`);
            return res.data;
        },
    });
};

