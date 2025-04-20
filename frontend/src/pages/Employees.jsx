import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", // Changed from name to fullName to match the backend model
    email: "",
    phone: "",
    position: "",
    department: "",
    dateOfJoining: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/employees`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If editing existing employee
      if (formData.id) {
        const res = await axios.put(
          `${process.env.BACKEND_URL}/api/employees/${formData.id}`,
          {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            department: formData.department,
            dateOfJoining: formData.dateOfJoining,
          }
        );

        setEmployees((prev) =>
          prev.map((emp) => (emp._id === formData.id ? res.data : emp))
        );
      }
      // If adding new employee
      else {
        const res = await axios.post(
          `${process.env.BACKEND_URL}/api/employees`,
          {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            department: formData.department,
            dateOfJoining: formData.dateOfJoining,
          }
        );

        setEmployees((prev) => [...prev, res.data]);
      }

      setShowModal(false);
      resetForm();
      alert(
        formData.id
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );
    } catch (err) {
      console.error("Failed to submit employee data:", err);
      alert(
        "Error: " + (err.response?.data?.message || "Something went wrong")
      );
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      dateOfJoining: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${process.env.BACKEND_URL}/api/employees/${id}`);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        alert("Employee deleted successfully");
      } catch (err) {
        console.error("Failed to delete employee", err);
      }
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      id: employee._id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      dateOfJoining: employee.dateOfJoining
        ? employee.dateOfJoining.split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${String(
      date.getFullYear()
    ).slice(2)}`;
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition =
      selectedPosition === "" || employee.position === selectedPosition;

    return matchesSearch && matchesPosition;
  });

  return (
    <div className="container">
      <div className="employee-header">
        <div className="filters-row">
          <div className="position-filter">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option disabled value="">
                Position
              </option>
              <option value="">All</option>
              <option value="Intern">Intern</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Full Time">Full Time</option>
            </select>
          </div>

          <div className="search-add-group">
            <div className="search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#777"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="border-0 outline-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="add-btn"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td className="profile-cell">
                  <div className="profile-pic">
                    <img
                      src={`https://i.pravatar.cc/32?u=${employee._id}`}
                      alt={employee.fullName}
                    />
                  </div>
                </td>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{formatDate(employee.dateOfJoining)}</td>
                <td>
                  <div className="menu-wrapper">
                    <button
                      onClick={() => toggleMenu(employee._id)}
                      className="menu-btn"
                    >
                      ⋮
                    </button>
                    {menuOpen === employee._id && (
                      <div className="dropdown">
                        <button onClick={() => handleEdit(employee)}>
                          Edit Employee
                        </button>
                        <button onClick={() => handleDelete(employee._id)}>
                          Delete Employee
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ color: "white" }}>
                {formData.id ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                className="candidate-close-btn"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Full Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Email Address<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Phone Number<span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Position<span className="required">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Position</option>
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Full Time">Full Time</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Department<span className="required">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Designer">Designer</option>
                    <option value="Backend Development">
                      Backend Development
                    </option>
                    <option value="Frontend Development">
                      Frontend Development
                    </option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Date of Joining<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {formData.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
