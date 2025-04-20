import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../Leave.css";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ status: "All", search: "" });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    employeeId: "",
    designation: "",
    date: "",
    reason: "",
    status: "Pending",
    document: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesRes, empsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/leaves"),
          axios.get("http://localhost:5000/api/employees"),
        ]);
        setLeaves(leavesRes.data);
        setEmployees(empsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  console.log(employees);

  useEffect(() => {
    if (searchTerm) {
      setFilteredEmployees(
        employees.filter((e) =>
          e.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredEmployees([]);
    }
  }, [searchTerm, employees]);

  const leavesByDate = useMemo(() => {
    return leaves.reduce((acc, l) => {
      const raw = l.leaveDate ?? l.date;
      const dt = new Date(raw);
      dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
      const key = dt.toISOString().slice(0, 10);
      acc[key] = acc[key] || [];
      acc[key].push({ ...l, leaveDate: dt });
      return acc;
    }, {});
  }, [leaves]);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const daysArray = useMemo(() => {
    const firstIndex = new Date(year, month, 1).getDay();
    const total = getDaysInMonth(year, month);
    const arr = Array(firstIndex).fill(null);
    for (let d = 1; d <= total; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(
      2
    )}`;
  };

  const currentMonthName = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEmployeeSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowEmployeeDropdown(true);
  };

  const selectEmployee = (emp) => {
    setFormData((f) => ({
      ...f,
      employee: emp.fullName,
      employeeId: emp._id,
      designation: emp.position,
    }));
    setSearchTerm(emp.fullName);
    setShowEmployeeDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("employee", formData.employeeId);
    form.append("leaveDate", formData.date);
    form.append("reason", formData.reason);
    form.append("status", formData.status);
    if (formData.document) form.append("document", formData.document);

    try {
      await axios.post("http://localhost:5000/api/leaves", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowModal(false);
      setFormData({
        employee: "",
        employeeId: "",
        designation: "",
        date: "",
        reason: "",
        status: "Pending",
        document: null,
      });
      const { data } = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(data);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/leaves/${id}`, {
        status: newStatus,
      });
      const { data } = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (path) => {
    if (path) window.open(`http://localhost:5000/${path}`, "_blank");
  };

  const filteredList = leaves.filter((l) => {
    const okStatus = filters.status === "All" || l.status === filters.status;
    const okSearch = l.employee.fullName
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    return okStatus && okSearch;
  });

  const approvedOnDate = (leavesByDate[selectedDate] || []).filter(
    (l) => l.status === "Approved"
  );

  return (
    <div className="leave-management-container">
      <div className="top-controls">
        <div className="flex items-center gap-6">
          <div className="filters">
            <select
              name="status"
              onChange={handleFilterChange}
              value={filters.status}
            >
              <option value="All">Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

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
              name="search"
              placeholder="Search"
              value={filters.search}
              onChange={handleFilterChange}
              className="border-0 outline-0"
            />
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add Leave
        </button>
      </div>
      <div className="content-panels">
        <div className="list-panel">
          <h2>Applied Leaves</h2>
          <table className="shadow-none rounded-none table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Docs</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length ? (
                filteredList.map((l) => (
                  <tr key={l._id}>
                    <td>
                      <img
                        src={`https://i.pravatar.cc/40?u=${l.employee._id}`}
                        alt=""
                        className="profile-avatar"
                      />
                    </td>
                    <td>
                      <div className="employee-name">{l.employee.fullName}</div>
                      <div className="position">{l.employee.position}</div>
                    </td>
                    <td>{formatDate(l.leaveDate)}</td>
                    <td>{l.reason}</td>
                    <td className="filter">
                      <div
                        className={`status-dropdown-cell ${l.status.toLowerCase()}`}
                      >
                        <select
                          value={l.status}
                          onChange={(e) =>
                            handleStatusChange(l._id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option>Pending</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      {l.document ? (
                        <button
                          className="doc-button"
                          onClick={() => handleDownload(l.document)}
                        >
                          📄
                        </button>
                      ) : (
                        <span className="no-doc">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No leaves found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="calendar-panel">
          <h2>Leave Calendar</h2>
          <div className="calendar-navigation">
            <button onClick={handlePrevMonth} className="nav-button">
              &lt;
            </button>
            <h3>
              {currentMonthName}, {year}
            </h3>
            <button onClick={handleNextMonth} className="nav-button">
              &gt;
            </button>
          </div>
          <div className="calendar">
            <div className="weekdays">
              {["S", "M", "T", "W", "T", "F", "S"].map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>
            <div className="days-grid">
              {daysArray.map((day, idx) =>
                day ? (
                  <div
                    key={idx}
                    className={`day-cell ${
                      day.toISOString().slice(0, 10) === selectedDate
                        ? "selected"
                        : ""
                    } ${
                      leavesByDate[day.toISOString().slice(0, 10)]
                        ? "has-leaves"
                        : ""
                    } ${
                      day.toDateString() === today.toDateString() ? "today" : ""
                    }`}
                    onClick={() =>
                      setSelectedDate(day.toISOString().slice(0, 10))
                    }
                  >
                    <span>{day.getDate()}</span>
                    {leavesByDate[day.toISOString().slice(0, 10)] && (
                      <div className="day-badge">
                        {leavesByDate[day.toISOString().slice(0, 10)].length}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={idx} className="day-cell empty" />
                )
              )}
            </div>
          </div>

          <div className="approved-leaves">
            <h3>Approved Leaves</h3>
            {approvedOnDate.length ? (
              approvedOnDate.map((l) => (
                <div key={l._id} className="approved-item">
                  <img
                    src={`https://i.pravatar.cc/40?u=${l.employee._id}`}
                    alt=""
                    className="profile-avatar"
                  />
                  <div className="approved-info">
                    <div className="employee-name">{l.employee.fullName}</div>
                    <div className="position">{l.employee.position}</div>
                  </div>
                  <div className="approved-date">{formatDate(l.leaveDate)}</div>
                </div>
              ))
            ) : (
              <p className="no-data">No approved leaves</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Leave</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-2">
              <div className="col-span-6 form-group">
                <label>Employee</label>
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={handleEmployeeSearch}
                  onFocus={() => setShowEmployeeDropdown(true)}
                />
                {showEmployeeDropdown && filteredEmployees.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp._id}
                        className="flex items-center gap-4 text-sm"
                        onClick={() => selectEmployee(emp)}
                      >
                        <img
                          src={`https://i.pravatar.cc/30?u=${emp._id}`}
                          alt=""
                          className="rounded-full w-9 h-9"
                        />
                        <div>
                          <div className="font-semibold">{emp.fullName}</div>
                          <div className="">{emp.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-6 form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  readOnly
                  value={formData.designation}
                />
              </div>

              <div className="col-span-6 form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-6 form-group">
                <label>Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-6 form-group">
                <label>Document</label>
                <input
                  type="file"
                  name="document"
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-12 flex items-center justify-end gap-4">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
