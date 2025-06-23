import Occupancy from "../Occupancy/Occupany";
import Sidebar from "../../common_components/sidebar/Sidebar";
import { useState } from "react";
import DashboardCardsCharts from "../../common_components/charts/dashboard-charts/hero-section-charts/dashboard-hero-chart";
import RoomAvailabilitySectionChart from "../../common_components/charts/dashboard-charts/room-avalibility-charts/Room-avalibility-charts";
import CurrentBooking from "../../common_components/current-booking-list/Current-Booking-List";
import HotelDashboardChart from "../../common_components/charts/dashboard-charts/hotel-dashboard-chart/hotel-dashboard-chart";
import CurrentBookingListChart from "../../common_components/charts/dashboard-charts/current-booking-list-chart/Current-booking-list-chart";
import AddBooking from "../Booking/add-booking/AddBooking";
import CancelBooking from "../Booking/cancel-booking/CancelBooking";
import BookingsTable from "../Booking/all-bookings/AllBooking";

import "./Dashboard.css";
import AllRooms from "../Room/all-rooms/AllRooms";

const Dashboard = () => {
  const [selected, setSelectedSection] = useState("dashboard");
  return (
    <Sidebar setSelectedSection={setSelectedSection} selected={selected}>
      {selected == "dashboard" && <DashboardItems />}
      {selected == "occupancy" && <Occupancy />}
      {selected == "all booking" && <BookingsTable />}
      {selected == "add booking" && <AddBooking />}
      {selected == "cancel booking" && <CancelBooking />}
      {selected == "all rooms" && <AllRooms />}
    </Sidebar>
  );
};

const DashboardItems = () => {
  return (
    <>
      <div className="dashboard-container">
        <div className="d-flex flex-column gap-3">
          <DashboardCardsCharts />
          <RoomAvailabilitySectionChart />
          <CurrentBooking />
          <HotelDashboardChart />
          <CurrentBookingListChart />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
