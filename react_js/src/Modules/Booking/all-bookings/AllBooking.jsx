import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Modal,
  Badge,
  InputGroup,
  Dropdown,
  Card,
  Collapse,
} from "react-bootstrap";
import {
  BiCalendar,
  BiCreditCard,
  BiHome,
  BiPhone,
  BiPhoneCall,
  BiPlusCircle,
  BiSearch,
  BiUser,
} from "react-icons/bi";
import { FiFilter, FiMoreHorizontal } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { FaDownload } from "react-icons/fa";

import "./AllBooking.css";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "John Deo",
      avatar: "👨‍💼",
      package: "All inclusive",
      roomType: "Delux",
      status: "Cancelled",
      checkIn: "02/25/2023",
      checkOut: "02/28/2023",
      payment: "Paid",
      mobile: "1234567890",
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "👩‍💼",
      package: "Business",
      roomType: "Super Delux",
      status: "Booked",
      checkIn: "02/12/2023",
      checkOut: "02/15/2023",
      payment: "Unpaid",
      mobile: "1234567890",
    },
    {
      id: 3,
      name: "John Deo",
      avatar: "👨‍💼",
      package: "All inclusive",
      roomType: "Super Delux",
      status: "Checkin",
      checkIn: "02/25/2023",
      checkOut: "02/26/2023",
      payment: "Paid",
      mobile: "1234567890",
    },
    {
      id: 4,
      name: "Jay Soni",
      avatar: "👨‍💻",
      package: "Business",
      roomType: "Delux",
      status: "Cancelled",
      checkIn: "02/21/2023",
      checkOut: "02/23/2023",
      payment: "Paid",
      mobile: "1234567890",
    },
    {
      id: 5,
      name: "Smita Parikh",
      avatar: "👩‍🦱",
      package: "All inclusive",
      roomType: "Vila",
      status: "CheckOut",
      checkIn: "02/16/2023",
      checkOut: "02/19/2023",
      payment: "Unpaid",
      mobile: "1234567890",
    },
    {
      id: 6,
      name: "Pankaj Singh",
      avatar: "👨‍🎓",
      package: "Wedding",
      roomType: "Double",
      status: "Booked",
      checkIn: "02/11/2023",
      checkOut: "02/14/2023",
      payment: "Unpaid",
      mobile: "1234567890",
    },
    {
      id: 7,
      name: "Pankaj Singh",
      avatar: "👨‍🎓",
      package: "Business",
      roomType: "Single",
      status: "Booked",
      checkIn: "02/27/2023",
      checkOut: "02/28/2023",
      payment: "Unpaid",
      mobile: "1234567890",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    package: true,
    roomType: true,
    status: true,
    checkIn: true,
    checkOut: true,
    payment: true,
    mobile: true,
    actions: true,
  });

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    name: "",
    package: "Business",
    roomType: "Single",
    status: "Booked",
    checkIn: "",
    checkOut: "",
    payment: "Unpaid",
    mobile: "",
  });

  // Filter bookings based on search term
  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.mobile.includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  // Handle checkbox selection
  const handleSelectBooking = (id) => {
    setSelectedBookings((prev) =>
      prev.includes(id)
        ? prev.filter((bookingId) => bookingId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map((b) => b.id));
    }
  };

  // Add new booking
  const handleAddBooking = () => {
    if (
      newBooking.name &&
      newBooking.mobile &&
      newBooking.checkIn &&
      newBooking.checkOut
    ) {
      const booking = {
        ...newBooking,
        id: Math.max(...bookings.map((b) => b.id)) + 1,
        avatar: "👤",
      };
      setBookings((prev) => [...prev, booking]);
      setNewBooking({
        name: "",
        package: "Business",
        roomType: "Single",
        status: "Booked",
        checkIn: "",
        checkOut: "",
        payment: "Unpaid",
        mobile: "",
      });
      setShowAddModal(false);
    }
  };

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    const headers = [
      "Name",
      "Package",
      "Room Type",
      "Status",
      "Check In",
      "Check Out",
      "Payment",
      "Mobile",
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvData = [
      headers.map(escapeCSV).join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.name,
          booking.package,
          booking.roomType,
          booking.status,
          `"${booking.checkIn}"`,
          `"${booking.checkOut}"`,
          booking.payment,
          `"${booking.mobile}"`,
        ]
          .map(escapeCSV)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedBookings([]);
  };

  // Status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      Cancelled: "danger",
      Booked: "success",
      Checkin: "primary",
      CheckOut: "secondary",
    };
    return variants[status] || "light";
  };

  const getPaymentVariant = (payment) => {
    return payment === "Paid" ? "success" : "warning";
  };

  return (
    <>
      <div className="bookings-container">
        <Container fluid>
          {/* <Row className="mb-4"> */}
          {/* <Col> */}
          <h3 className="p-2 pl-0">All Bookings</h3>
          {/* </Col> */}
          {/* </Row> */}

          {/* Controls Card */}
          <Card className="controls-card mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={6} md={12}>
                  <div className="d-flex align-items-center gap-3 flex-wrap ">
                    <InputGroup className="search-input">
                      <InputGroup.Text>
                        <BiSearch size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </Col>

                <Col lg={6} md={12}>
                  <div className="d-flex justify-content-end gap-2 flex-wrap">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="action-btn"
                      title="Toggle Filters"
                    >
                      <FiFilter size={16} />
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setShowAddModal(true)}
                      className="action-btn"
                      title="Add Booking"
                    >
                      <BiPlusCircle size={16} />
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleRefresh}
                      className="action-btn"
                      title="Refresh"
                    >
                      <LuRefreshCw size={16} />
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={exportToExcel}
                      className="action-btn"
                      title="Export CSV"
                    >
                      <FaDownload size={16} />
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Column Filters */}
              <Collapse in={showFilters}>
                <div className="filters-section mt-3">
                  <Card className="filter-card">
                    <Card.Body>
                      <h6 className="filter-title">Show/Hide Columns</h6>
                      <Row>
                        {Object.entries(columnVisibility).map(
                          ([key, visible]) => (
                            <Col
                              lg={3}
                              md={4}
                              sm={6}
                              key={key}
                              className="mb-2"
                            >
                              <Form.Check
                                type="checkbox"
                                id={`column-${key}`}
                                label={
                                  key === "roomType"
                                    ? "Room Type"
                                    : key === "checkIn"
                                    ? "Check In"
                                    : key === "checkOut"
                                    ? "Check Out"
                                    : key.charAt(0).toUpperCase() + key.slice(1)
                                }
                                checked={visible}
                                onChange={(e) =>
                                  setColumnVisibility((prev) => ({
                                    ...prev,
                                    [key]: e.target.checked,
                                  }))
                                }
                                className="filter-checkbox"
                              />
                            </Col>
                          )
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              </Collapse>
            </Card.Body>
          </Card>

          {/* Table Card */}
          <Card className="table-card">
            <Card.Body className="p-2">
              <div className="table-responsive">
                <Table hover className="bookings-table mb-0 ">
                  <thead className="table-header" style={{ border: "none" }}>
                    <tr>
                      <th className="checkbox-col pl-0">
                        <Form.Check
                          type="checkbox"
                          checked={
                            selectedBookings.length ===
                              filteredBookings.length &&
                            filteredBookings.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      {columnVisibility.name && <th>Name</th>}
                      {columnVisibility.package && (
                        <th className="d-none d-md-table-cell">Package</th>
                      )}
                      {columnVisibility.roomType && (
                        <th className="d-none d-lg-table-cell">Room Type</th>
                      )}
                      {columnVisibility.status && <th>Status</th>}
                      {columnVisibility.checkIn && (
                        <th className="d-none d-md-table-cell">Check In</th>
                      )}
                      {columnVisibility.checkOut && (
                        <th className="d-none d-md-table-cell">Check Out</th>
                      )}
                      {columnVisibility.payment && <th>Payment</th>}
                      {columnVisibility.mobile && (
                        <th className="d-none d-lg-table-cell">Mobile</th>
                      )}
                      {columnVisibility.actions && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="table-row ">
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => handleSelectBooking(booking.id)}
                          />
                        </td>
                        {columnVisibility.name && (
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {booking.avatar}
                              </div>
                              <span className="user-name">{booking.name}</span>
                            </div>
                          </td>
                        )}
                        {columnVisibility.package && (
                          <td className="package-cell d-none d-md-table-cell">
                            {booking.package}
                          </td>
                        )}
                        {columnVisibility.roomType && (
                          <td className="room-type d-none d-lg-table-cell">
                            {booking.roomType}
                          </td>
                        )}
                        {columnVisibility.status && (
                          <td>
                            <Badge
                              bg={getStatusVariant(booking.status)}
                              className="status-badge"
                            >
                              {booking.status}
                            </Badge>
                          </td>
                        )}
                        {columnVisibility.checkIn && (
                          <td className="date-cell d-none d-md-table-cell">
                            {booking.checkIn}
                          </td>
                        )}
                        {columnVisibility.checkOut && (
                          <td className="date-cell d-none d-md-table-cell">
                            {booking.checkOut}
                          </td>
                        )}
                        {columnVisibility.payment && (
                          <td>
                            <Badge
                              bg={getPaymentVariant(booking.payment)}
                              className="payment-badge"
                            >
                              {booking.payment}
                            </Badge>
                          </td>
                        )}
                        {columnVisibility.mobile && (
                          <td className="d-none d-lg-table-cell">
                            <div className="mobile-info">
                              <BiPhoneCall size={14} className="phone-icon" />
                              <span>{booking.mobile}</span>
                            </div>
                          </td>
                        )}
                        {columnVisibility.actions && (
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="link"
                                className="action-dropdown"
                              >
                                <FiMoreHorizontal size={16} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="end">
                                <Dropdown.Item>Edit</Dropdown.Item>
                                <Dropdown.Item>View Details</Dropdown.Item>
                                <Dropdown.Item className="text-danger">
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Add New Booking Modal */}
          <Modal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            centered
            className="add-booking-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Add New Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <BiUser size={16} className="me-2" />
                        Guest Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={newBooking.name}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter guest name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <BiHome size={16} className="me-2" />
                        Package
                      </Form.Label>
                      <Form.Select
                        value={newBooking.package}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            package: e.target.value,
                          }))
                        }
                      >
                        <option value="Business">Business</option>
                        <option value="All inclusive">All inclusive</option>
                        <option value="Wedding">Wedding</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Room Type</Form.Label>
                      <Form.Select
                        value={newBooking.roomType}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            roomType: e.target.value,
                          }))
                        }
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Delux">Delux</option>
                        <option value="Super Delux">Super Delux</option>
                        <option value="Vila">Vila</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <BiCalendar size={16} className="me-2" />
                        Check In
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={newBooking.checkIn}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            checkIn: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <BiCalendar size={16} className="me-2" />
                        Check Out
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={newBooking.checkOut}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            checkOut: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <BiCreditCard size={16} className="me-2" />
                        Payment Status
                      </Form.Label>
                      <Form.Select
                        value={newBooking.payment}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            payment: e.target.value,
                          }))
                        }
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <BiPhone size={16} className="me-2" />
                        Mobile Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        value={newBooking.mobile}
                        onChange={(e) =>
                          setNewBooking((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        placeholder="Enter mobile number"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddBooking}>
                Add Booking
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
};

export default BookingsTable;
