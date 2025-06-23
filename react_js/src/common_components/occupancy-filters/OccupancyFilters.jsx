import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilter, resetFilters } from "../../store/Slices/Room/RoomSlice";

import "./Occupancy-filters.css";
const OccupancyFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.room.filters);
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <>
      <div className="occupancy-container my-3 mt-0 p-3 ">
        <div className="occupancy-header">
          <h1 className="occupancy-title">Occupancy</h1>
          <div className="breadcrumb">
            <span className="breadcrumb-home">🏠</span>
            <span className="breadcrumb-separator">•</span>
            <span className="breadcrumb-current">Occupancy</span>
          </div>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <div className="select-wrapper">
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Room Type:</label>
            <div className="select-wrapper">
              <select
                className="filter-select"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Super Deluxe">Super Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Bed Size:</label>
            <div className="select-wrapper">
              <select
                className="filter-select"
                value={filters.bedType}
                onChange={(e) => handleFilterChange("bedType", e.target.value)}
              >
                <option value="all">All Bed Types</option>
                <option value="Single Bed">Single Bed</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Queen Bed">Queen Bed</option>
                <option value="King Bed">King Bed</option>
                <option value="King Bed + Sofa">King Bed + Sofa</option>
                <option value="King Bed + Living Area">
                  King Bed + Living Area
                </option>
                <option value="Twin Beds">Twin Beds</option>
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>

          <button className="clear-button" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
};

export default OccupancyFilters;
