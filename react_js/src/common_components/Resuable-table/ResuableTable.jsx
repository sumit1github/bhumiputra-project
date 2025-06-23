import React, { useState, useMemo } from "react";
import {
  BiCalendar,
  BiCreditCard,
  BiHome,
  BiPhone,
  BiPhoneCall,
  BiPlusCircle,
  BiSearch,
} from "react-icons/bi";
import { FiFilter, FiMoreHorizontal } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { FaDownload } from "react-icons/fa";

import "./ResuableTable.css";

export const ReusableDataTable = ({
  data = [],
  columns = [],
  title = "Data Table",
  searchable = true,
  exportable = true,
  selectable = true,
  addable = true,
  refreshable = true,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  addModalTitle = "Add New Record",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const visibility = {};
    columns.forEach((col) => {
      visibility[col.key] = col.visible !== false;
    });
    if (selectable) visibility.checkbox = true;
    visibility.actions = true;
    return visibility;
  });

  // New record form state
  const [newRecord, setNewRecord] = useState(() => {
    const record = {};
    columns.forEach((col) => {
      if (col.addable !== false) {
        record[col.key] = col.defaultValue || "";
      }
    });
    return record;
  });

  // Update table data when prop changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;

    return tableData.filter((item) =>
      columns.some((col) => {
        if (!col.searchable) return false;
        const value = getNestedValue(item, col.key);
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [tableData, searchTerm, columns]);

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Helper function to set nested object values
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!(key in current)) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  // Handle checkbox selection
  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((item) => item.id));
    }
  };

  // Add new record
  const handleAddRecord = async () => {
    const requiredFields = columns.filter(
      (col) => col.required && col.addable !== false
    );
    const isValid = requiredFields.every((col) => newRecord[col.key]);

    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }

    const record = {
      ...newRecord,
      id: Math.max(...tableData.map((item) => item.id || 0)) + 1,
    };

    if (onAdd) {
      await onAdd(record);
    } else {
      setTableData((prev) => [...prev, record]);
    }

    // Reset form
    const resetRecord = {};
    columns.forEach((col) => {
      if (col.addable !== false) {
        resetRecord[col.key] = col.defaultValue || "";
      }
    });
    setNewRecord(resetRecord);
    setShowAddModal(false);
  };

  // Export to CSV
  const exportToCSV = () => {
    const visibleColumns = columns.filter((col) => columnVisibility[col.key]);
    const headers = visibleColumns.map((col) => col.header);

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
      ...filteredData.map((item) =>
        visibleColumns
          .map((col) => {
            const value = getNestedValue(item, col.key);
            return escapeCSV(col.render ? col.render(value, item) : value);
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Refresh data
  const handleRefresh = async () => {
    setSearchTerm("");
    setSelectedItems([]);
    if (onRefresh) {
      await onRefresh();
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  // Render cell content
  const renderCell = (column, item) => {
    const value = getNestedValue(item, column.key);

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === "badge") {
      const variant = column.badgeVariant
        ? column.badgeVariant(value)
        : "secondary";
      return (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      );
    }

    return value;
  };

  // Render form field
  const renderFormField = (column) => {
    const value = getNestedValue(newRecord, column.key);

    if (column.type === "select") {
      return (
        <select
          value={value}
          onChange={(e) => {
            const updated = { ...newRecord };
            setNestedValue(updated, column.key, e.target.value);
            setNewRecord(updated);
          }}
          required={column.required}
          className="form-control"
        >
          {column.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={column.type || "text"}
        value={value}
        onChange={(e) => {
          const updated = { ...newRecord };
          setNestedValue(updated, column.key, e.target.value);
          setNewRecord(updated);
        }}
        placeholder={column.placeholder}
        required={column.required}
        className="form-control"
      />
    );
  };

  return (
    <div className={`bookings-container p-3 ${className} mb-130`}>
      <h3 className="mb-4">{title}</h3>

      {/* /* Controls Card */}
      <div className="card controls-card mb-4 ">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
            <div className="flex-grow-1">
              {searchable && (
                <div className="search-input">
                  <div className="input-group">
                    <span className="input-group-text">
                      <BiSearch size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn action-btn"
                title="Toggle Filters"
              >
                <FiFilter size={16} />
              </button>

              {addable && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn action-btn"
                  title="Add Record"
                >
                  <BiPlusCircle size={16} />
                </button>
              )}

              {refreshable && (
                <button
                  onClick={handleRefresh}
                  className="btn action-btn"
                  title="Refresh"
                >
                  <LuRefreshCw size={16} />
                </button>
              )}

              {exportable && (
                <button
                  onClick={exportToCSV}
                  className="btn action-btn"
                  title="Export CSV"
                >
                  <FaDownload size={16} />
                </button>
              )}
            </div>
          </div>

          <div
            className={`filters-section ${showFilters ? "show" : ""}`}
            style={{
              height: showFilters ? "auto" : "0",
              overflow: "hidden",
              transition: "height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              opacity: showFilters ? "1" : "0",
            }}
          >
            <div className="card filter-card mt-3">
              <div className="card-body">
                <h6 className="filter-title">Show/Hide Columns</h6>
                <div className="row">
                  {columns.map((column) => (
                    <div key={column.key} className="col-md-6 col-lg-4 mb-2">
                      <div className="form-check filter-checkbox">
                        <input
                          type="checkbox"
                          id={`col-${column.key}`}
                          checked={columnVisibility[column.key]}
                          onChange={(e) =>
                            setColumnVisibility((prev) => ({
                              ...prev,
                              [column.key]: e.target.checked,
                            }))
                          }
                          className="form-check-input"
                        />
                        <label
                          htmlFor={`col-${column.key}`}
                          className="form-check-label"
                        >
                          {column.header}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="table bookings-table mb-0">
            <thead>
              <tr>
                {selectable && (
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredData.length &&
                        filteredData.length > 0
                      }
                      onChange={handleSelectAll}
                      className="form-check-input"
                    />
                  </th>
                )}
                {columns.map((column) =>
                  columnVisibility[column.key] ? (
                    <th key={column.key}>{column.header}</th>
                  ) : null
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="table-row">
                  {selectable && (
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="form-check-input"
                      />
                    </td>
                  )}
                  {columns.map((column) =>
                    columnVisibility[column.key] ? (
                      <td key={column.key}>{renderCell(column, item)}</td>
                    ) : null
                  )}
                  <td>
                    <div className="dropdown z-index-999">
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="btn action-dropdown"
                      >
                        <FiMoreHorizontal size={16} />
                      </button>
                      {openDropdown === item.id && (
                        <div className="dropdown-menu show">
                          {onEdit && (
                            <button
                              onClick={() => {
                                onEdit(item);
                                setOpenDropdown(null);
                              }}
                              className="dropdown-item"
                            >
                              Edit
                            </button>
                          )}
                          {onView && (
                            <button
                              onClick={() => {
                                onView(item);
                                setOpenDropdown(null);
                              }}
                              className="dropdown-item"
                            >
                              View Details
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                onDelete(item);
                                setOpenDropdown(null);
                              }}
                              className="dropdown-item text-danger"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Record Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg add-booking-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{addModalTitle}</h5>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-close"
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  {columns
                    .filter((col) => col.addable !== false)
                    .map((column) => (
                      <div
                        key={column.key}
                        className={`col-md-${column.colSize || 6}`}
                      >
                        <label className="form-label">
                          {column.icon && (
                            <span className="me-2">{column.icon}</span>
                          )}
                          {column.header}
                          {column.required && (
                            <span className="text-danger ms-1">*</span>
                          )}
                        </label>
                        {renderFormField(column)}
                      </div>
                    ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleAddRecord} className="btn btn-primary">
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingsExample = () => {
  const [bookingsData, setBookingsData] = useState([
    {
      id: 1,
      name: "John Deo",
      avatar: "👨‍💼",
      package: "All inclusive",
      roomType: "Delux",
      status: "Cancelled",
      checkIn: "2023-02-25",
      checkOut: "2023-02-28",
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
      checkIn: "2023-02-12",
      checkOut: "2023-02-15",
      payment: "Unpaid",
      mobile: "1234567890",
    },
    {
      id: 3,
      name: "Michael Johnson",
      avatar: "👨‍💻",
      package: "Wedding",
      roomType: "Vila",
      status: "Checkin",
      checkIn: "2023-02-20",
      checkOut: "2023-02-25",
      payment: "Paid",
      mobile: "9876543210",
    },
  ]);

  const columns = [
    {
      key: "name",
      header: "Name",
      searchable: true,
      required: true,
      render: (value, item) => (
        <div className="user-info">
          <div className="user-avatar">{item.avatar}</div>
          <span className="user-name">{value}</span>
        </div>
      ),
      placeholder: "Enter guest name",
      colSize: 12,
    },
    {
      key: "package",
      header: "Package",
      searchable: true,
      type: "select",
      options: [
        { value: "Business", label: "Business" },
        { value: "All inclusive", label: "All inclusive" },
        { value: "Wedding", label: "Wedding" },
      ],
      defaultValue: "Business",
      colSize: 6,
      icon: <BiHome size={16} />,
      render: (value) => <span className="package-cell">{value}</span>,
    },
    {
      key: "roomType",
      header: "Room Type",
      type: "select",
      options: [
        { value: "Single", label: "Single" },
        { value: "Double", label: "Double" },
        { value: "Delux", label: "Delux" },
        { value: "Super Delux", label: "Super Delux" },
        { value: "Vila", label: "Vila" },
      ],
      defaultValue: "Single",
      colSize: 6,
      render: (value) => <span className="room-type">{value}</span>,
    },
    {
      key: "status",
      header: "Status",
      // type: "badge",
      searchable: true,
      badgeVariant: (value) => {
        const variants = {
          Cancelled: "cancelled",
          Booked: "booked",
          Checkin: "checkin",
          CheckOut: "checkout",
        };
        return variants[value] || "secondary";
      },
      type: "select",
      options: [
        { value: "Booked", label: "Booked" },
        { value: "Checkin", label: "Checkin" },
        { value: "CheckOut", label: "CheckOut" },
        { value: "Cancelled", label: "Cancelled" },
      ],
      defaultValue: "Booked",
      colSize: 6,
    },
    {
      key: "checkIn",
      header: "Check In",
      type: "date",
      required: true,
      colSize: 6,
      icon: <BiCalendar size={16} />,
      render: (value) => <span className="date-cell">{value}</span>,
    },
    {
      key: "checkOut",
      header: "Check Out",
      type: "date",
      required: true,
      colSize: 6,
      icon: <BiCalendar size={16} />,
      render: (value) => <span className="date-cell">{value}</span>,
    },
    {
      key: "payment",
      header: "Payment",
      // type: "badge",
      badgeVariant: (value) => (value === "Paid" ? "success" : "warning"),
      type: "select",
      options: [
        { value: "Unpaid", label: "Unpaid" },
        { value: "Paid", label: "Paid" },
      ],
      defaultValue: "Unpaid",
      colSize: 6,
      icon: <BiCreditCard size={16} />,
      render: (value) => (
        <span
          className={`badge ${value === "Paid" ? "bg-success" : "bg-warning"}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "mobile",
      header: "Mobile",
      searchable: true,
      type: "tel",
      required: true,
      placeholder: "Enter mobile number",
      colSize: 6,
      icon: <BiPhoneCall size={16} />,
      render: (value) => (
        <div className="mobile-info">
          <BiPhone size={14} className="phone-icon" />
          <span>{value}</span>
        </div>
      ),
    },
  ];

  const handleAdd = (newBooking) => {
    const booking = {
      ...newBooking,
      avatar: "👤",
    };
    setBookingsData((prev) => [...prev, booking]);
  };

  const handleEdit = (booking) => {
    alert(`Edit booking for ${booking.name}`);
  };

  const handleDelete = (booking) => {
    if (
      window.confirm(
        `Are you sure you want to delete booking for ${booking.name}?`
      )
    ) {
      setBookingsData((prev) => prev.filter((b) => b.id !== booking.id));
    }
  };

  const handleView = (booking) => {
    alert(`View details for ${booking.name}`);
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <ReusableDataTable
      data={bookingsData}
      columns={columns}
      title="Hotel Bookings"
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      onRefresh={handleRefresh}
      addModalTitle="Add New Booking"
    />
  );
};

export default BookingsExample;
