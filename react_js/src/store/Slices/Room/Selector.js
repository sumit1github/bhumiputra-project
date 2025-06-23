import { createSelector } from "@reduxjs/toolkit";

export const selectFilteredRooms = createSelector(
  [(state) => state.room.rooms, (state) => state.room.filters],
  (rooms, filters) => {
    return rooms.filter((room) => {
      const typeMatch = filters.type === "all" || room.type === filters.type;
      const bedMatch =
        filters.bedType === "all" || room.bedType === filters.bedType;
      const statusMatch =
        filters.status === "all" || room.status === filters.status;

      return typeMatch && bedMatch && statusMatch;
    });
  }
);
