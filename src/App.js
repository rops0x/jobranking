import React, { Component } from 'react';
import {LineUp, LineUpW ,LineUpStringColumnDesc, LineUpNumberColumnDesc, LineUpRanking ,LineUpCategoricalColumnDesc, LineUpAllColumns, ILineUpRankingProps, LineUpImposeColumn, LineUpSupportColumn, LineUpColumn, LineUpWeightedSumColumn,LineUpWeightedColumn } from 'lineupjsx';
import './App.css';
import jobsData from './jobsdata.json';
import ScoringVisualization from './components/ScoringVisualization';
import Dropdown from './components/dropdown';
import criterias from './criterias.json';

const colwidthnr = 150;
const colwidthcat = 100;
const colwidthstr = 150;

const generateLineUpColumns = (data) => {
  if (!data || data.length === 0) return [];

  const firstItem = data[0];
  const columns = [];
  let numericColumnCount = 0; // Counter for numeric columns

  // Array of colors
  const colors = [
    '#3C91E6', // Original colors
    '#9FD356',
    '#342E37',
    '#FA824C',
    '#D8315B', // New colors with different hues but similar tones
    '#6A0573',
    '#2F9599',
    '#F29E4C'
  ];
  

  for (let key in firstItem) {
      if (typeof firstItem[key] === 'string') {
          const uniqueValues = new Set(data.map(item => item[key]));
          if (uniqueValues.size === data.length) {
              columns.push(<LineUpStringColumnDesc key={key} column={key} label={key} width={colwidthstr} />);
          } else {
              columns.push(<LineUpCategoricalColumnDesc key={key} column={key} label={key} width={colwidthcat} />);
          }
      } else if (typeof firstItem[key] === 'number') {
          // Compute the min and max values for the numeric column
          const minVal = Math.min(...data.map(item => item[key]));
          const maxVal = Math.max(...data.map(item => item[key]));

          // Get a color from the colors array based on the numericColumnCount
          const color = colors[numericColumnCount % colors.length];

          columns.push(<LineUpNumberColumnDesc key={key} column={key} domain={[minVal, maxVal]} color={color} width={colwidthnr} />);

          numericColumnCount++;
      } // Add more conditions for other data types if needed
  }
console.log (columns)
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
      <div id='main'>
      <div id="lineup">
        <LineUp 
          data={this.props.data}
          sidePanel= {true} 
          sidePanelCollapsed
          rowPadding={5}
          rowHeight={30} 
          defaultRanking
           
        >
          {columns}
          <LineUpRanking sortBy='Salary:ssc'>
            <LineUpSupportColumn type="*" />
            <LineUpColumn column="*" />
            <LineUpImposeColumn label='tere' column='Salary' colorColumn='Benefits' />
            <LineUpWeightedSumColumn label='Salary+TravelTime' numberColumn1='Salary' weight1='0.5'  numberColumn2='TravelTime' weight2='0.5'/>
          </LineUpRanking>                    
        </LineUp>
        
      </div>
      <div id="lineup2">
        <LineUp 
          data={this.props.data}
          sidePanel= {true} 
          sidePanelCollapsed
          rowPadding={5}
          rowHeight={30} 
          defaultRanking
          impo 
        >
          {columns}
          <LineUpRanking sortBy='Salary:ssc'>
            <LineUpSupportColumn type="*" />
            <LineUpColumn column="*" />
            
          </LineUpRanking>                    
        </LineUp>
        
      </div>
      </div>
      
    );
  }
}


// LineUp column modifications -> WeightedSum not working
//<LineUpImposeColumn label='tere' column='Salary' colorColumn='Benefits' />
//<LineUpWeightedSumColumn label='Salary+TravelTime' numberColumn1='Salary' weight1='0.5'  numberColumn2='TravelTime' weight2='0.5'/>


class App extends Component {
  state = {
    selectedKey: null,
    jobsData: jobsData,
    showVisualization: false,
    activeTab: criterias.length > 0 ? criterias[0].name : '', // Set the first tab as active by default
    resetDropdown: false
  };

  handleDropdownSelect = (key) => {
    this.setState({ 
        selectedKey: key,
        showVisualization: true  // Show the visualization again
    });
}

handleCloseVisualization = () => {
  this.setState((prevState) => ({ 
      showVisualization: false,
      resetDropdown: !prevState.resetDropdown  // Toggle the resetDropdown state
  }));
}

handleAddScores = (scores) => {
  const updatedJobsData = jobsData.map(job => {
    if (scores[job[this.state.selectedKey]]) {
      job[`${this.state.selectedKey}Score`] = scores[job[this.state.selectedKey]];
    }
    return job;
  });
  this.setState((prevState) => ({ 
    jobsData: updatedJobsData,
    resetDropdown: !prevState.resetDropdown  // Toggle the resetDropdown state
}), () => {
    this.handleCloseVisualization();
});
};

handleTabClick = (tabName) => {
  this.setState({ activeTab: tabName });
}

renderCriteriaTabs() {
  const { activeTab } = this.state;

  if (!criterias || criterias.length === 0) return null;

  return (
    <div>
      <ul className="nav nav-tabs mt-3">
        {criterias.map((criteria) => (
          <li className="nav-item" key={criteria.name}>
            <a 
              className={`nav-link ${activeTab === criteria.name ? 'active' : ''}`} 
              onClick={() => this.handleTabClick(criteria.name)}
            >
              {criteria.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content mt-2">
        {criterias.map((criteria) => (
          <div 
            className={`tab-pane fade ${activeTab === criteria.name ? 'show active' : ''}`} 
            key={criteria.name}
          >
            <p>{criteria.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

  render() {
    return (
      <React.Fragment>
        <div style={{ margin: '64px' }}>
        <h1 className="mt-5 text-center mb-5">Job Ranking Tool</h1>
        {/* Added the introduction here */}
        <div className="introduction container">
          <div className="row">
            <div className="col-lg-5"> {/* Adjust the column size as needed */}
              <p>Welcome to our Job Ranking Tool! We are dedicated to helping you find a job opportunity that is best suited for you. In the complex world of job hunting, we aim to simplify your search and offer personalized results that match your skills, experience, and preferences.</p>
              
              <p>What makes our tool unique is the ability to customize the job ranking based on specific criteria. You can apply your importance score to each criterion, ensuring that the displayed job opportunities align with your individual needs and preferences. It’s all about personalization and ensuring that your job search is as targeted and efficient as possible.</p>
            </div>
          </div>
        </div>
        
          <div className="mt-5" style={{ border: '2px solid black', padding: '15px', borderRadius: '5px', position: 'relative' }}>
            <h2>Job Ranking</h2>
            
            <div className="row">
              <div className="col-lg-6">
                <p>Below, you will find a Job Ranking section where 10 selected jobs are displayed. These job opportunities are curated from actual job postings, offering you real and attainable options to consider for your next career move.</p>             
              </div>
              
              {/* Added another column here for the Dropdown */}
              
            </div>

            

            <div className='mb-5'>
              {this.renderCriteriaTabs()}
            </div>
            <div className="col-lg-6 mb-3">
          <Dropdown 
            data={jobsData} 
            onSelect={this.handleDropdownSelect} 
            reset={this.state.resetDropdown}
          />
            </div>
              {this.state.showVisualization && 
              <ScoringVisualization 
                  data={jobsData} 
                  selectedKey={this.state.selectedKey}
                  onAddScores={this.handleAddScores}
                  onClose={this.handleCloseVisualization}
              />
            }
            <LineUpComponent data={this.state.jobsData} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;