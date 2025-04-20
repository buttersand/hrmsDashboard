import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../Header.css";

export default function Header() {
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <header className="header">
      <div className="left">
        {pathname == "/"
          ? "Candidates"
          : capitalizeFirstLetter(pathname.split("/")[1])}
      </div>
      <div className="right">
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </span>
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </span>
        <div
          className="avatar-container"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img src="https://i.pravatar.cc/32" alt="avatar" className="avatar" />
          <span className="caret">▼</span>
          {dropdownOpen && (
            <div className="header-dropdown">
              <div className="header-dropdown-item">Edit Profile</div>
              <div className="header-dropdown-item">Manage Notifications</div>
              <div className="header-dropdown-item">Change Password</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
