import React from "react";
import { Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import "./Room-avalibility-chart.css";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RoomAvailabilitySection = () => {
  return (
    <Card className="dashboard-section-card pt-3 px-3 shadow-sm border">
      <Card.Body>
        <div className="reservation-header  border-bottom p-1 d-flex justify-content-between align-items-center">
          <h5 className="reservation-title">Room Avalibility</h5>
        </div>
        {/* Progress Bar */}
        <div className="room-progress-container">
          <div className="room-progress-bar">
            <div className="progress-segment progress-occupied">125</div>
            <div className="progress-segment progress-reserved">87</div>
            <div className="progress-segment progress-available">57</div>
            <div className="progress-segment progress-not-ready">25</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row p-2">
          <div className="col-6 mb-3">
            <div className="room-stat-item">
              <div className="room-stat-indicator indicator-occupied"></div>
              <div>
                <div className="room-stat-label">Occupied</div>
                <div className="room-stat-number">125</div>
              </div>
            </div>
          </div>

          <div className="col-6 mb-3">
            <div className="room-stat-item">
              <div className="room-stat-indicator indicator-reserved"></div>
              <div>
                <div className="room-stat-label">Reserved</div>
                <div className="room-stat-number">87</div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="room-stat-item">
              <div className="room-stat-indicator indicator-available"></div>
              <div>
                <div className="room-stat-label">Available</div>
                <div className="room-stat-number">57</div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="room-stat-item">
              <div className="room-stat-indicator indicator-not-ready"></div>
              <div>
                <div className="room-stat-label">Not Ready</div>
                <div className="room-stat-number">25</div>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const ReservationSection = () => {
  // Stacked Bar Chart Data
  const reservationData = {
    labels: [
      "01 Jan",
      "02 Jan",
      "03 Jan",
      "04 Jan",
      "05 Jan",
      "06 Jan",
      "07 Jan",
      "08 Jan",
    ],
    datasets: [
      {
        label: "Booked",
        data: [44, 55, 41, 67, 22, 43, 55, 64],
        backgroundColor: "#6c63ff",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 4,
          bottomRight: 4,
        },
        borderSkipped: false,
      },
      {
        label: "Canceled",
        data: [13, 23, 20, 18, 13, 27, 12, 9],
        backgroundColor: "#ffa726",
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  };

  const reservationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          afterLabel: function (context) {
            const dataIndex = context.dataIndex;
            const booked = reservationData.datasets[0].data[dataIndex];
            const canceled = reservationData.datasets[1].data[dataIndex];
            const total = booked + canceled;
            return `Total: ${total}`;
          },
        },
      },
      // ✅ Moved custom plugin here
      dataLabels: {
        id: "dataLabels",
        afterDatasetsDraw: function (chart) {
          const ctx = chart.ctx;
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((bar, index) => {
              const data = dataset.data[index];
              if (data > 0) {
                ctx.fillStyle = "white";
                ctx.font = "bold 11px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(data, bar.x, bar.y);
              }
            });
          });
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#999",
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        grid: {
          color: "#f0f0f0",
        },
        ticks: {
          stepSize: 20,
          font: {
            size: 11,
          },
          color: "#999",
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };

  return (
    <Card className="dashboard-section-card p-3 shadow-sm mb-4 border">
      <Card.Body>
        <div className="reservation-header  border-bottom p-1 d-flex justify-content-between align-items-center">
          <h5 className="reservation-title">Reservation</h5>
          {/* <div className="settings-icon">⚙️</div> */}
        </div>

        <div className="chart-container">
          <Bar data={reservationData} options={reservationOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

const RoomAvailabilitySectionChart = () => {
  return (
    <div className="row ">
      <div className="col-lg-5">
        <RoomAvailabilitySection />
      </div>
      <div className="col-lg-7 ">
        <ReservationSection />
      </div>
    </div>
  );
};

export default RoomAvailabilitySectionChart;
