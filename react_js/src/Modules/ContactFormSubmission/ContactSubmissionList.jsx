import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Form } from 'react-bootstrap'
import { BiUser, BiEnvelope, BiMessage } from 'react-icons/bi'
import { toast } from 'react-toastify';

import './ContactSubmissionList.css'

import { getAllContacts, markResolve } from './calls';

export const ContactSubmissionList = () => {
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState("new");
    const { mutate: loadContactList, isLoading, isError, error, data } = getAllContacts();

    useEffect(() => {
        loadContactList(filter);
    }, [filter])

    useEffect(() => {
        if (data) {
            setContacts(data.contact_list);
        }
        if (isError) {
            console.error("Error fetching contact submissions:", error);
        }
    }, [data])


    const [submissions] = useState([
        {
            id: 1,
            name: "John Doe",
            subject: "Product Inquiry",
            message: "I'm interested in your latest product line and would like to know more about pricing and availability.",
            email: "john.doe@example.com",
            createdAt: "2024-07-19T10:30:00Z",
            status: "new"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            subject: "Technical Support",
            message: "I'm experiencing issues with the login functionality. Could you please help me resolve this?",
            email: "sarah.j@example.com",
            createdAt: "2024-07-19T09:15:00Z",
            status: "in-progress"
        },
        {
            id: 3,
            name: "Mike Wilson",
            subject: "Partnership Opportunity",
            message: "We are a tech startup looking for potential partnerships. Would love to discuss collaboration opportunities.",
            email: "mike.wilson@startup.com",
            createdAt: "2024-07-18T16:45:00Z",
            status: "resolved"
        },
        {
            id: 4,
            name: "Emily Chen",
            subject: "Feedback",
            message: "Great service! The team was very helpful and responsive. Keep up the excellent work.",
            email: "emily.chen@gmail.com",
            createdAt: "2024-07-18T14:20:00Z",
            status: "resolved"
        },
        {
            id: 5,
            name: "David Brown",
            subject: "Billing Question",
            message: "I have a question about my recent invoice. Could someone from billing contact me?",
            email: "d.brown@company.com",
            createdAt: "2024-07-17T11:30:00Z",
            status: "new"
        }
    ])

    const getStatusBadge = (status) => {
        const statusConfig = {
            'new': { variant: 'primary', text: 'New' },
            'in-progress': { variant: 'warning', text: 'In Progress' },
            'resolved': { variant: 'success', text: 'Resolved' }
        }

        const config = statusConfig[status] || { variant: 'secondary', text: 'Unknown' }
        return <Badge bg={config.variant} className="status-badge">{config.text}</Badge>
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    //  ----------------------- mark resolve -----------------------

    const { mutate: MARKResolve, data: resolveData } = markResolve();

    const handleResolve = (cid) => {
        MARKResolve(cid);
    }

    useEffect(() => {
        if (resolveData) {
            toast.success(resolveData?.message);

            // Update the contact status to 'resolved' by finding the contact ID
            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === resolveData.contact_id
                        ? { ...contact, status: 'resolved' }
                        : contact
                )
            );
        }
    }, [resolveData]);

    return (
        <div className="contact-submissions-container">
            <Container fluid>
                {/* Header Section */}
                <Row className="mb-4">
                    <Col>
                        <div className="submissions-header">
                            <h2 className="submissions-title">
                                <BiEnvelope className="me-2" />
                                Contact Form Submissions
                            </h2>
                            <p className="submissions-subtitle">
                                Manage and respond to customer inquiries
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Search and Filter Section */}
                <Row className="mb-4">
                    <Col lg={8} md={12}>
                        <Card className="search-filter-card">
                            <Card.Body>
                                <Row className="align-items-center">

                                    <Col md={3}>
                                        <Form.Select
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="status-filter"
                                        >
                                            <option value="new">New</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="today">Today</option>
                                            <option value="yesterday">Yesterday</option>
                                        </Form.Select>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Submissions Cards Grid */}
                <Row>
                    {contacts.length > 0 ? (
                        contacts.map((submission) => (
                            <Col key={submission.id} lg={6} xl={4} className="mb-4">
                                <Card className="submission-card h-100">
                                    <Card.Header className="submission-card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="user-avatar">
                                                    <BiUser size={20} />
                                                </div>
                                                <div className="ms-2">
                                                    <h6 className="mb-0 submission-name">{submission.name}</h6>

                                                </div>
                                            </div>
                                            {getStatusBadge(submission.status)}
                                        </div>
                                    </Card.Header>

                                    <Card.Body className="submission-card-body">
                                        <div className="submission-subject">
                                            <BiMessage className="subject-icon" />
                                            <h6 className="subject-title">{submission.subject}</h6>
                                        </div>

                                        <div className="submission-message">
                                            <p className="message-text">
                                                {submission.message}
                                            </p>
                                        </div>
                                    </Card.Body>

                                    <Card.Footer className="submission-card-footer">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="submission-date">
                                                {formatDate(submission.created_at)}
                                            </small>
                                            <button className="btn btn-sm btn-outline-primary view-details-btn" onClick={() => handleResolve(submission.id)}>
                                                Resolve Now
                                            </button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12}>
                            <Card className="empty-state-card">
                                <Card.Body className="text-center py-5">
                                    <BiEnvelope size={64} className="text-muted mb-3" />
                                    <h5 className="text-muted">No submissions found</h5>

                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}
