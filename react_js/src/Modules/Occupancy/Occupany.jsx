import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../store/Slices/Room/RoomSlice";
import { selectFilteredRooms } from "../../store/Slices/Room/Selector";
import OccupancyFilters from "../../common_components/occupancy-filters/OccupancyFilters";
import { RxCross1 } from "react-icons/rx";
import { BiCalendar, BiMessageSquare, BiUser } from "react-icons/bi";

import styles from "./Occupancy.module.css";

const Occupancy = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const rooms = useSelector(selectFilteredRooms);

  const openModal = (room) => {
    setSelectedRoom(room);
    setActiveTab("personal");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const renderTabContent = () => {
    if (!selectedRoom?.guest) return null;

    const { guest } = selectedRoom;

    switch (activeTab) {
      case "personal":
        return (
          <div className={styles.guestInfo}>
            <div className={styles.infoItem}>
              <strong>Name: </strong>
              <span>{guest.name}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Address: </strong>
              <span>{guest.address}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Phone: </strong>
              <span>{guest.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Email: </strong>
              <span>{guest.email}</span>
            </div>
          </div>
        );
      case "reservation":
        return (
          <div className={styles.guestInfo}>
            <div className={styles.infoItem}>
              <strong>Check-In Date: </strong>
              <span>{guest.checkIn}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Check-Out Date: </strong>
              <span>{guest.checkOut}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Booking Reference: </strong>
              <span>{guest.bookingRef}</span>
            </div>
          </div>
        );
      case "special":
        return (
          <div className={styles.guestInfo}>
            <div className={styles.infoItem}>
              <strong>Special Requests: </strong>
              <p className={styles.mt2}>{guest.specialRequests}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ [filterType]: value }));
  };

  return (
    <>
      <div className={styles.roomCardsContainer}>
        <div className={styles.container}>
          <OccupancyFilters onFilterChange={handleFilterChange} />

          <div className={styles.row}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.roomInfo}>
                    <h3>Room</h3>
                    <h2>{room.id}</h2>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      room.status === "booked"
                        ? styles.statusBooked
                        : styles.statusAvailable
                    }`}
                  >
                    {room.status === "booked" ? "Booked" : "Available"}
                  </span>
                </div>

                <div className={styles.roomDetails}>
                  <h4 className={styles.roomType}>{room.type}</h4>
                  <p className={styles.roomDetail}>{room.bedType}</p>
                  <p className={styles.roomDetail}>{room.capacity}</p>
                </div>

                <button
                  className={styles.cardButton}
                  onClick={() =>
                    room.status === "booked" ? openModal(room) : null
                  }
                >
                  {room.status === "booked" ? "Guest Details" : "Add Guest"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Room # {selectedRoom?.id}</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <RxCross1 size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.tabNav}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "personal" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("personal")}
                >
                  <BiUser size={16} />
                  <span>Personal Info</span>
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "reservation" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("reservation")}
                >
                  <BiCalendar size={16} />
                  <span>Reservation Info</span>
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "special" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("special")}
                >
                  <BiMessageSquare size={16} />
                  <span>Special Requests</span>
                </button>
              </div>

              <div className={styles.tabContent}>{renderTabContent()}</div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={`${styles.footerButton} ${styles.btnOutline}`}
                onClick={closeModal}
              >
                Edit Guest
              </button>
              <button
                className={`${styles.footerButton} ${styles.btnPrimary}`}
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Occupancy;
