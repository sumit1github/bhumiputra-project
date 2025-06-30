# Get

```
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get("/users");
      return res.data;
    },
  });
```

# Post

```
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser) => apiClient.post("/users", newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh user list
    },
  });
};

```

# Put/Patch

```
export const useUpdateUser = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData) =>
      apiClient.patch(`/users/${userId}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

```
# Delete

```
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => apiClient.delete(`/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

```

