// App.js
(function() {

'use strict';

var React = require('react');
var ScatterPlot = require('./ScatterPlot');
var BarChart = require('./BarChart');

var App = React.createClass({

    getInitialState: function() {
        return {
            chartType: 'scatterPlot',
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
        this.setState({chartType: chartType});
    },

    refreshData: function() {
        var dataset = [];
        var numDataPoints = 50;
        var number1Range = Math.random() * 1000;
        var number2Range = Math.random() * 1000;
        for (var i = 0; i < numDataPoints; i++) {
            var newNumber1 = Math.round(Math.random() * number1Range);
            var newNumber2 = Math.round(Math.random() * number2Range);
            dataset.push([newNumber1, newNumber2]);
        }
        this.setState({dataset: dataset});
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
                <a href="#" onClick={this.switchChartType.bind(null, 'barChart')}>Bar Chart</a>
            );
        } else if (this.state.chartType === 'barChart') {
            return (
                <a href="#" onClick={this.switchChartType.bind(null, 'scatterPlot')}>Scatter Plot</a>
            );
        } else {
            return (
                <span>
                    <a href="#" onClick={this.switchChartType.bind(null, 'scatterPlot')}>Scatter Plot</a>
                    {' '}
                    <a href="#" onClick={this.switchChartType.bind(null, 'barChart')}>Bar Chart</a>
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
        } else {
            return (
                <span>Select Chart Type</span>
            );
        }
    }

});

module.exports = App;

})();
