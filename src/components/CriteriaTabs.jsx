import React, { useState } from "react";
import criterias from "../criterias.json"; // Adjust the path as needed

const CriteriaTabs = () => {
  const [activeTab, setActiveTab] = useState(0); // Local state for active tab

  return (
    <>
      <div
        className=""
        style={{
          padding: "24px",
          border: "1px solid lightgrey",
          borderRadius: "9px",
          background: "white",
        }}
      >
        <h3 className="">Criteria that are important for me in a job</h3>
        <ul className="nav nav-tabs">
          {criterias.map((criteria, index) => (
            <li className="nav-item" key={index}>
              <a
                className={`nav-link ${activeTab === index ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(index);
                }}
                href={`#tab${index}`}
              >
                {criteria.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content mt-2">
          {criterias.map((criteria, index) => (
            <div
              className={`tab-pane fade ${
                activeTab === index ? "show active" : ""
              }`}
              id={`tab${index}`}
              key={index}
            >
              <div className="text-wrap" style={{ maxWidth: "800px" }}>
                {criteria.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CriteriaTabs;
