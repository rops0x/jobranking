import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingDescription: false,
      description: "",
    };
  }

  handleEditDescriptionClick = () => {
    this.setState({ isEditingDescription: true });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSaveDescriptionClick = () => {
    this.setState({ isEditingDescription: false });
  };

  render() {
    const { isEditingDescription, description } = this.state;

    return (
      <div className="card" style={{ width: "" }}>
        <div className="card-header">Profile</div>
        <div className="card-body">
          <h4 className="card-title">John Doe</h4>
          {isEditingDescription ? (
            <div>
              <textarea
                className="form-control"
                value={description}
                onChange={this.handleDescriptionChange}
              />
              <button
                className="btn btn-success mt-2"
                onClick={this.handleSaveDescriptionClick}
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              {description ? (
                <p className="card-text">{description}</p>
              ) : (
                <p
                  className="card-text"
                  style={{ color: "darkgrey", fontStyle: "italic" }}
                >
                  My goal is ...
                </p>
              )}
              <button
                className={`btn ${description ? "btn-light" : "btn-secondary"}`}
                onClick={
                  description
                    ? this.handleEditDescriptionClick
                    : this.handleEditDescriptionClick
                }
                data-bs-toggle="tooltip" // Enable the tooltip
                data-bs-placement="top" // Set the tooltip placement
                title="Click to edit your job seeking goal" // Tooltip text
              >
                {description ? "Edit Description" : "Add your job seeking goal"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
