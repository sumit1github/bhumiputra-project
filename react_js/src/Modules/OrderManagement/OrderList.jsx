import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import { FaShoppingCart, FaCalendarAlt, FaSearch, FaSync, FaMoneyBillWave } from 'react-icons/fa';
import { BiPackage } from 'react-icons/bi';

import AdminLayout from "../IT-Dashboard/AdminLayout";
import { getOrderList } from './order_calls';
import './OrderList.css';

export const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // API call to fetch orders
    const { mutate: loadOrderList, data: orderData, isLoading: orderIsLoading } = getOrderList();

    useEffect(() => {
        loadOrderList();
    }, []);

    useEffect(() => {
        if (orderData) {
            setOrders(orderData.order_list || []);
            setFilteredOrders(orderData.order_list || []);
            setIsLoading(false);
        }
    }, [orderData]);

    // Filter orders based on search and date
    useEffect(() => {
        let filtered = orders;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(order =>
                order.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toString().includes(searchQuery)
            );
        }

        // Date filter
        if (dateFilter !== 'all') {
            const today = new Date();
            const orderDate = new Date();

            filtered = filtered.filter(order => {
                const orderDateTime = new Date(order.order_date);

                switch (dateFilter) {
                    case 'today':
                        return orderDateTime.toDateString() === today.toDateString();
                    case 'yesterday':
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        return orderDateTime.toDateString() === yesterday.toDateString();
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return orderDateTime >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return orderDateTime >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        setFilteredOrders(filtered);
    }, [searchQuery, dateFilter, orders]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    const handleRefresh = () => {
        setIsLoading(true);
        loadOrderList();
    };

    return (
        <AdminLayout>
            <div className="order-list-container">
                <Container fluid>
                    {/* Header Section */}
                    <div className="order-header">
                        <Row className="align-items-center">
                            <Col>
                                <h1 className="page-title">
                                    <FaShoppingCart className="me-2" />
                                    Order Management
                                </h1>
                                <p className="page-subtitle">Track and manage all customer orders</p>
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="outline-primary"
                                    className="refresh-btn"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                >
                                    <FaSync className={`me-2 ${isLoading ? 'spin' : ''}`} />
                                    Refresh
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Search and Filter Section */}
                    <Card className="search-filter-card mb-4">
                        <Card.Body>
                            <Row className="align-items-end">
                                <Col md={6} lg={4}>
                                    <Form.Group>
                                        <Form.Label>Search Orders</Form.Label>
                                        <div className="search-input-group">
                                            <Form.Control
                                                type="text"
                                                placeholder="Search by Order ID or UID..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="search-input"
                                            />
                                            <div className="search-icon">
                                                <FaSearch />
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Filter by Date</Form.Label>
                                        <Form.Select
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="date-filter"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="yesterday">Yesterday</option>
                                            <option value="week">Last 7 Days</option>
                                            <option value="month">Last 30 Days</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={2} lg={2} className="text-end">
                                    <div className="results-count">
                                        <small className="text-muted">
                                            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                                        </small>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Orders Grid */}
                    <Row>
                        {isLoading ? (
                            // Loading cards
                            Array.from({ length: 6 }).map((_, index) => (
                                <Col key={index} xl={4} lg={6} md={6} sm={12} className="mb-4">
                                    <Card className="order-card loading-card">
                                        <Card.Body>
                                            <div className="loading-placeholder"></div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <Col key={order.id} xl={4} lg={6} md={6} sm={12} className="mb-4">
                                    <Card className="order-card h-100">
                                        <Card.Header className="order-card-header">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div className="order-icon">
                                                        <BiPackage size={20} />
                                                    </div>
                                                    <div className="ms-2">
                                                        <h6 className="order-id mb-0">#{order.id}</h6>
                                                        <Badge bg="light" text="dark" className="order-uid-badge">
                                                            {order.uid}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="order-status">
                                                    <Badge bg="success" className="status-badge">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card.Header>

                                        <Card.Body className="order-card-body">
                                            <div className="order-details">
                                                <div className="order-detail-item">
                                                    <div className="detail-icon">
                                                        <FaMoneyBillWave size={16} />
                                                    </div>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Total Amount</span>
                                                        <span className="detail-value amount-value">
                                                            {formatCurrency(order.total_amount)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="order-detail-item">
                                                    <div className="detail-icon">
                                                        <FaCalendarAlt size={16} />
                                                    </div>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Order Date</span>
                                                        <span className="detail-value date-value">
                                                            {formatDate(order.order_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>

                                        <Card.Footer className="order-card-footer">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="view-details-btn w-100"
                                            >
                                                View Details
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <Card className="empty-state-card">
                                    <Card.Body className="text-center py-5">
                                        <FaShoppingCart size={64} className="text-muted mb-3" />
                                        <h5 className="text-muted">No orders found</h5>
                                        <p className="text-muted">
                                            {searchQuery || dateFilter !== 'all'
                                                ? 'Try adjusting your search criteria or filters'
                                                : 'No orders have been placed yet'
                                            }
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
        </AdminLayout>
    )
}
