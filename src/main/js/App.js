// App.js
(function() {

'use strict';

var React = require('react');
var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');
var _ = require('underscore');
var ScatterPlot = require('./ScatterPlot');
var BarChart = require('./BarChart');
var TreeMap = require('./TreeMap');
var request = require('superagent');

var emitter = new EventEmitter();

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
    return Promise.resolve(generatePairData());
}

function barChartData() {
    return Promise.resolve(generatePairData());
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

function treeMapData() {
    var dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return new Promise(function(resolve, reject) {
        request.get('https://api.github.com/repos/ohtomi/sandbox/commits')
            .end(function(err, res) {
                if (err) {
                    reject(err);
                    return;
                }

                var json = res.body;
                var commits = json.map(function(entry) {
                    var yyyymmdd = entry.commit.author.date.slice(0, 10);
                    var hh = entry.commit.author.date.slice(11, 13);
                    var dow = dows[new Date(yyyymmdd).getDay()];

                    return {
                        author: entry.commit.author.name,
                        dayOfTheWeek: dow,
                        hour: hh
                    };
                });

                var nest = _.chain(treeMapFunctions)
                    .reduce(function(nest, attr) {
                        return nest.key(function(d) {
                            return attr.func(d[attr.key]);
                        });
                    }, d3.nest())
                    .value();

                var commitCount = nest.rollup(function(values) {
                        return d3.sum(values, function() {
                            return 1;
                        });
                    })
                    .entries(commits);

                var partition = d3.layout.partition()
                    .children(function(d) {
                        return d.values;
                    })
                    .value(function(d) {
                        return d.values;
                    });

                var dataset = partition.nodes({
                    key: 'All',
                    values: commitCount
                });

                resolve(dataset);
            });
    });
}

function generateData(chartComponent, done) {
    if (chartComponent === ScatterPlot) {
        scatterPlotData().then(done);
    } else if (chartComponent === BarChart) {
        barChartData().then(done);
    } else if (chartComponent === TreeMap) {
        treeMapData().then(done);
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
        var order = d3.range(treeMapFunctions.length);
        order[0] = index;
        order[index] = 0;
        treeMapFunctions = d3.permute(treeMapFunctions, order);
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
