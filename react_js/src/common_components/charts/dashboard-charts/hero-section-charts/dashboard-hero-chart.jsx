import React from "react";
import { Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import { BsArrowDownCircleFill, BsArrowUpCircleFill } from "react-icons/bs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCardsCharts = () => {
  // Bar Chart Data
  const barData = {
    labels: ["", "", "", "", "", "", "", ""],
    datasets: [
      {
        data: [40, 60, 80, 50, 70, 90, 20, 60],
        backgroundColor: "#ff914d",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: true,
        max: 100,
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };

  // Donut Chart Data
  const donutData = {
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: ["#ffb74d", "#ff7043", "#43a047", "#00695c"],
        borderWidth: 0,
        cutout: "60%",
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  // Line Chart Data
  const lineData = {
    labels: ["", "", "", "", "", ""],
    datasets: [
      {
        data: [25, 20, 15, 25, 22, 30],
        borderColor: "#4db6ac",
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  // Pie Chart Data
  const pieData = {
    datasets: [
      {
        data: [25, 25, 25, 25],
        backgroundColor: ["#f44336", "#ffc107", "#4caf50", "#9e9e9e"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="d-flex dashboard-c flex-wrap gap-3">
      <Card className="dashboard-card border p-3 p-b shadow-sm">
        <Card.Body className="">
          <Card.Title className="text-muted mb-1">New Booking</Card.Title>
          <h3 className="fw-bold">1,879</h3>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center text-success fw-semibold mb-2">
              <BsArrowUpCircleFill className="me-1" /> +7.5%
            </div>
            <div style={{ width: "80px", height: "60px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="dashboard-card border p-3 p-b shadow-sm">
        <Card.Body className="">
          <Card.Title className="text-muted mb-1">Available Rooms</Card.Title>
          <h3 className="fw-bold">55</h3>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center text-danger fw-semibold mb-2">
              <BsArrowDownCircleFill className="me-1" /> -5.7%
            </div>
            <div style={{ width: "60px", height: "60px" }}>
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="dashboard-card border p-3 p-b shadow-sm">
        <Card.Body className="">
          <Card.Title className="text-muted mb-1">Revenue</Card.Title>
          <h3 className="fw-bold">$2,287</h3>
          <div className="d-flex align-items-center justify-content-between p-1">
            <div className="d-flex align-items-center text-success fw-semibold mb-2">
              <BsArrowUpCircleFill className="me-1" /> +5.3%
            </div>
            <div style={{ width: "80px", height: "50px" }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="dashboard-card border p-3 p-b shadow-sm">
        <Card.Body className="">
          <Card.Title className="text-muted mb-1">Checkout</Card.Title>
          <h3 className="fw-bold">567</h3>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center text-danger fw-semibold mb-2">
              <BsArrowDownCircleFill className="me-1" /> -2.4%
            </div>
            <div style={{ width: "60px", height: "60px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardCardsCharts;
