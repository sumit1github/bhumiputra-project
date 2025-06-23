import { useEffect, useRef } from "react";
import * as Chart from "chart.js";
import { BsEye } from "react-icons/bs";

import "./hotel-dashboard-chart.css";
// Register Chart.js components
Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.PointElement,
  Chart.LineElement,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend
);

const GuestListCard = () => {
  const guests = [
    {
      id: 1,
      name: "Airi Satou",
      room: "Room:105",
      date: "13 June '20",
      time: "11:00-12:00",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 2,
      name: "Jens Brincker",
      room: "Room:302",
      date: "15 June '20",
      time: "09:30-10:30",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Angelica Ramos",
      room: "Room:507",
      date: "16 June '20",
      time: "14:00-15:00",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Cara Stevens",
      room: "Room:804",
      date: "18 June '20",
      time: "11:00-12:30",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Jacob Ryan",
      room: "Room:705",
      date: "22 June '20",
      time: "13:00-14:15",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    },
  ];

  return (
    <div className="card guest-list-card border">
      <div className="card-header">
        <h5 className="card-title">Guest List</h5>
        <button className="view-all-btn">
          <BsEye size={16} />
          View All
        </button>
      </div>
      <div className="card-body">
        {guests.map((guest) => (
          <div key={guest.id} className="guest-item">
            <div className="guest-avatar">
              <img src={guest.avatar} alt={guest.name} />
            </div>
            <div className="guest-info">
              <div className="guest-name">{guest.name}</div>
              <div className="guest-room">{guest.room}</div>
            </div>
            <div className="guest-schedule">
              <div className="guest-date">{guest.date}</div>
              <div className="guest-time">{guest.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingSourceCard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart.Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Online",
              data: [85, 120, 35, 120, 260, 100, 180],
              borderColor: "#4285f4",
              backgroundColor: "#4285f4",
              borderWidth: 3,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: false,
              tension: 0.4,
            },
            {
              label: "Offline",
              data: [95, 250, 90, 220, 80, 100, 180],
              borderColor: "#9e9e9e",
              backgroundColor: "#9e9e9e",
              borderWidth: 3,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: false,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#666",
                font: {
                  size: 12,
                },
              },
            },
            y: {
              beginAtZero: true,
              max: 300,
              grid: {
                color: "#f0f0f0",
                borderDash: [2, 2],
              },
              ticks: {
                color: "#666",
                font: {
                  size: 12,
                },
                stepSize: 50,
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="card booking-source-card border p-3">
      <div className="card-header">
        <h5 className="card-title">Booking Source</h5>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot online"></span>
            <span className="legend-text">Online</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot offline"></span>
            <span className="legend-text">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelDashboardChart = () => {
  return (
    <>
      <div className="dashboard-container-c ">
        <div className="cards-row d-flex justify-content-between align-items-center">
          <div className="card-column">
            <GuestListCard />
          </div>
          <div className="card-column">
            <BookingSourceCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDashboardChart;
