import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Attendance.css";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAllAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}api/employees`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAllAttendance = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/attendance`
      );
      setAttendances(response.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const fetchEmployeeAttendanceHistory = async (employeeId) => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/attendance/employee/${employeeId}`
      );
      setAttendanceHistory(response.data);
      setSelectedEmployeeId(employeeId);
      setShowAttendanceHistory(true);
    } catch (error) {
      console.error("Error fetching employee attendance history:", error);
    }
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleStatusChange = async (employeeId, status) => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/api/attendance/mark`,
        {
          employeeId,
          status,
        }
      );

      fetchAllAttendance();

      setMenuOpen(null);
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to update attendance status");
    }
  };

  const handleDeleteAttendance = async (attendanceId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      try {
        await axios.delete(
          `${process.env.BACKEND_URL}/api/attendance/${attendanceId}`
        );
        setAttendances((prev) =>
          prev.filter((att) => att._id !== attendanceId)
        );
        alert("Attendance record deleted successfully");
      } catch (err) {
        console.error("Failed to delete attendance record", err);
      }
    }
  };

  const combineEmployeeAttendance = () => {
    return employees.map((employee) => {
      const attendanceRecord = attendances.find(
        (att) =>
          att.employee?._id === employee._id || att.employee === employee._id
      );

      return {
        ...employee,
        attendanceId: attendanceRecord?._id || null,
        status: attendanceRecord?.status || "--",
        task: getEmployeeTask(employee),
      };
    });
  };

  const getEmployeeTask = (employee) => {
    if (employee.department === "Designer") {
      return employee.position === "Full Time"
        ? "Dashboard Home page Alignment"
        : "Dashboard Login page design, Dashboard Home page design";
    } else if (employee.department === "Backend Development") {
      return employee.position === "Junior"
        ? "Dashboard login page integration"
        : "--";
    } else if (employee.department === "Human Resource") {
      return "4 scheduled interview, Sorting of resumes";
    }
    return "--";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const filteredEmployees = combineEmployeeAttendance().filter((employee) => {
    const matchesSearch =
      employee?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee?.task &&
        employee.task.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "" || employee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const closeHistoryModal = () => {
    setShowAttendanceHistory(false);
    setAttendanceHistory([]);
    setSelectedEmployeeId(null);
  };

  return (
    <div className="container">
      <div className="attendance-header">
        <div className="filters-row">
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Work from Home">Work from Home</option>
            </select>
          </div>

          <div className="search-container">
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
          </div>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
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
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.task}</td>
                <td>
                  <div className="status-wrapper">
                    <button
                      className={`status-button ${employee.status.toLowerCase()}`}
                      onClick={() => toggleMenu(`status_${employee._id}`)}
                    >
                      {employee.status}{" "}
                      <span className="dropdown-arrow">▼</span>
                    </button>
                    {menuOpen === `status_${employee._id}` && (
                      <div className="status-dropdown">
                        <div
                          onClick={() =>
                            handleStatusChange(employee._id, "Present")
                          }
                        >
                          Present
                        </div>
                        <div
                          onClick={() =>
                            handleStatusChange(employee._id, "Absent")
                          }
                        >
                          Absent
                        </div>
                        <div
                          onClick={() =>
                            handleStatusChange(employee._id, "Medical Leave")
                          }
                        >
                          Medical Leave
                        </div>
                        <div
                          onClick={() =>
                            handleStatusChange(employee._id, "Work from Home")
                          }
                        >
                          Work from Home
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="menu-wrapper">
                    <button
                      onClick={() => toggleMenu(`action_${employee._id}`)}
                      className="menu-btn"
                    >
                      ⋮
                    </button>
                    {menuOpen === `action_${employee._id}` && (
                      <div className="dropdown">
                        <button
                          onClick={() =>
                            fetchEmployeeAttendanceHistory(employee._id)
                          }
                        >
                          Edit Record
                        </button>
                        {employee.attendanceId && (
                          <button
                            onClick={() =>
                              handleDeleteAttendance(employee.attendanceId)
                            }
                          >
                            Delete Record
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

      {showAttendanceHistory && (
        <div className="modal-overlay">
          <div className="modal history-modal">
            <div className="modal-header">
              <h2>Attendance History</h2>
              <button className="close-btn" onClick={closeHistoryModal}>
                ×
              </button>
            </div>
            <div className="history-content">
              {attendanceHistory.length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record) => (
                      <tr key={record._id}>
                        <td>
                          {formatDate(record.updatedAt || record.createdAt)}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${record.status.toLowerCase()}`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-records">No attendance records found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
