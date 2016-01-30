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
        var dow = Math.round(Math.random() * 7);
        var hour = Math.round(Math.random() * 12);
        dataset.push({
            dayOfTheWeek: dows[dow],
            hour: hour
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

var App = React.createClass({

    getInitialState: function() {
        return {
            chartComponent: ScatterPlot,
            dataset: [],
            width: 800,
            height: 400,
            xPadding: 40,
            yPadding: 20
        };
    },

    componentDidMount: function() {
        var dataset = generateData(this.state.chartComponent);
        this.setState({dataset: dataset});
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
        this.setState({
            chartComponent: chartComponent,
            dataset: dataset
        });
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
