import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaUser, FaBox, FaCheckCircle } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Alert } from 'react-bootstrap';


import AdminLayout from "../../IT-Dashboard/AdminLayout";
import './DistributerLanding.css';
import { getProductList, searchUser, placeOrder } from '../distributer_calls';

export const DistributerLanding = () => {
    const [searchProductQuery, setSearchProductQuery] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);


    // Fix: Use array destructuring instead of object destructuring
    const [allProducts, setAllProducts] = useState([]);

    // Fetch product list using the API call
    const { mutate: loadProductList, data: productData, isLoading: productIsLoading, isError: productIsError, error: productError } = getProductList();
    useEffect(() => {
        loadProductList();
    }, []);

    useEffect(() => {
        if (productData) {
            // Map API response to match component structure
            const mappedProducts = productData.product_list?.map(product => ({
                id: product.id,
                name: product.name,
                sell_price: parseFloat(product.sell_price), // Convert string to number
                short_description: product.brand || 'No description available', // Use brand as description since short_description doesn't exist
                stock: product.stock,
                uid: product.uid,
                slug: product.slug,
                brand: product.brand,
                buy_price: parseFloat(product.buy_price),
                offer_price: parseFloat(product.offer_price),
                bv_price: product.bv_price,
                is_joining_package: product.is_joining_package
            })) || [];

            setAllProducts(mappedProducts);
        }
    }, [productData]);

    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        setFilteredProducts(allProducts);
    }, [allProducts]);

    // Update cart count whenever cartItems change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
    }, [cartItems]);

    // Filter products based on search query
    useEffect(() => {
        if (searchProductQuery.trim() === '') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(product =>
                product.id.toString().includes(searchProductQuery) ||
                product.slug.toLowerCase().includes(searchProductQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchProductQuery, allProducts]); // Added allProducts to dependency array

    const handleUserDeselect = () => {
        setSelectedUser(null);
        setUserFound(null); // Also clear userFound when deselecting
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    const getSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.sell_price * item.quantity), 0);
    };

    const getDiscount = () => {
        if (!selectedUser) {
            // 5% discount when no user is selected
            return getSubtotal() * 0.05;
        }
        return 0;
    };

    const getTotalAmount = () => {
        return getSubtotal() - getDiscount();
    };


    // ------------------ user search functionality ------------------
    const { mutate: searchUserData, data: user_data, error: userError } = searchUser();
    const [userFound, setUserFound] = useState(null);
    const [userSearch, setUserSearch] = useState({
        "search_by": "id",
        "search_value": ""
    });
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserSearch({
            ...userSearch,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUserSearch = () => {
        // Clear previous results before searching
        setUserFound(null);
        setSelectedUser(null);

        // Only search if search value is not empty
        if (userSearch.search_value.trim()) {
            searchUserData(userSearch);
        }
    };

    useEffect(() => {
        if (user_data) {
            setUserFound(user_data?.users);
        }
    }, [user_data]);

    const handleUserSelect = (user) => {
        setSelectedUser(user); // Set the specific user, not the array
        setUserFound(null); // Clear the search results
    };

    const handleCancelUserSearch = () => {
        setUserFound(null); // Clear search results
    };


    // ------------------- order place ------------------------
    const { mutate: orderPlaceCall, data: orderPlaceData, isLoading: orderPlaceIsLoading, isError: orderPlaceIsError, error: orderPlaceError } = placeOrder();
    const handlePlaceOrder = () => {

        orderPlaceCall({
            "customer": selectedUser ? selectedUser.id : null,
            "products_info": cartItems.map(item => ({
                "p_id": item.id,
                "qty": item.quantity,
                "total_bv": item.bv_price * item.quantity,
                "total_price": item.sell_price * item.quantity
            }))
        });

    }

    useEffect(() => {
        if (orderPlaceData) {
            if (orderPlaceData?.status === 200) {
                setCartItems([]);
                setShowCartModal(false);
                toast.success(orderPlaceData?.message);
            } else {
                toast.error(orderPlaceData?.message || "Something went wrong while placing the order.");
            }
        }
    }, [orderPlaceData]);


    return (
        <AdminLayout>
            <div className="distributor-landing">
                <Container fluid>
                    {/* Header Section */}
                    <div className="distributor-header">
                        <Row className="align-items-center">
                            <Col>
                                <h1 className="page-title">
                                    <FaUser className="me-2" />
                                    Distributor Dashboard
                                </h1>
                                <p className="page-subtitle">Manage orders and serve customers efficiently</p>
                            </Col>
                            <Col xs="auto">
                                <div className="cart-button-container">
                                    <Button
                                        variant="outline-primary"
                                        className="cart-button"
                                        onClick={() => setShowCartModal(true)}
                                    >
                                        <FaShoppingCart className="me-2" />
                                        Cart
                                    </Button>
                                    {cartCount > 0 && (
                                        <Badge bg="danger" className="cart-badge">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* User Search Section */}
                    <Card className="search-card mb-4">
                        <Card.Body>
                            <h5 className="section-title">
                                <FaSearch className="me-2" />
                                Customer Search
                            </h5>
                            <Row className="align-items-end">
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Search By</Form.Label>
                                        <Form.Select
                                            value={userSearch.search_by}
                                            onChange={handleUserInputChange}
                                            className="search-type-select"
                                            name='search_by'
                                        >
                                            <option value="id">User ID</option>
                                            <option value="email">Email</option>
                                            <option value="contact">Contact</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            {userSearch.search_by === 'id' && 'Enter User ID'}
                                            {userSearch.search_by === 'email' && 'Enter Email'}
                                            {userSearch.search_by === 'contact' && 'Enter Contact'}
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={
                                                userSearch.search_by === 'id'
                                                    ? 'e.g., BP13744'
                                                    : userSearch.search_by === 'email'
                                                        ? 'e.g., john@example.com'
                                                        : 'e.g., 9876543210'
                                            }
                                            value={userSearch.search_value}
                                            onChange={handleUserInputChange}
                                            className="search-input"
                                            name='search_value'
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Button
                                        variant="primary"
                                        onClick={handleUserSearch}
                                        className="search-btn w-100"
                                        disabled={!userSearch.search_value.trim()}
                                    >
                                        <FaSearch className="me-2" />
                                        Search User
                                    </Button>
                                </Col>
                            </Row>

                            {/* User Confirmation */}
                            {userFound && userFound.length > 0 && userFound.map((user) => (
                                <Alert key={user.id} variant="success" className="mt-3 user-confirm-alert">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="me-2 text-success" size={20} />
                                            <div>
                                                <strong>User Found!</strong>
                                                <div className="user-details">
                                                    <strong>{user.email}</strong> ({user.id})
                                                    <br />
                                                    <small>{user.contact}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="user-actions">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleUserSelect(user)}
                                                className="me-2"
                                            >
                                                Select User
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={handleCancelUserSearch}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </Alert>
                            ))}

                            {/* No User Found Message */}
                            {userFound && userFound.length === 0 && (
                                <Alert variant="warning" className="mt-3">
                                    <div className="d-flex align-items-center">
                                        <FaUser className="me-2 text-warning" size={20} />
                                        <div>
                                            <strong>No user found</strong>
                                            <br />
                                            <small>Please check the search criteria and try again</small>
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            {/* Selected User Display */}
                            {selectedUser && (
                                <Alert variant="info" className="mt-3 selected-user-alert">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <FaUser className="me-2 text-info" size={20} />
                                            <div>
                                                <strong>Selected Customer</strong>
                                                <div className="user-details">
                                                    <strong>{selectedUser.email}</strong> ({selectedUser.id})
                                                    <br />
                                                    <small>{selectedUser.contact}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={handleUserDeselect}
                                        >
                                            Remove User
                                        </Button>
                                    </div>
                                </Alert>
                            )}

                            {/* No User Selected Warning */}
                            {!selectedUser && !userFound && (
                                <Alert variant="warning" className="mt-3">
                                    <div className="d-flex align-items-center">
                                        <FaUser className="me-2 text-warning" size={20} />
                                        <div>
                                            <strong>No customer selected</strong>
                                            <br />
                                            <small>Automatic 5% discount will be applied at checkout</small>
                                        </div>
                                    </div>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Products Section */}
                    <Card className="products-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="section-title">
                                    <FaBox className="me-2" />
                                    Products
                                </h5>
                                <div className="product-search">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchProductQuery}
                                        onChange={(e) => setSearchProductQuery(e.target.value)}
                                        className="product-search-input"
                                    />
                                </div>
                            </div>

                            <Row>
                                {filteredProducts.map(product => (
                                    <Col xl={3} lg={4} md={6} sm={12} key={product.id} className="mb-4">
                                        <Card className="product-card h-100">
                                            <Card.Body className="d-flex flex-column">
                                                <div className="product-header">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <Badge bg="secondary" className="product-id-badge">
                                                            ID: {product.id}
                                                        </Badge>
                                                        <span className={`stock-badge ${product.stock > 20 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                        </span>
                                                    </div>
                                                    <Card.Title className="product-name">
                                                        {product.name}
                                                    </Card.Title>
                                                    <div className="product-price-large">
                                                        ₹{product.sell_price}
                                                    </div>
                                                </div>

                                                <p className="product-description">
                                                    {product.short_description}
                                                </p>

                                                <div className="product-footer mt-auto">
                                                    <Button
                                                        variant="primary"
                                                        className="add-to-cart-btn w-100"
                                                        onClick={() => addToCart(product)}
                                                        disabled={product.stock === 0}
                                                    >
                                                        <FaPlus className="me-2" />
                                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {filteredProducts.length === 0 && (
                                <div className="no-products">
                                    <FaBox size={48} className="text-muted mb-3" />
                                    <h6 className="text-muted">No products found</h6>
                                    <p className="text-muted">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Container>

                {/* Cart Modal */}
                <Modal show={showCartModal} onHide={() => setShowCartModal(false)} size="lg">
                    <Modal.Header closeButton className="cart-modal-header">
                        <Modal.Title>
                            <FaShoppingCart className="me-2" />
                            Shopping Cart ({cartCount} items)
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="cart-modal-body">
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <FaShoppingCart size={48} className="text-muted mb-3" />
                                <h6 className="text-muted">Your cart is empty</h6>
                                <p className="text-muted">Add some products to get started</p>
                            </div>
                        ) : (
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        {/* Mobile Cart Item Header */}
                                        <div className="cart-item-header-mobile d-md-none">
                                            <div className="cart-item-icon">
                                                <div className="product-icon">
                                                    {item.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="cart-item-details">
                                                <h6 className="cart-item-name">{item.name}</h6>
                                                <div className="cart-item-price">₹{item.sell_price}</div>
                                                <small className="cart-item-description">{item.short_description}</small>
                                            </div>
                                        </div>

                                        {/* Desktop Cart Item Layout */}
                                        <div className="d-none d-md-flex align-items-center w-100" style={{ gap: '1rem' }}>
                                            <div className="cart-item-icon">
                                                <div className="product-icon">
                                                    {item.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="cart-item-details">
                                                <h6 className="cart-item-name">{item.name}</h6>
                                                <div className="cart-item-price">₹{item.sell_price}</div>
                                                <small className="cart-item-description">{item.short_description}</small>
                                            </div>
                                            <div className="cart-item-quantity">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="quantity-btn"
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="quantity-btn"
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                            <div className="cart-item-total">
                                                ₹{item.sell_price * item.quantity}
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeFromCart(item.id)}
                                                className="remove-btn"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>

                                        {/* Mobile Cart Item Controls */}
                                        <div className="cart-item-controls-mobile d-md-none">
                                            <div className="cart-item-quantity">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="quantity-btn"
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="quantity-btn"
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                            <div className="cart-item-total">
                                                ₹{item.sell_price * item.quantity}
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeFromCart(item.id)}
                                                className="remove-btn"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Modal.Body>
                    {cartItems.length > 0 && (
                        <Modal.Footer className="cart-modal-footer">
                            <div className="cart-total-breakdown">
                                <div className="breakdown-row">
                                    <span>Subtotal:</span>
                                    <span>₹{getSubtotal().toFixed(2)}</span>
                                </div>
                                {getDiscount() > 0 && (
                                    <div className="breakdown-row discount-row">
                                        <span>Discount (5% - No Customer):</span>
                                        <span>-₹{getDiscount().toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedUser && (
                                    <div className="breakdown-row customer-row">
                                        <span>Customer: {selectedUser.name}</span>
                                        <span>No Discount</span>
                                    </div>
                                )}
                                <div className="breakdown-row total-row">
                                    <h5>Total: ₹{getTotalAmount().toFixed(2)}</h5>
                                </div>
                            </div>
                            <div className="cart-actions">
                                <Button
                                    variant="success"
                                    onClick={handlePlaceOrder}
                                    className="place-order-btn"
                                >
                                    <span className="btn-text">Place Order</span>
                                    <span className="btn-icon">→</span>
                                </Button>
                            </div>
                        </Modal.Footer>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    )
}
