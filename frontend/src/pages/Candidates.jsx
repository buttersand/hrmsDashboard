import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Candidates.css";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    jobRole: "",
    experience: "",
    resume: null,
  });

  const [filters, setFilters] = useState({
    status: "",
    position: "",
    search: "",
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          `${process.env.BACKEND_URL}/api/candidates`
        );
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) return alert("Please agree to the declaration");

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("jobRole", formData.jobRole || formData.position);
    form.append("experience", formData.experience);

    if (formData.resume) {
      form.append("resume", formData.resume);
    }

    try {
      const res = await axios.post(
        `${process.env.BACKEND_URL}/api/candidates`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setShowModal(false);
      setCandidates((prev) => [...prev, res.data]);
      setFormData({
        name: "",
        phone: "",
        email: "",
        jobRole: "",
        experience: "",
        resume: null,
      });
      setIsChecked(false);
      alert("Candidate added successfully!");
    } catch (err) {
      console.error("Failed to submit candidate:", err);
      alert("Failed to add candidate. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.BACKEND_URL}/api/candidates/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      alert("Candidate deleted");
    } catch (err) {
      console.error("Failed to delete candidate", err);
    }
  };

  const handleDownload = (fileName) => {
    window.open(
      `${process.env.BACKEND_URL}/api/candidates/download/${fileName}`,
      "_blank"
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.BACKEND_URL}/api/candidates/${id}`, {
        status: newStatus,
      });
      setCandidates((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus =
      !filters.status ||
      candidate.status?.toLowerCase() === filters.status.toLowerCase();
    const matchesPosition =
      !filters.position ||
      candidate.jobRole?.toLowerCase() === filters.position.toLowerCase();
    const matchesSearch =
      !filters.search ||
      candidate.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPosition && matchesSearch;
  });

  return (
    <div className="container">
      <div className="candidate-header">
        <div className="actions">
          <div className="filters">
            <select
              name="status"
              onChange={handleFilterChange}
              value={filters.status}
            >
              <option value="">Status</option>
              <option>New</option>
              <option>Scheduled</option>
              <option>Ongoing</option>
              <option>Selected</option>
              <option>Rejected</option>
            </select>
            <select
              name="position"
              onChange={handleFilterChange}
              value={filters.position}
            >
              <option value="">Position</option>
              <option>Designer</option>
              <option>Developer</option>
              <option>Human Resource</option>
            </select>
          </div>
          <div className="filters">
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
            <button className="add-btn" onClick={() => setShowModal(true)}>
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>Candidates Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates?.map((item, index) => (
            <tr key={item._id}>
              <td>{`0${index + 1}`}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.jobRole}</td>
              <td className="filters">
                <select
                  className={`status ${item.status?.toLowerCase()}`}
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                >
                  <option>New</option>
                  <option>Scheduled</option>
                  <option>Ongoing</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>
              </td>
              <td>{item.experience}</td>
              <td>
                <div className="menu-wrapper">
                  <button
                    onClick={() => toggleMenu(item._id)}
                    className="menu-btn"
                  >
                    ⋮
                  </button>
                  {menuOpen === item._id && (
                    <div className="dropdown">
                      <button onClick={() => handleDownload(item.resumeUrl)}>
                        Download Resume
                      </button>
                      <button onClick={() => handleDelete(item._id)}>
                        Delete Candidate
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ color: "white" }}>Add New Candidate</h3>
              <button
                className="candidate-close-btn"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                    name="name"
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
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Position<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobRole"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Experience<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Resume<span className="required">*</span>
                  </label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      name="resume"
                      id="resume"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="checkbox-container">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    I hereby declare that the above information is true to the
                    best of my knowledge and belief
                  </span>
                </label>
              </div>
              <div className="modal-buttons">
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

export default Candidates;
