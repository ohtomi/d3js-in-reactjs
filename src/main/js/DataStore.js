// DataStore.js
(function() {

'use strict';

var d3 = require('d3');
var _ = require('underscore');
var request = require('superagent');

var DataStore = {

    generatePairData: function() {
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
        return Promise.resolve(this.generatePairData());
    },

    barChartData: function() {
        return Promise.resolve(this.generatePairData());
    },

    treeMapFunctions: [
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
    ],

    permuteTreeMapFunctions: function(index) {
        var order = d3.range(this.treeMapFunctions.length);
        order[0] = index;
        order[index] = 0;
        this.treeMapFunctions = d3.permute(this.treeMapFunctions, order);
    },

    treeMapData: function() {
        var dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var that = this;
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

                    var nest = _.chain(that.treeMapFunctions)
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

};

module.exports = DataStore;

})();
