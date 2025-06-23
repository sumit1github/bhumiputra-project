import { useEffect, useRef } from "react";
import * as Chart from "chart.js";
import { FaRegEye } from "react-icons/fa";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";

import "./Current-booking-list-chart.css";

// Register Chart.js components
Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.BarElement,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend
);

const CustomerReviewCard = () => {
  const reviews = [
    {
      id: 1,
      name: "Alis Smith",
      avatar: "/person-images/person-img-2.jpg",
      rating: 3.5,
      timeAgo: "a week ago",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel rutrum ex, at ornare mi. In quis scelerisque dui, eget rhoncus orci. Fusce et sodales ipsum. Nam id nunc euismod, aliquet arcu quis, mattis nisl.",
    },
    {
      id: 2,
      name: "John Dio",
      avatar: "/person-images/person-img.png",
      rating: 3,
      timeAgo: "a week ago",
      review:
        "Nam quis ligula est. Nunc sed risus non turpis tristique tempor. Ut sollicitudin faucibus magna nec gravida. Suspendisse ullamcorper justo vel porta imperdiet. Nunc nec ipsum vel augue placerat faucibus.",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="star half">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="card customer-review-card">
      <div className="card-header">
        <h5 className="card-title">Customer Review</h5>
        <button className="view-all-btn">
          <FaRegEye size={16} />
          View All
        </button>
      </div>
      <div className="card-body">
        {reviews.map((review, index) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  <img src={review.avatar} alt={review.name} />
                </div>
                <div className="reviewer-details">
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <div className="review-time">{review.timeAgo}</div>
            </div>
            <div className="review-text">{review.review}</div>
            <div className="review-actions">
              <button className="action-btn like-btn">
                <HiThumbUp size={16} />
              </button>
              <button className="action-btn dislike-btn">
                <HiThumbDown size={16} />
              </button>
            </div>
            {index < reviews.length - 1 && (
              <div className="review-divider"></div>
            )}
          </div>
        ))}
        <div className="view-all-reviews">
          <button className="view-all-reviews-btn">
            View all Customer Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

const VisitorsChartCard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart.Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              data: [24, 48, 28, 29, 40, 22, 30],
              backgroundColor: "#8b5cf6",
              borderRadius: 4,
              borderSkipped: false,
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
              backgroundColor: "#333",
              titleColor: "#fff",
              bodyColor: "#fff",
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                title: function (context) {
                  return context[0].label;
                },
                label: function (context) {
                  return `${context.parsed.y} visitors`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#9ca3af",
                font: {
                  size: 12,
                },
              },
            },
            y: {
              beginAtZero: true,
              max: 50,
              grid: {
                color: "#f3f4f6",
                borderDash: [2, 2],
              },
              ticks: {
                color: "#9ca3af",
                font: {
                  size: 12,
                },
                stepSize: 10,
              },
            },
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
    <div className="card visitors-chart-card">
      <div className="card-header">
        <h5 className="card-title">Visitors Chart</h5>
      </div>
      <div className="card-body">
        <div className="visitors-stats">
          <div className="stats-title">Average Daily Users</div>
          <div className="stats-number">
            1,258 <span className="stats-label">Visitors</span>
            <span className="stats-average">(Average)</span>
          </div>
        </div>
        <div className="chart-container visitors-chart">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

const CurrentBookingListChart = () => {
  return (
    <>
      <div className="dashboard-container">
        <div className="cards-row">
          <div className="card-column">
            <CustomerReviewCard />
          </div>
          <div className="card-column">
            <VisitorsChartCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentBookingListChart;
