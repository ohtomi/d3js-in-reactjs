// App.js
(function() {

'use strict';

var React = require('react');
var ScatterPlot = require('./ScatterPlot');
var BarChart = require('./BarChart');
var TreeMap = require('./TreeMap');

var App = React.createClass({

    getInitialState: function() {
        return {
            chartType: 'scatterPlot',
            refreshFunc: this.scatterPlotData,
            dataset: [],
            width: 800,
            height: 400,
            xPadding: 40,
            yPadding: 20
        };
    },

    componentDidMount: function() {
        this.refreshData();
    },

    switchChartType: function(chartType) {
        var func = this[chartType + 'Data'];
        var dataset = func();
        this.setState({
            chartType: chartType,
            refreshFunc: func,
            dataset: dataset
        });
    },

    refreshData: function() {
        var dataset = this.state.refreshFunc();
        this.setState({dataset: dataset});
    },

    _refreshPairData: function() {
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
    },

    scatterPlotData: function() {
        return this._refreshPairData();
    },

    barChartData: function() {
        return this._refreshPairData();
    },

    treeMapData: function() {
        var dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var dataset = [];
        for (var i = 0; i < 100; i++) {
            var dow = Math.round(Math.random() * 7);
            var hour = Math.round(Math.random() * 12);
            dataset.push({
                dayOfTheWeek: dows[dow],
                hour: hour
            });
        }
        return dataset;
    },

    render: function() {
        return (
            <div>
                <div style={{width: '800px'}}>
                    <div style={{float: 'left'}}>
                        {this.renderSwitchLinks()}
                    </div>
                    <div style={{float: 'right'}}>
                        <a href="#" onClick={this.refreshData}>Refresh Data</a>
                    </div>
                </div>
                <div>
                    {this.renderSpecifiedChart()}
                </div>
            </div>
        );
    },

    renderSwitchLinks: function() {
        if (this.state.chartType === 'scatterPlot') {
            return (
                <span>
                    <a href="#" onClick={this.switchChartType.bind(null, 'barChart')}>Bar Chart</a>
                    {' '}
                    <a href="#" onClick={this.switchChartType.bind(null, 'treeMap')}>Tree Map</a>
                </span>
            );
        } else if (this.state.chartType === 'barChart') {
            return (
                <span>
                    <a href="#" onClick={this.switchChartType.bind(null, 'scatterPlot')}>Scatter Plot</a>
                    {' '}
                    <a href="#" onClick={this.switchChartType.bind(null, 'treeMap')}>Tree Map</a>
                </span>
            );
        } else if (this.state.chartType === 'treeMap') {
            return (
                <span>
                    <a href="#" onClick={this.switchChartType.bind(null, 'barChart')}>Bar Chart</a>
                    {' '}
                    <a href="#" onClick={this.switchChartType.bind(null, 'scatterPlot')}>Scatter Plot</a>
                </span>
            );
        } else {
            return (
                <span>
                    <a href="#" onClick={this.switchChartType.bind(null, 'scatterPlot')}>Scatter Plot</a>
                    {' '}
                    <a href="#" onClick={this.switchChartType.bind(null, 'barChart')}>Bar Chart</a>
                    {' '}
                    <a href="#" onClick={this.switchChartType.bind(null, 'treeMap')}>Tree Map</a>
                </span>
            );
        }
    },

    renderSpecifiedChart: function() {
        if (this.state.chartType === 'scatterPlot') {
            return (
                <ScatterPlot {...this.state} />
            );
        } else if (this.state.chartType === 'barChart') {
            return (
                <BarChart {...this.state} />
            );
        } else if (this.state.chartType === 'treeMap') {
            return (
                <TreeMap {...this.state} />
            );
        } else {
            return (
                <span>Select Chart Type</span>
            );
        }
    }

});

module.exports = App;

})();
