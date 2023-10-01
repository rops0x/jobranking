import React, { Component } from 'react';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css';


class ScoringVisualization extends Component {
    state = {
        scores: {},
        displayVisualization: true
    };

    svgRef = React.createRef();

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedKey !== prevState.prevSelectedKey) {
            const uniqueItems = [...new Set(nextProps.data.map(item => item[nextProps.selectedKey]))];
            const initialScores = uniqueItems.reduce((acc, item) => {
                acc[item] = 0.5;
                return acc;
            }, {});
            return { scores: initialScores, prevSelectedKey: nextProps.selectedKey };
        }
        return null;
    }

    componentDidMount() {
        this.drawVisualization();
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedKey !== prevProps.selectedKey) {
            d3.select(this.svgRef.current).selectAll("*").remove();
            this.drawVisualization();
        }
    }
    
    updateScores(itemName, score) {
        const updatedScores = { ...this.state.scores, [itemName]: score };
        this.setState({ scores: updatedScores });
    }
    

    drawVisualization() {
        
        d3.select(this.svgRef.current).selectAll("*").remove(); // Clear the SVG

        const { selectedKey, data } = this.props;

        if (!selectedKey || !data) return;

        const uniqueItems = [...new Set(data.map(item => item[selectedKey]))];

        const minHeightPerItem = 50; // Minimum height for each item
        const totalItems = uniqueItems.length;
        const dynamicHeight = totalItems * minHeightPerItem; // Ensure SVG is never below 300px
        

        const margin = { top: 20, right: 250, bottom: 20, left: 100 },
                width = 800 - margin.left - margin.right,
                height = dynamicHeight - margin.top - margin.bottom;

        const svg = d3.select(this.svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(uniqueItems)
            .range([0, height])
            .padding(0.4);

        svg.append("defs").selectAll("marker")
            .data(['startArrow', 'endArrow'])
            .enter().append("marker")
            .attr("id", d => d)
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", d => (d === 'startArrow' ? 4 : 6))
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", d => (d === 'startArrow' ? "M 10,-5 L 0 ,0 L 10,5" : "M 0,-5 L 10 ,0 L 0,5"))
            .attr("fill", "#999")
            .style("stroke", "none");

        const xAxis = d3.axisBottom(xScale)
            .tickValues([xScale.domain()[0], 0.5, xScale.domain()[1]])
            .tickFormat(d => {
                if (d === xScale.domain()[0]) return "Least Preferred";
                if (d === 0.5) return "0.5";
                if (d === xScale.domain()[1]) return "Most Preferred";
            });

            
            
        const xAxisGroup = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        xAxisGroup.select(".domain")
            .attr("marker-start", "url(#startArrow)")
            .attr("marker-end", "url(#endArrow)");

            xAxisGroup.selectAll(".tick text")
            .each(function(d) {
                if (d === 0 || d === 0.5 || d === 1) {
                    d3.select(this).style("font-size", "16px"); // Adjust the font size as needed
                }
            });
        svg.append("g")
            .attr("transform", "translate(" + xScale(0.5) + ",0)")
            .call(d3.axisLeft(yScale).tickSize(0).tickFormat(""));

            const drag = d3.drag()
            .on("drag", (event, d) => {
                const newX = Math.max(0, Math.min(width, event.x));
                const newY = d3.select("#label_" + d.replace(/\s+/g, '_')).attr("y");  // Get the y position of the label
        
                // Update circle position
                d3.select(`#circle_${d.replace(/\s+/g, '_')}`)
                    .attr("cx", newX)
                    .attr("cy", newY);
        
                // Update label position
                d3.select("#label_" + d.replace(/\s+/g, '_'))
                    .attr("x", newX + 15)
                    .attr("y", newY);
        
                this.updateScores(d, xScale.invert(newX));
            });
        
                // Add vertical bar at position 0
    svg.append("line")
    .attr("x1", xScale(0))
    .attr("y1", 0)
    .attr("x2", xScale(0))
    .attr("y2", height)
    .attr("stroke", "grey")
    .attr("stroke-width", 1);

// Add vertical bar at position 1
svg.append("line")
    .attr("x1", xScale(1))
    .attr("y1", 0)
    .attr("x2", xScale(1))
    .attr("y2", height)
    .attr("stroke", "grey")
    .attr("stroke-width", 1);

        svg.selectAll(".item-circle")
            .data(uniqueItems)
            .enter().append("circle")
            .attr("id", d => "circle_" + d.replace(/\s+/g, '_'))
            .attr("class", "item-circle")
            .attr("cx", d => xScale(this.state.scores[d] || 0.5))
            .attr("cy", d => yScale(d))
            .attr("r", 10)
            .call(drag);

        svg.selectAll(".item-label")
            .data(uniqueItems)
            .enter().append("text")
            .attr("id", d => "label_" + d.replace(/\s+/g, '_'))
            .attr("class", "item-label")
            .attr("x", d => xScale(this.state.scores[d] || 0.5) + 15)
            .attr("y", d => yScale(d))
            .attr("dy", "0.35em")
            .text(d => d);

            
    }

    handleAddScores = () => {
        // Your logic to handle the button click goes here
        console.log("Add Scores button clicked!");
    };
    
    getCurrentScores = () => {
        return this.state.scores;
    };

    resetScores = () => {
        const resetScores = Object.keys(this.state.scores).reduce((acc, item) => {
            acc[item] = 0.5;
            return acc;
        }, {});
        this.setState({ scores: resetScores }, () => {
            d3.select(this.svgRef.current).selectAll("*").remove();
            this.drawVisualization();
        });
    }
    
    // Add a method to handle the close button click
    handleCloseVisualization = () => {
        this.setState({ displayVisualization: false });
    }

    render() {
        if (!this.state.displayVisualization) {
            return null; // Don't render anything if the visualization is closed
        }
        return (
            <div className="container-lg" style={{ marginTop: '20px' }}>
                <div className="row" style={{ border: '2px solid black', padding: '15px', borderRadius: '5px', position: 'relative' }}>
                    {/* Close button in the top right corner */}
                    
                    <div className="col-4">
                        {/* Title above the table */}
                        <h3>Scoring for {this.props.selectedKey}</h3>
                        <p>Higher scores reflect bigger preferance to the item.</p>
                        <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
                            <table id="scoreTable" className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(this.state.scores).map(([item, score]) => (
                                        <tr key={item}>
                                            <td>{item}</td>
                                            <td>{score.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-grid gap-2 d-md-block">
                        <button className="btn btn-success btn-sm mt-3" type="button" onClick={() => this.props.onAddScores(this.getCurrentScores())}>Add Scores</button>           
                        <button className="btn btn-danger btn-sm mt-3" type="button" onClick={this.resetScores}>Reset Scores</button>  
                        </div>             
                    </div>
                    <div className="col-8">
                        {/* Title above the SVG visualization */}
                        <h5 className="text-center mt-5 mb-1" style={{ display: 'flex', justifyContent: 'center'}} >Apply preferance score on the scale 0 to 1</h5>
                        
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <svg ref={this.svgRef}></svg>
                        </div>
                        <button 
                        style={{ 
                            position: 'absolute', 
                            top: '0', 
                            right: '0', 
                            zIndex: '10', 
                            background: 'none', 
                            border: 'none', 
                            fontSize: '20px', 
                            cursor: 'pointer', 
                            color: 'black',
                            padding: '10px'
                        }} 
                        onClick={this.props.onClose}  // Use the onClose prop to handle the close action
                    >
                        &times;
                    </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScoringVisualization;
