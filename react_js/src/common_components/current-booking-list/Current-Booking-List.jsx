import React from "react";
import { Card, Table, Image, Button } from "react-bootstrap";

import "./Current-booking-list.css";

const bookings = [
  {
    roomNo: 501,
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    checkIn: "10/01/2023",
    checkOut: "10/05/2023",
    mobile: "1234567890",
    status: "Booked",
  },
  {
    roomNo: 502,
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    checkIn: "10/02/2023",
    checkOut: "10/06/2023",
    mobile: "0987654321",
    status: "Booked",
  },
  {
    roomNo: 503,
    name: "Alice Johnson",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    checkIn: "10/03/2023",
    checkOut: "10/07/2023",
    mobile: "5551234567",
    status: "CheckOut",
  },
  {
    roomNo: 504,
    name: "Bob Brown",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    checkIn: "10/04/2023",
    checkOut: "10/08/2023",
    mobile: "4449876543",
    status: "Booked",
  },
  {
    roomNo: 505,
    name: "Charlie Davis",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    checkIn: "10/05/2023",
    checkOut: "10/09/2023",
    mobile: "7776543210",
    status: "CheckIn",
  },
  {
    roomNo: 506,
    name: "Eve Wilson",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    checkIn: "10/06/2023",
    checkOut: "10/10/2023",
    mobile: "8887654321",
    status: "Cancelled",
  },
  {
    roomNo: 507,
    name: "David Clark",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    checkIn: "10/07/2023",
    checkOut: "10/11/2023",
    mobile: "3332221111",
    status: "Booked",
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Booked":
      return "status-booked";
    case "CheckIn":
      return "status-checkin";
    case "CheckOut":
      return "status-checkout";
    case "Cancelled":
      return "status-cancelled";
    default:
      return "";
  }
};

const CurrentBooking = () => {
  return (
    <Card className="current-booking-card border p-2">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">Current Booking</Card.Title>
          <a href="#" className="view-all-link">
            View All
          </a>
        </div>
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Name</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr key={index}>
                <td>{b.roomNo}</td>
                <td className="d-flex align-items-center gap-2">
                  <Image src={b.avatar} roundedCircle width={35} height={35} />
                  {b.name}
                </td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>
                  <i className="bi bi-telephone-fill me-1 text-success" />
                  {b.mobile}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(b.status)}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <Button variant="light" size="sm">
                    <i className="bi bi-three-dots" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CurrentBooking;
