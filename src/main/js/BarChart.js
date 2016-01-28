// BarChart.js
(function() {

'use strict';

var React = require('react');
var d3 = require('d3');

var BarChart = React.createClass({

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
            .domain([0, this.props.dataset.length])
            .range([this.props.xPadding, this.props.width - this.props.xPadding]);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(this.props.dataset, function(d) {
                return d[0];
            })])
            .range([this.props.height - this.props.yPadding, this.props.yPadding]);

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

        var that = this;
        var rects = svg.selectAll('rect')
            .data(this.props.dataset);

        rects
            .enter()
            .append('rect')
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', function(d) {
                return yScale(d[0]);
            })
            .attr('width',
                Math.round((this.props.width - this.props.xPadding) / this.props.dataset.length))
            .attr('height', function(d) {
                return that.props.height - that.props.yPadding - yScale(d[0]);
            })
            .attr('fill', function(d, i) {
                return colorScale(i);
            });

        rects
            .transition()
            .attr('y', function(d) {
                return yScale(d[0]);
            })
            .attr('height', function(d) {
                return that.props.height - that.props.yPadding - yScale(d[0]);
            });

        rects
            .exit()
            .remove();
    },

    render: function() {
        return (
            <div ref="chart"></div>
        );
    }

});

module.exports = BarChart;

})();
