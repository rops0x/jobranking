const margin = {top: 20, right: 20, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    
const svg = d3.select("#viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);


const items = ["Item1", "Item2", "Item3", "Item4"]; // Add more items as needed


const yScale = d3.scaleBand()
    .domain(items)
    .range([0, height])
    .padding(0.4);


svg.append("defs").selectAll("marker")
    .data(['startArrow', 'endArrow'])      // Different marker names for the start and end arrows
    .enter().append("marker")
    .attr("id", d => d)
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", d => (d === 'startArrow' ? 4 : 6))  // Adjust the position of the arrowhead along the x-axis
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", d => (d === 'startArrow' ? "M 10,-5 L 0 ,0 L 10,5" : "M 0,-5 L 10 ,0 L 0,5"))  // Different paths for the start and end arrows
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


// Apply the arrow markers to the x-axis line
xAxisGroup.select(".domain")
    .attr("marker-start", "url(#startArrow)")
    .attr("marker-end", "url(#endArrow)");


svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


svg.append("g")
    .attr("transform", "translate(" + xScale(0.5) + ",0)")
    .call(d3.axisLeft(yScale).tickSize(0).tickFormat(""));


const drag = d3.drag()
    .on("drag", function(d) {
        const circle = d3.select(this);
        const text = d3.select("#label_" + d.replace(/\s+/g, '_'));
        const newX = Math.max(0, Math.min(width, d3.event.x));

        circle.attr("cx", newX);
        text.attr("x", newX + 15);

        // Update the table with the new score
        updateTable(d, xScale.invert(newX));
    });


const circles = svg.selectAll(".item-circle")
    .data(items)
    .enter().append("circle")
    .attr("class", "item-circle")
    .attr("cx", xScale(0.5)) // Start at 0.5 point
    .attr("cy", d => yScale(d))
    .attr("r", 10)
    .call(drag);


// Add text labels next to the circles
svg.selectAll(".item-label")
    .data(items)
    .enter().append("text")
    .attr("id", d => "label_" + d.replace(/\s+/g, '_'))
    .attr("class", "item-label")
    .attr("x", xScale(0.5) + 15) // Position the text 15 units to the right of the circle
    .attr("y", d => yScale(d))
    .attr("dy", "0.35em")
    .text(d => d);


function updateTable(itemName, score) {
    const tableBody = d3.select("#scoreTable tbody");
    let row = tableBody.select("tr#" + itemName.replace(/\s+/g, '_'));

    // If the row for the item doesn't exist, create it
    if (row.empty()) {
        row = tableBody.append("tr").attr("id", itemName.replace(/\s+/g, '_'));
        row.append("td").text(itemName);
        row.append("td");
    }

    // Update the score value in the table
    row.select("td:nth-child(2)").text(score.toFixed(2)); // Display score up to 2 decimal places
}

items.forEach(item => {
    updateTable(item, 0.5);
});
