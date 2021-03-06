// DataStore.js
(function() {

'use strict';

var d3 = require('d3');
var _ = require('underscore');
var request = require('superagent');

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

var dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

var heatMapFunctions = [
    {
        key: 'dayOfTheWeek',
        func: function(value) {
            return value;
        },
        sort: function(a, b) {
            return _.indexOf(dows, a) - _.indexOf(dows, b);
        }
    },
    {
        key: 'hour',
        func: function(value) {
            return parseInt(value / 3);
        }
    }
];

function fetchCommitData(nestFunctions) {
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

                var nest = _.chain(nestFunctions)
                    .reduce(function(nest, attr) {
                        nest = nest.key(function(d) {
                            return attr.func(d[attr.key]);
                        });
                        if (attr.sort) {
                            nest = nest.sortKeys(function(a, b) {
                                return attr.sort(a, b);
                            });
                        }
                        return nest;
                    }, d3.nest())
                    .value();

                var commitCount = nest.rollup(function(values) {
                        return d3.sum(values, function() {
                            return 1;
                        });
                    })
                    .entries(commits);

                resolve(commitCount);
            });
    });
}

var DataStore = {

    scatterPlotData: function() {
        return Promise.resolve(generatePairData());
    },

    barChartData: function() {
        return Promise.resolve(generatePairData());
    },

    permuteTreeMapFunctions: function(index) {
        var order = d3.range(treeMapFunctions.length);
        order[0] = index;
        order[index] = 0;
        treeMapFunctions = d3.permute(treeMapFunctions, order);
    },

    treeMapData: function() {
        return new Promise(function(resolve, reject) {
            fetchCommitData(treeMapFunctions)
                .then(function(commitCount) {
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
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    },

    heatMapData: function() {
        return new Promise(function(resolve, reject) {
            fetchCommitData(heatMapFunctions)
                .then(function(commitCount) {
                    var dataset = commitCount;
                    resolve(dataset);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

};

module.exports = DataStore;

})();
