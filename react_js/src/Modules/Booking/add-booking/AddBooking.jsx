import { useForm } from "react-hook-form";
import { IoMdCloudUpload } from "react-icons/io";

import "./AddBooking.css";

const AddBooking = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Booking submitted successfully!");
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className="booking-container">
      {/* Form Container */}
      <div className="form-container-new border">
        <h2>Add Booking</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name*</label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={errors.firstName ? "error" : ""}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <span className="error-text">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                {...register("lastName")}
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                })}
                className={errors.email ? "error" : ""}
                placeholder="Enter email address"
              />
              {errors.email && (
                <span className="error-text">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender*</label>
              <select
                id="gender"
                {...register("gender", { required: "Gender is required" })}
                className={errors.gender ? "error" : ""}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="error-text">{errors.gender.message}</span>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mobile">Mobile*</label>
              <input
                type="tel"
                id="mobile"
                {...register("mobile", {
                  required: "Mobile is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a 10-digit mobile number",
                  },
                })}
                className={errors.mobile ? "error" : ""}
                placeholder="Enter mobile number"
              />
              {errors.mobile && (
                <span className="error-text">{errors.mobile.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                {...register("city", { required: "City is required" })}
                className={errors.city ? "error" : ""}
                placeholder="Enter city"
              />
              {errors.city && (
                <span className="error-text">{errors.city.message}</span>
              )}
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkInOut">
                Enter Check In & Check Out Date*
              </label>
              <input
                type="text"
                id="checkInOut"
                {...register("checkInOut", {
                  required: "Check-in/Check-out date is required",
                })}
                className={errors.checkInOut ? "error" : ""}
                placeholder="Select dates"
              />
              {errors.checkInOut && (
                <span className="error-text">{errors.checkInOut.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="packageType">Select Package Type*</label>
              <select
                id="packageType"
                {...register("packageType", {
                  required: "Package type is required",
                })}
                className={errors.packageType ? "error" : ""}
              >
                <option value="">Select Package Type</option>
                <option value="standard">Standard Package</option>
                <option value="deluxe">Deluxe Package</option>
                <option value="premium">Premium Package</option>
                <option value="suite">Suite Package</option>
              </select>
              {errors.packageType && (
                <span className="error-text">{errors.packageType.message}</span>
              )}
            </div>
          </div>

          {/* Row 5 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalPerson">Total Person*</label>
              <input
                type="number"
                id="totalPerson"
                {...register("totalPerson", {
                  required: "Total person is required",
                  min: {
                    value: 1,
                    message: "Minimum 1 person required",
                  },
                })}
                className={errors.totalPerson ? "error" : ""}
                placeholder="Enter number of persons"
                min="1"
              />
              {errors.totalPerson && (
                <span className="error-text">{errors.totalPerson.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Select Room Type*</label>
              <select
                id="roomType"
                {...register("roomType", { required: "Room type is required" })}
                className={errors.roomType ? "error" : ""}
              >
                <option value="">Select Room Type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="triple">Triple Room</option>
                <option value="family">Family Room</option>
                <option value="suite">Suite</option>
              </select>
              {errors.roomType && (
                <span className="error-text">{errors.roomType.message}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              {...register("address")}
              placeholder="Enter full address"
              rows="3"
            />
          </div>

          {/* File Upload */}
          <div className="form-group full-width">
            <label>Upload</label>
            <div className="upload-area">
              <input
                type="file"
                id="fileUpload"
                {...register("uploadedFile")}
                className="file-input"
              />
              <label htmlFor="fileUpload" className="upload-label">
                <IoMdCloudUpload className="upload-icon" />
                <span>Choose file</span>
                <span className="upload-text">or drag and drop file here</span>
              </label>
              {watch("uploadedFile") && watch("uploadedFile").length > 0 && (
                <div className="file-info">
                  Selected: {watch("uploadedFile")[0]?.name}
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="form-group full-width">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              {...register("note")}
              placeholder="Add any additional notes"
              rows="4"
            />
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBooking;
