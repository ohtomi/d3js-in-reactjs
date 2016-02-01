// TreeMap.js
(function() {

'use strict';

var React = require('react');
var d3 = require('d3');
var _ = require('underscore');

var TreeMap = React.createClass({

    propTypes: {
        dataset: React.PropTypes.array,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xPadding: React.PropTypes.number,
        yPadding: React.PropTypes.number
    },

    componentDidMount: function() {
        d3.select(this.refs.chart).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        this.updateChart();
    },

    componentDidUpdate: function() {
        this.updateChart();
    },

    updateChart: function() {
        var attrs = [
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
            }];

        var nest = _.chain(attrs)
            .reduce(function(nest, attr) {
                return nest.key(function(d) {
                    return attr.func(d[attr.key]);
                });
            }, d3.nest())
            .value();

        var commits = nest.rollup(function(values) {
                return d3.sum(values, function() {
                    return 1;
                });
            })
            .entries(this.props.dataset);

        var partition = d3.layout.partition()
            .children(function(d) {
                return d.values;
            })
            .value(function(d) {
                return d.values;
            });

        var nodes = partition.nodes({
            key: 'All',
            values: commits
        });

        var colorScale = d3.scale.category10();

        var that = this;

        var svg = d3.select(this.refs.chart).select('svg');

        var rects = svg.selectAll('rect')
            .data(nodes);

        rects
            .enter()
            .append('rect');

        rects
            .attr('transform', function(d) {
                return 'translate(' + d.y * that.props.width + ',' + d.x * that.props.height + ')';
            })
            .attr('width', function(d) {
                return d.dy * that.props.width;
            })
            .attr('height', function(d) {
                return d.dx * that.props.height;
            })
            .attr('fill', function(d) {
                return colorScale(d.depth);
            })
            .attr('stroke', 'grey')
            .attr('data-val', function(d) {
                return d.depth;
            })
            .style('opacity', function(d) {
                return d.parent ? d.value / d.parent.value : 0.8;
            })
            .style('cursor', 'pointer');

        rects
            .exit()
            .remove();

        var texts = svg.selectAll('text')
            .data(nodes);

        texts
            .enter()
            .append('text');

        texts
            .attr('x', function(d) {
                return d.y * that.props.width + 30;
            })
            .attr('y', function(d) {
                return d.x * that.props.height + (d.dx * that.props.height + 15) / 2;
            })
            .style('opacity', function(d) {
                return (d.dx * that.props.height) > 20 ? 1.0 : 0.0;
            })
            .text(function(d) {
                return d.key + ': ' + d.value + ' commit(s)';
            });
    },

    render: function() {
        return (
            <div ref="chart"></div>
        );
    }

});

module.exports = TreeMap;

})();
