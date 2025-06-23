import React, { useState } from "react";
import { ReusableDataTable } from "../../../common_components/Resuable-table/ResuableTable";
import {
  BiCalendar,
  BiCreditCard,
  BiHome,
  BiPhone,
  BiPhoneCall,
} from "react-icons/bi";

const AllRooms = () => {
  const [bookingsData, setBookingsData] = useState([
    {
      id: 1,
      image: "/room/single.jpg",
      roomNo: "101",
      roomType: "Single",
      ac_nonac: "Non-AC",
      bed_capacity: "1",
      status: "Booked",
      rent: "1200",
      mobile: "9876543210",
    },
    {
      id: 2,
      image: "/room/super-delux.jpg",
      roomNo: "102",
      roomType: "Super Delux",
      ac_nonac: "AC",
      bed_capacity: "4",
      status: "Available",
      rent: "4000",
      mobile: "9123456780",
    },
    {
      id: 3,
      image: "/room/delux.jpg",
      roomNo: "103",
      roomType: "Delux",
      ac_nonac: "AC",
      bed_capacity: "2",
      status: "Booked",
      rent: "2000",
      mobile: "9988776655",
    },
    {
      id: 4,
      image: "/room/single.jpg",
      roomNo: "104",
      roomType: "Single",
      ac_nonac: "AC",
      bed_capacity: "1",
      status: "Available",
      rent: "1500",
      mobile: "9012345678",
    },
    {
      id: 5,
      image: "/room/super-delux.jpg",
      roomNo: "105",
      roomType: "Super Delux",
      ac_nonac: "Non-AC",
      bed_capacity: "3",
      status: "Booked",
      rent: "3800",
      mobile: "9090909090",
    },
    {
      id: 6,
      image: "/room/delux.jpg",
      roomNo: "106",
      roomType: "Delux",
      ac_nonac: "Non-AC",
      bed_capacity: "2",
      status: "Booked",
      rent: "1800",
      mobile: "8765432109",
    },
    {
      id: 7,
      image: "/room/single.jpg",
      roomNo: "107",
      roomType: "Single",
      ac_nonac: "AC",
      bed_capacity: "1",
      status: "Booked",
      rent: "1400",
      mobile: "9345678901",
    },
    {
      id: 8,
      image: "/room/super-delux.jpg",
      roomNo: "108",
      roomType: "Super Delux",
      ac_nonac: "AC",
      bed_capacity: "5",
      status: "Available",
      rent: "4200",
      mobile: "7894561230",
    },
    {
      id: 9,
      image: "/room/delux.jpg",
      roomNo: "109",
      roomType: "Delux",
      ac_nonac: "AC",
      bed_capacity: "2",
      status: "Booked",
      rent: "2100",
      mobile: "9988001122",
    },
    {
      id: 10,
      image: "/room/single.jpg",
      roomNo: "110",
      roomType: "Single",
      ac_nonac: "Non-AC",
      bed_capacity: "1",
      status: "Available",
      rent: "1300",
      mobile: "9345098701",
    },
    {
      id: 11,
      image: "/room/super-delux.jpg",
      roomNo: "111",
      roomType: "Super Delux",
      ac_nonac: "AC",
      bed_capacity: "4",
      status: "Booked",
      rent: "3900",
      mobile: "9091234567",
    },
  ]);

  // Add the missing state
  const [openDropdown, setOpenDropdown] = useState(null);

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (value, item) => (
        <div className="room-image">
          <img
            src={value || "/room/single.jpg"}
            alt={`Room ${item.roomNo}`}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "50px",
            }}
          />
        </div>
      ),
      colSize: 6,
      addable: false,
    },
    {
      key: "roomNo",
      header: "Room No",
      searchable: true,
      required: true,
      placeholder: "Enter room number",
      colSize: 6,
      render: (value) => <span className="room-number">{value}</span>,
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
      key: "ac_nonac",
      header: "AC/Non-AC",
      type: "select",
      options: [
        { value: "AC", label: "AC" },
        { value: "Non-AC", label: "Non-AC" },
      ],
      defaultValue: "AC",
      colSize: 6,
      render: (value) => <span className="ac-type">{value}</span>,
    },
    {
      key: "bed_capacity",
      header: "Bed Capacity",
      type: "select",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ],
      defaultValue: "1",
      colSize: 6,
      render: (value) => <span className="bed-capacity">{value} Bed(s)</span>,
    },
    {
      key: "status",
      header: "Status",
      searchable: true,
      badgeVariant: (value) => {
        const variants = {
          Available: "success",
          Booked: "booked",
          Primary: "primary",
          Occupied: "warning",
          Maintenance: "danger",
        };
        return variants[value] || "primary";
      },
      type: "select",
      options: [
        { value: "Available", label: "Available" },
        { value: "Booked", label: "Booked" },
        { value: "Occupied", label: "Occupied" },
        { value: "Maintenance", label: "Maintenance" },
      ],
      defaultValue: "Available",
      colSize: 6,
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: "rent",
      header: "Rent",
      type: "number",
      required: true,
      placeholder: "Enter rent amount",
      colSize: 6,
      icon: <BiCreditCard size={16} />,
      render: (value) => <span className="rent-amount">₹{value}</span>,
    },
    {
      key: "mobile",
      header: "Contact",
      searchable: true,
      type: "tel",
      placeholder: "Enter contact number",
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

  const handleAdd = (newRoom) => {
    const room = {
      ...newRoom,
      image: "/default-room.jpg", // Default image
    };
    setBookingsData((prev) => [...prev, room]);
  };

  const handleEdit = (room) => {
    alert(`Edit room ${room.roomNo}`);
  };

  const handleDelete = (room) => {
    if (
      window.confirm(`Are you sure you want to delete room ${room.roomNo}?`)
    ) {
      setBookingsData((prev) => prev.filter((r) => r.id !== room.id));
    }
  };

  const handleView = (room) => {
    alert(`View details for room ${room.roomNo}`);
  };

  const handleRefresh = () => {
    console.log("Refreshing room data...");
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
      title="All Rooms"
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      onRefresh={handleRefresh}
      addModalTitle="Add New Room"
    />
  );
};

export default AllRooms;
