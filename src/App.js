import React, { Component } from 'react';
import {LineUp, LineUpStringColumnDesc, LineUpNumberColumnDesc, LineUpRanking, LineUpCategoricalColumnDesc, LineUpDateColumnDesc, LineUpAllColumns, } from 'lineupjsx';
import './App.css';
import jobsData from './jobsdata.json';
import ScoringVisualization from './components/ScoringVisualization';
import Dropdown from './components/dropdown';



const generateLineUpColumns = (data) => {
  if (!data || data.length === 0) return [];

  const firstItem = data[0];
  const columns = [];
  let numericColumnCount = 0; // Counter for numeric columns

  for (let key in firstItem) {
      if (typeof firstItem[key] === 'string') {
          const uniqueValues = new Set(data.map(item => item[key]));
          if (uniqueValues.size === data.length) {
              columns.push(<LineUpStringColumnDesc key={key} column={key} label={key} width={100} />);
          } else {
              columns.push(<LineUpCategoricalColumnDesc key={key} column={key} label={key} width={100} />);
          }
      } else if (typeof firstItem[key] === 'number') {
          // Compute the min and max values for the numeric column
          const minVal = Math.min(...data.map(item => item[key]));
          const maxVal = Math.max(...data.map(item => item[key]));

          // Generate a shade of blue based on the numericColumnCount
          const shade = 100 + (numericColumnCount * 40); // Increase the shade for each column
          const color = `rgb(0, 0, ${shade})`;

          columns.push(<LineUpNumberColumnDesc key={key} column={key} domain={[minVal, maxVal]} color={color} />);

          numericColumnCount++;
      } // Add more conditions for other data types if needed
  }

  return columns;
};


class LineUpComponent extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      console.log("Data updated in LineUpComponent");
    }
  }

  render() {
    const columns = generateLineUpColumns(this.props.data);
    return (
      <div id="lineup">
        <LineUp 
          data={this.props.data}
          sidePanel 
          sidePanelCollapsed 
          defaultRanking 
        >
          {columns}
          <LineUpRanking>
            <LineUpAllColumns />;
          </LineUpRanking>                    
        </LineUp>
      </div>
    );
  }
}


class App extends Component {
  state = {
    selectedKey: null,
    jobsData: jobsData,
    showVisualization: false
  };

  handleDropdownSelect = (key) => {
    this.setState({ 
        selectedKey: key,
        showVisualization: true  // Show the visualization again
    });
}

handleCloseVisualization = () => {
  this.setState({ showVisualization: false });
}

  handleAddScores = (scores) => {
    const updatedJobsData = jobsData.map(job => {
      if (scores[job[this.state.selectedKey]]) {
        job[`${this.state.selectedKey}Score`] = scores[job[this.state.selectedKey]];
      }
      return job;
    });
    this.setState({ jobsData: updatedJobsData });
  };

  render() {
    return (
      <React.Fragment>
        <h1 className="mt-5">Job Ranking Tool</h1>
        <p className="mt-5">
          Select a criteria from the dropdown below to visualize and score the criteria based on your preferences. 
          Drag the dots in the visualization to adjust the scores.
        </p>
        <Dropdown data={jobsData} onSelect={this.handleDropdownSelect} />
        {this.state.showVisualization && 
            <ScoringVisualization 
                data={jobsData} 
                selectedKey={this.state.selectedKey}
                onAddScores={this.handleAddScores}
                onClose={this.handleCloseVisualization}  // Pass the close handler as a prop
            />
        }
        <div className="mt-5" style={{ border: '2px solid black', padding: '15px', borderRadius: '5px', position: 'relative' }}>
          <h2>Job Ranking</h2>
          <LineUpComponent data={this.state.jobsData} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;