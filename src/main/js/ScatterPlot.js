// ScatterPlot.js
(function() {

'use strict';

var React = require('react');
var d3 = require('d3');

var ScatterPlot = React.createClass({

    propTypes: {
        dataset: React.PropTypes.array,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xPadding: React.PropTypes.number,
        yPadding: React.PropTypes.number
    },

    componentDidMount: function() {
        var svg = d3.select(this.refs.chart).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        svg.append('g')
            .classed('axis', true)
            .classed('xAxis', true)
            .attr('transform', 'translate(0,' + (this.props.height - this.props.yPadding) + ')');

        svg.append('g')
            .classed('axis', true)
            .classed('yAxis', true)
            .attr('transform', 'translate(' + this.props.xPadding + ',0)');

        this.updateChart();
    },

    componentDidUpdate: function() {
        this.updateChart();
    },

    updateChart: function() {
        var xScale = d3.scale.linear()
            .domain([0, d3.max(this.props.dataset, function(d) {
                return d[0];
            })])
            .range([this.props.xPadding, this.props.width - this.props.xPadding]);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(this.props.dataset, function(d) {
                return d[1];
            })])
            .range([this.props.height - this.props.yPadding, this.props.yPadding]);

        var rScale = d3.scale.linear()
            .domain([0, d3.max(this.props.dataset, function(d) {
                return d[1];
            })])
            .range([2, 5]);

        var colorScale = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);

        var svg = d3.select(this.refs.chart).select('svg');
        svg.selectAll('.xAxis').call(xAxis);
        svg.selectAll('.yAxis').call(yAxis);

        var circles = svg.selectAll('circle')
            .data(this.props.dataset);

        circles
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return xScale(d[0]);
            })
            .attr('cy', function(d) {
                return yScale(d[1]);
            })
            .attr('r', function(d) {
                return rScale(d[1]);
            })
            .attr('fill', function(d, i) {
                return colorScale(i);
            });

        circles
            .transition()
            .attr('cx', function(d) {
                return xScale(d[0]);
            })
            .attr('cy', function(d) {
                return yScale(d[1]);
            })
            .attr('r', function(d) {
                return rScale(d[1]);
            });

        circles
            .exit()
            .remove();
    },

    render: function() {
        return (
            <div ref="chart"></div>
        );
    }

});

module.exports = ScatterPlot;

})();
