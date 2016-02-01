// App.js
(function() {

'use strict';

var React = require('react');
var ScatterPlot = require('./ScatterPlot');
var BarChart = require('./BarChart');
var TreeMap = require('./TreeMap');

function generatePairData() {
    var dataset = [];
    var numDataPoints = 50;
    var number1Range = Math.random() * 1000;
    var number2Range = Math.random() * 1000;
    for (var i = 0; i < numDataPoints; i++) {
        var newNumber1 = Math.round(Math.random() * number1Range);
        var newNumber2 = Math.round(Math.random() * number2Range);
        dataset.push([newNumber1, newNumber2]);
    }
    return dataset;
}

function scatterPlotData() {
    return generatePairData();
}

function barChartData() {
    return generatePairData();
}

function treeMapData() {
    var dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var dataset = [];
    for (var i = 0; i < 50; i++) {
        var dow = Math.round(Math.random() * 6);
        var hour = Math.round(Math.random() * 11);
        dataset.push({
            dayOfTheWeek: dows[dow],
            hour: hour + ':00'
        });
    }
    return dataset;
}

function generateData(chartComponent) {
    if (chartComponent === ScatterPlot) {
        return scatterPlotData();
    } else if (chartComponent === BarChart) {
        return barChartData();
    } else if (chartComponent === TreeMap) {
        return treeMapData();
    } else {
        return [];
    }
}

var treeMapFunctions = [
    {
        key: 'dayOfTheWeek',
        func: function(value) {
            return value;
        }
    },
    {
        key: 'hour',
        func: function(value) {
            return value;
        }
    }
];

function getFunctions(chartComponent) {
    if (chartComponent === ScatterPlot) {
        return [];
    } else if (chartComponent === BarChart) {
        return [];
    } else if (chartComponent === TreeMap) {
        return treeMapFunctions;
    } else {
        return [];
    }
}

var App = React.createClass({

    getInitialState: function() {
        return {
            chartComponent: ScatterPlot,
            dataset: [],
            groupByFunctions: [],
            width: 800,
            height: 400,
            xPadding: 40,
            yPadding: 20,
            changeFunctionsOrder: this.changeFunctionsOrder
        };
    },

    componentDidMount: function() {
        var dataset = generateData(this.state.chartComponent);
        var groupByFunctions = getFunctions(this.state.chartComponent);
        this.setState({
            dataset: dataset,
            groupByFunctions: groupByFunctions
        });
    },

    refreshData: function() {
        var dataset = generateData(this.state.chartComponent);
        this.setState({dataset: dataset});
    },

    switchChartType: function(chartComponent) {
        if (chartComponent === this.state.chartComponent) {
            return;
        }

        var dataset = generateData(chartComponent);
        var groupByFunctions = getFunctions(chartComponent);
        this.setState({
            chartComponent: chartComponent,
            dataset: dataset,
            groupByFunctions: groupByFunctions
        });
    },

    changeFunctionsOrder: function(i) {
        if (i === 0 || i < 0 || i >= this.state.groupByFunctions.length) {
            return;
        }

        var groupByFunctions = [];
        groupByFunctions = groupByFunctions.concat(this.state.groupByFunctions[i]);
        groupByFunctions = groupByFunctions.concat(this.state.groupByFunctions.slice(0, i));
        groupByFunctions = groupByFunctions.concat(this.state.groupByFunctions.slice(i + 1));
        this.setState({groupByFunctions: groupByFunctions});
    },

    render: function() {
        return (
            <div>
                <div style={{width: '800px'}}>
                    <div style={{float: 'left'}}>
                        <a href="#" onClick={this.switchChartType.bind(null, ScatterPlot)}>Scatter Plot</a>
                        {' '}
                        <a href="#" onClick={this.switchChartType.bind(null, BarChart)}>Bar Chart</a>
                        {' '}
                        <a href="#" onClick={this.switchChartType.bind(null, TreeMap)}>Tree Map</a>
                    </div>
                    <div style={{float: 'right'}}>
                        <a href="#" onClick={this.refreshData}>Refresh Data</a>
                    </div>
                </div>
                <div>
                    <this.state.chartComponent {...this.state} />
                </div>
            </div>
        );
    }

});

module.exports = App;

})();
