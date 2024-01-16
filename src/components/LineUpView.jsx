import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import * as LineUp from "lineupjs";

class LineUpView extends Component {
  divRef = React.createRef();

  lineUp;
  lineUpBuilder;
  lineUpDataProvider;

  findAllIndexes(arr, targetValue) {
    return arr.reduce((indexes, element, index) => {
      if (element.desc.type === targetValue) {
        indexes.push(index);
      }
      return indexes;
    }, []);
  }

  componentDidMount() {
    this.drawLineUp();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      /*console.log("Current")
            console.log(this.props.data)
            console.log(Object.keys(this.props.data[0]))
            console.log("Previous")
            console.log(prevProps.data)
            console.log(Object.keys(prevProps.data[0]))*/

      //console.log(this.props.data)
      const columns = this.generateLineUpColumns(this.props.data);
      this.lineUpDataProvider.setData(this.props.data);
      //console.log("Set LineUp DataProvider")
      //console.log(this.lineUpDataProvider);
      //console.log("Key " + this.props.sel)

      let index = this.lineUpDataProvider.getColumns().findIndex((i) => {
        return i.column === this.props.sel + "Score";
      });

      //console.log(this.lineUpDataProvider.getRankings()[0].at(index+3))

      let rankingIndex = this.lineUpDataProvider
        .getFirstRanking()
        .children.findIndex((i) => i.desc.column === this.props.sel + "Score");

      //console.log(columns)
      if (columns.length >= this.lineUpDataProvider.getColumns().length) {
        console.log("Index " + index);

        if (index !== -1) {
          this.lineUpDataProvider
            .getRankings()[0]
            .remove(this.lineUpDataProvider.getRankings()[0].at(rankingIndex));
          //this.lineUpDataProvider.removeDesc(this.lineUpDataProvider.findDesc(this.props.sel+"Score"));
          this.lineUpDataProvider.findDesc(this.props.sel + "Score").domain =
            columns[index].desc.domain;
          //this.lineUpDataProvider.removeDesc(this.lineUpDataProvider.findDesc(this.props.sel+"Score"));
          //this.lineUpDataProvider.pushDesc(columns[index].desc);
          this.lineUpDataProvider.insert(
            this.lineUpDataProvider.getRankings()[0],
            rankingIndex,
            this.lineUpDataProvider.findDesc(this.props.sel + "Score")
          );
        } else {
          this.lineUpDataProvider.pushDesc(columns[columns.length - 1].desc);
          this.lineUpDataProvider.push(
            this.lineUpDataProvider.getRankings()[0],
            columns[columns.length - 1].desc
          );
        }

        //console.log(this.lineUpDataProvider)

        //console.log(this.lineUpDataProvider)
      }

      this.lineUp.update();
      console.log(this.lineUpDataProvider);
    }
  }

  generateLineUpColumns = (data) => {
    if (!data || data.length === 0) return [];

    const firstItem = data[0];
    const columns = [];
    let numericColumnCount = 0; // Counter for numeric columns

    //console.log("new column created")

    //console.log("first item " + JSON.stringify(firstItem) + " " + firstItem["Salary"] )

    for (let key in firstItem) {
      if (typeof firstItem[key] === "number") {
        // Numeric property logic (unchanged)
        const minVal = Math.min(...data.map((item) => item[key]));
        const maxVal = Math.max(...data.map((item) => item[key]));
        const shade = 10 + numericColumnCount * 60;
        const color = `rgb(0, 0, ${shade})`;

        if (minVal >= 0 && maxVal <= 1) {
          columns.push(
            LineUp.buildNumberColumn(key, [0, 1]).colorMapping(color)
          );
        } else {
          columns.push(
            LineUp.buildNumberColumn(key, [minVal, maxVal]).colorMapping(color)
          );
        }

        numericColumnCount++;
      } else if (key === "JobTitle" || key === "Company") {
        // String properties for "JobTitle" and "Company"
        columns.push(LineUp.buildStringColumn(key).label(key));
      } else {
        // Categorical properties for all other keys
        columns.push(LineUp.buildCategoricalColumn(key).label(key));
      }
    }

    return columns;
  };

  drawLineUp() {
    const columns = this.generateLineUpColumns(this.props.data);
    //console.log(columns)
    this.lineUpBuilder = new LineUp.DataBuilder(this.props.data);

    for (let i = 0; i < columns.length; i++) {
      this.lineUpBuilder.column(columns[i]); // push another column into DataProvider and return DataBuilder
    }

    const ranking = new LineUp.RankingBuilder() // create a RankingBuilder
      .supportTypes() // add supporttypes (aggregate, rank, selection) to the ranking
      .allColumns(); // add all columns to this ranking

    this.lineUpBuilder
      .defaultRanking() //add the default ranking (all columns) to DataProvider
      .ranking(ranking)
      .sidePanel(); // add another ranking to this DataProvider // option to enable/disable the side panel

    this.lineUp = this.lineUpBuilder.build(this.divRef.current); // builds LineUp at the given parent DOM node returns LineUp
    this.lineUpDataProvider = this.lineUpBuilder.buildData();

    this.lineUp.on("selectionChanged", (dataIndex) => {
      this.lineUpDataProvider = this.lineUp.data;
    });

    this.lineUpDataProvider = this.lineUp.data;
    this.lineUp.data
      .getRankings()[0]
      .on("filterChanged", (previous, current) => {
        console.log(JSON.stringify(previous) + " " + JSON.stringify(current));
        this.lineUpDataProvider = this.lineUp.data;
      });

    this.lineUp.data.getRankings()[0].on("orderChanged", () => {
      console.log("Order changed");
      this.lineUpDataProvider = this.lineUp.data;
      console.log(this.lineUpDataProvider);
    });
    this.lineUp.data.getRankings()[0].on("groupsChanged", () => {
      console.log("Groups changed");
      this.lineUpDataProvider = this.lineUp.data;
      console.log(this.lineUpDataProvider);
    });
    this.lineUp.data.getRankings()[0].on("moveColumn", (a, b) => {
      console.log("Move column");
      console.log(a);
      console.log("Move which column");
      console.log(b);
      this.lineUpDataProvider = this.lineUp.data;
    });

    this.lineUp.data.getRankings()[0].on("removeColumn", (a, b) => {
      console.log("Remove columns ");
      console.log(a);
      console.log("index where to remove");
      console.log(b);
      console.log(this.lineUp);
      this.lineUpDataProvider = this.lineUp.data;
    });

    this.lineUp.data.getRankings()[0].on("addColumn", (a, b) => {
      console.log("Add columns ");
      console.log(a);
      console.log("index where to add");
      console.log(b);
      this.lineUpDataProvider = this.lineUp.data;
    });

    this.lineUp.data.on("dataChanged", () => {
      console.log("Data changed");
      this.lineUpDataProvider = this.lineUp.data;
    });
    this.lineUp.data.on("aggregate", () => {
      console.log("Aggregation changed");
      this.lineUpDataProvider = this.lineUp.data;
    });
    this.lineUp.data.on("selectionChanged", () => {
      console.log("Selection changed");
      this.lineUpDataProvider = this.lineUp.data;
    });
    this.lineUp.data.on("addDesc", () => {
      console.log("Add description");
      this.lineUpDataProvider = this.lineUp.data;
    });
  }

  render() {
    //console.log("Initial rendering")
    //console.log(this.props.data);
    return (
      <div
        id="lineup"
        className="bg-white"
        ref={this.divRef}
        style={{
          position: "relative",
          maxWidth: "100%",
          maxHeight: "600px",
          overflowY: "auto",
          margin: "0px",
          borderTop: "0px solid grey",
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingBottom: "24px",
          paddingTop: "24px",
          borderRadius: "9px",
        }}
      ></div>
    );
  }
}

export default LineUpView;
