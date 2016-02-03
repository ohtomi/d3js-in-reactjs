// App.js
(function() {

'use strict';

var React = require('react');
var EventEmitter = require('events').EventEmitter;
var DataStore = require('./DataStore');
var ScatterPlot = require('./ScatterPlot');
var BarChart = require('./BarChart');
var TreeMap = require('./TreeMap');

var emitter = new EventEmitter();

function generateData(chartComponent, done) {
    if (chartComponent === ScatterPlot) {
        DataStore.scatterPlotData().then(done);
    } else if (chartComponent === BarChart) {
        DataStore.barChartData().then(done);
    } else if (chartComponent === TreeMap) {
        DataStore.treeMapData().then(done);
    } else {
        done([]);
    }
}

var App = React.createClass({

    childContextTypes: {
        emitter: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            emitter: emitter
        };
    },

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
        emitter.on('click:rect', this.changeFunctionsOrder);
        this.refreshData(this.state.chartComponent);
    },

    refreshData: function(chartComponent) {
        var that = this;
        generateData(chartComponent, function(dataset) {
            that.setState({dataset: dataset});
        });
    },

    switchChartType: function(chartComponent) {
        if (chartComponent === this.state.chartComponent) {
            return;
        }

        this.setState({
            chartComponent: chartComponent,
            dataset: []
        });

        this.refreshData(chartComponent);
    },

    changeFunctionsOrder: function(index) {
        DataStore.permuteTreeMapFunctions(index);
        this.refreshData(this.state.chartComponent);
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
                        <a href="#" onClick={this.refreshData.bind(null, this.state.chartComponent)}>Refresh Data</a>
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
