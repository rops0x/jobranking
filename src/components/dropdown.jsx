import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect } from "react";

const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9]/g, "_");

const Dropdown = ({ data, onSelect, reset }) => {
  const [selectedCriteria, setSelectedCriteria] = useState("Select Criteria");

  useEffect(() => {
    if (reset) {
      setSelectedCriteria("Select Criteria");
    }
  }, [reset]);

  const items =
    data && data[0]
      ? Object.keys(data[0]).filter((key) => typeof data[0][key] === "string")
      : [];

  const handleSelect = (item) => {
    const sanitizedKey = sanitizeKey(item);
    onSelect(sanitizedKey);
    setSelectedCriteria(item);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Select Criteria
      </button>
      <ul className="dropdown-menu">
        {items.map((item) => (
          <li key={item}>
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSelect(item);
              }}
            >
              <span style={{ marginRight: "4px" }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="darkgrey"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="12" r="4" />
                  <circle cx="10" cy="4" r="4" />
                  <circle cx="15" cy="12" r="4" />
                </svg>
              </span>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
