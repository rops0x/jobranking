import React, { Component } from "react";
import * as d3 from "d3";
import "bootstrap/dist/css/bootstrap.css";

class ScoringVisualization extends Component {
  state = {
    scores: {},
    valPair: [],
    displayVisualization: true,
    showAlert: false,
  };

  svgRef = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedKey !== prevState.prevSelectedKey) {
      console.log("NEXT PROPS");
      console.log(nextProps.data);

      const uniqueItems = [
        ...new Set(nextProps.data.map((item) => item[nextProps.selectedKey])),
      ];
      console.log("Unique Items");
      console.log(uniqueItems);

      let initialScores = [];

      if (
        Object.keys(nextProps.data[0]).findIndex(
          (i) => i === nextProps.selectedKey + "Score"
        ) !== -1
      ) {
        initialScores = uniqueItems.reduce((acc, item) => {
          acc[item] =
            nextProps.data[
              nextProps.data.findIndex((i) => i[nextProps.selectedKey] === item)
            ][nextProps.selectedKey + "Score"];
          return acc;
        }, {});
      } else {
        initialScores = uniqueItems.reduce((acc, item) => {
          acc[item] = 50;
          return acc;
        }, {});
      }

      console.log(initialScores);
      return { scores: initialScores, prevSelectedKey: nextProps.selectedKey };
    }
    return null;
  }

  componentDidMount() {
    this.drawVisualization();
  }

  componentDidUpdate(prevProps) {
    console.log("UPDATE SCORE");
    console.log(this.props.data[0]);

    if (this.props.selectedKey !== prevProps.selectedKey) {
      d3.select(this.svgRef.current).selectAll("*").remove();
      this.drawVisualization();
    }
  }

  updateScores(itemName, score) {
    // Convert the score to an integer
    const updatedScores = { ...this.state.scores, [itemName]: parseInt(score) };
    this.setState({ scores: updatedScores });
  }

  drawVisualization() {
    d3.select(this.svgRef.current).selectAll("*").remove(); // Clear the SVG

    const { selectedKey, data } = this.props;

    if (!selectedKey || !data) return;

    const uniqueItems = [...new Set(data.map((item) => item[selectedKey]))];

    const minHeightPerItem = 50; // Minimum height for each item
    const totalItems = uniqueItems.length;
    const dynamicHeight = totalItems * minHeightPerItem; // Ensure SVG is never below 300px

    const margin = { top: 20, right: 250, bottom: 20, left: 100 },
      width = 800 - margin.left - margin.right,
      height = dynamicHeight - margin.top - margin.bottom;

    const svg = d3
      .select(this.svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 50) // Added extra space for the title and description
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (margin.top + 50) + ")"
      ); // Shifted down to make space for the title and description

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);

    // Change the domain to 0-100
    xScale.domain([0, 100]);
    const yScale = d3
      .scaleBand()
      .domain(uniqueItems)
      .range([0, height])
      .padding(0.4);

    svg
      .append("defs")
      .selectAll("marker")
      .data(["startArrow", "endArrow"])
      .enter()
      .append("marker")
      .attr("id", (d) => d)
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", (d) => (d === "startArrow" ? 4 : 6))
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", (d) =>
        d === "startArrow" ? "M 10,-5 L 0 ,0 L 10,5" : "M 0,-5 L 10 ,0 L 0,5"
      )
      .attr("fill", "#999")
      .style("stroke", "none");

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([xScale.domain()[0], 50, xScale.domain()[1]]) // Updated to use 0, 50, and 100
      .tickFormat((d) => {
        if (d === xScale.domain()[0]) return "Least Preferred";
        if (d === 50) return "50";
        if (d === xScale.domain()[1]) return "Most Preferred";
      });

    const xAxisGroup = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    xAxisGroup
      .select(".domain")
      .attr("marker-start", "url(#startArrow)")
      .attr("marker-end", "url(#endArrow)");

    xAxisGroup.selectAll(".tick text").each(function (d) {
      if (d === 0 || d === 50 || d === 100) {
        d3.select(this).style("font-size", "16px"); // Adjust the font size as needed
      }
    });
    svg
      .append("g")
      .attr("transform", "translate(" + xScale(50) + ",0)")
      .call(d3.axisLeft(yScale).tickSize(0).tickFormat(""));

    const drag = d3.drag().on("drag", (event, d) => {
      const newX = Math.max(0, Math.min(width, event.x));
      const newY = d3.select("#label_" + d.replace(/\s+/g, "_")).attr("y"); // Get the y position of the label

      // Update circle position
      d3.select(`#circle_${d.replace(/\s+/g, "_")}`)
        .attr("cx", newX)
        .attr("cy", newY);

      // Update label position
      d3.select("#label_" + d.replace(/\s+/g, "_"))
        .attr("x", newX + 15)
        .attr("y", newY);

      this.updateScores(d, xScale.invert(newX));
    });

    // Add vertical bar at position 0
    svg
      .append("line")
      .attr("x1", xScale(0))
      .attr("y1", 0)
      .attr("x2", xScale(0))
      .attr("y2", height)
      .attr("stroke", "grey")
      .attr("stroke-width", 1);

    // Add vertical bar at position 1
    svg
      .append("line")
      .attr("x1", xScale(100))
      .attr("y1", 0)
      .attr("x2", xScale(100))
      .attr("y2", height)
      .attr("stroke", "grey")
      .attr("stroke-width", 1);

    svg
      .selectAll(".item-circle")
      .data(uniqueItems)
      .enter()
      .append("circle")
      .attr("id", (d) => "circle_" + d.replace(/\s+/g, "_"))
      .attr("class", "item-circle")
      .attr("cx", (d) => xScale(this.state.scores[d] || 50)) // Adjust the scale for scores
      .attr("cy", (d) => yScale(d))
      .attr("r", 10)
      .call(drag);

    svg
      .selectAll(".item-label")
      .data(uniqueItems)
      .enter()
      .append("text")
      .attr("id", (d) => "label_" + d.replace(/\s+/g, "_"))
      .attr("class", "item-label")
      .attr("x", (d) => xScale(this.state.scores[d] || 50) + 15) // Adjust the scale for scores
      .attr("y", (d) => yScale(d))
      .attr("dy", "0.35em")
      .text((d) => d);

    // Adding title text to the SVG
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -40) // Adjusted position to avoid overlap
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Apply Your Preference");

    // Adding description text to the SVG
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -15) // Adjusted position to avoid overlap
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Drag the dots in the visualization to adjust the scores.");
  }

  handleAddScores = () => {
    console.log("Add Scores button clicked!");
    this.props.onAddScores(this.getCurrentScores()); // Retain the original functionality

    this.setState({ showAlert: true }, () => {
      // Show the alert
      setTimeout(() => {
        this.setState({ showAlert: false });
        this.props.onClose(); // Close the scoring visualization after hiding the alert
      }, 2000);
    });
  };

  getCurrentScores = () => {
    // Convert all scores to integers
    const integerScores = {};
    for (const [key, value] of Object.entries(this.state.scores)) {
      integerScores[key] = parseInt(value);
    }
    return integerScores;
  };

  resetScores = () => {
    const resetScores = Object.keys(this.state.scores).reduce((acc, item) => {
      acc[item] = 50;
      return acc;
    }, {});
    this.setState({ scores: resetScores }, () => {
      d3.select(this.svgRef.current).selectAll("*").remove();
      this.drawVisualization();
    });
  };

  // Add a method to handle the close button click
  handleCloseVisualization = () => {
    this.setState({ displayVisualization: false });
  };

  render() {
    if (!this.state.displayVisualization) {
      return null; // Don't render anything if the visualization is closed
    }

    return (
      <div
        className="container-fluid mb-5 bg-white"
        style={{
          marginTop: "40px",
          marginBottom: "40px",
          padding: "24px",
          border: "2px solid black",
          borderRadius: "9px",
        }}
      >
        {this.state.showAlert && (
          <div
            className="alert alert-success fixed-top d-flex align-items-center justify-content-center"
            style={{
              left: "50%",
              transform: "translate(-50%, 0)",
              zIndex: 9999,
              width: "auto",
            }}
            role="alert"
          >
            Scores added successfully!
          </div>
        )}

        {/* Add a new row above the current content */}
        <div className="row gx-3">
          <div className="col-12">
            {/* Your new content for the row */}
            <h2>
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
              </span>{" "}
              {this.props.selectedKey}
            </h2>
            <p>
              Use this tool to convert your{" "}
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
              </span>{" "}
              categorical preferences into a{" "}
              <span style={{ color: "darkgrey" }}> #</span> numeric score. By
              adjusting the markers, you can rank items based on your
              priorities. The numerical score provides a clear representation of
              your preferences
            </p>
            {/* Add your content here */}

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                padding: "5",
              }}
              onClick={this.props.onClose}
            ></button>
          </div>
        </div>

        <div className="row gx-3">
          <div className="col-7">
            {/* Title above the SVG visualization */}
            <div>
              <svg ref={this.svgRef}></svg>
            </div>
          </div>
          <div className="col-5">
            {/* Title above the table */}
            <h3>Table</h3>
            <p>In this table you can see the current scores.</p>
            <div style={{ maxHeight: "800px", overflowY: "auto" }}>
              <table id="scoreTable" className="table table-sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Score</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(this.state.scores).map(([item, score]) => {
                    const percentage = (score / 100) * 100; // Calculate percentage

                    return (
                      <tr key={item}>
                        <td className="bar-cell">
                          <div className="text">{item}</div>
                          <div
                            className="bar"
                            style={{
                              "--score-width": `${percentage}%`,
                            }}
                          ></div>
                        </td>
                        <td>{parseInt(score)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              {/* Adjust alignment to the left */}
              <button
                className="btn btn-success mt-3 mr-2"
                type="button"
                onClick={this.handleAddScores}
              >
                Add Scores to Ranking
              </button>

              <button
                className="btn btn-danger mt-3 mr-2"
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="This top tooltip is themed via CSS variables."
                onClick={this.resetScores}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoringVisualization;
