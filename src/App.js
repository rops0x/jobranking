import React, { Component } from "react";
import "./App.css";
import jobsDataStatic from "./jobsdata.json";
import ScoringVisualization from "./components/ScoringVisualization";
import Dropdown from "./components/dropdown";
import LineUp from "./components/LineUpView";
import CriteriaTabs from "./components/CriteriaTabs";
import Profile from "./components/Profile";

class App extends Component {
  state = {
    selectedKey: null,
    jobsData: jobsDataStatic,
    showVisualization: false,
  };

  handleDropdownSelect = (key) => {
    this.setState({
      selectedKey: key,
      showVisualization: true, // Show the visualization again
    });
  };

  handleCloseVisualization = () => {
    this.setState({ showVisualization: false });
  };

  handleAddScores = (scores) => {
    //console.log("Selected key show " + this.state.selectedKey)

    const updatedJobsData = this.state.jobsData.map((job) => {
      if (scores[job[this.state.selectedKey]] !== null) {
        job[`${this.state.selectedKey}Score`] =
          scores[job[this.state.selectedKey]];
      }
      return job;
    });

    this.setState({ jobsData: updatedJobsData });
  };

  render() {
    console.log("APP rendered");
    return (
      <div className="container-fluid bg-light">
        <h1 className="mt-5" style={{ textAlign: "left" }}>
          Job Ranking Tool
        </h1>

        {/* Use the CriteriaTabs component */}

        <div className="container-fluid mt-3" style={{}}>
          <div className="row gx-3">
            {" "}
            {/* Added Bootstrap row and no-gutters class to remove padding */}
            <div className="col-md-2" style={{}}>
              {" "}
              {/* Adjusted to 1/3 of the container width */}
              <Profile />
              <div className="card mt-2" style={{ width: "" }}>
                <div className="card-header">
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
                  Preference Score
                </div>

                <div className="card-body">
                  <h5 className="card-title">
                    Include
                    <span style={{ marginRight: "4px", marginLeft: "4px" }}>
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
                    non-numeric criteria in ranking as a number
                    <span style={{ color: "darkgrey" }}> #</span>
                  </h5>

                  <p className="card-text">
                    Select a criteria to create a Preference Score for
                    non-numeric criteria.
                  </p>
                  <Dropdown
                    data={this.state.jobsData}
                    onSelect={this.handleDropdownSelect}
                  />

                  <button
                    className="btn btn-outline-info mt-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#scoringDescription"
                    aria-expanded="false"
                    aria-controls="scoringDescription"
                  >
                    Read More
                  </button>
                  <div className="collapse mt-1" id="scoringDescription">
                    <div className="card card-body">
                      {/* Insert the provided description here */}
                      <p>
                        Including qualitative criteria in the ranking as number
                        can give you a better understanding how much it affects
                        your decision and its significance to you.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-10">
              <CriteriaTabs /> {/* Adjusted to 2/3 of the container width */}
              {this.state.showVisualization && (
                <ScoringVisualization
                  data={this.state.jobsData}
                  selectedKey={this.state.selectedKey}
                  onAddScores={this.handleAddScores}
                  onClose={this.handleCloseVisualization}
                />
              )}
              <div
                style={{
                  marginTop: "24px",
                  marginBottom: "24px",
                  padding: "24px",
                  border: "1px solid lightgrey",
                  borderRadius: "9px",
                  background: "white",
                }}
              >
                <h3 className="">Jobs List</h3>
                <p
                  style={{
                    borderBottom: "1px solid lightgrey",
                    paddingBottom: "8px",
                  }}
                >
                  <em>
                    Manipulate the visualization to find your prefered job.{" "}
                  </em>
                </p>
                <LineUp
                  data={this.state.jobsData}
                  sel={this.state.selectedKey}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
