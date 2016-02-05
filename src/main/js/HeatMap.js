// HeatMap.js
(function() {

'use strict';

var React = require('react');
var d3 = require('d3');

var HeatMap = React.createClass({

    propTypes: {
        dataset: React.PropTypes.array,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        xPadding: React.PropTypes.number,
        yPadding: React.PropTypes.number
    },

    contextTypes: {
        emitter: React.PropTypes.object
    },

    componentDidMount: function() {
        var svg = d3.select(this.refs.chart).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        svg.append('g')
            .classed('axis', true)
            .classed('xAxis', true);

        svg.append('g')
            .classed('axis', true)
            .classed('yAxis', true);

        this.updateChart();
    },

    componentDidUpdate: function() {
        this.updateChart();
    },

    updateChart: function() {
        var xScale = d3.scale.linear()
            .domain([0, 7])
            .range([this.props.xPadding, this.props.width - this.props.xPadding]);

        var yScale = d3.scale.linear()
            .domain([0, parseInt(23 / 3)])
            .range([this.props.yPadding, this.props.height - this.props.yPadding]);

        var maxCommits = d3.max(this.props.dataset, function(d) {
            return d3.max(d.values, function(dd) {
                return dd.values;
            });
        });

        var colorScale = d3.scale.linear()
            .domain([0, maxCommits / 2, maxCommits])
            .range(['yellow', 'orange', 'red']);

        var svg = d3.select(this.refs.chart).select('svg');

        var groupsOfDow = svg.selectAll('g.groupsOfDow')
            .data(this.props.dataset);

        groupsOfDow
            .enter()
            .append('g')
            .classed('groupsOfDow', true);

        groupsOfDow
            .attr('transform', function(d, i) {
                return 'translate(' + xScale(i) + ',0)';
            });

        groupsOfDow
            .exit()
            .remove();

        var rects = groupsOfDow.selectAll('rect')
            .data(function(d) {
                return d.values;
            });

        rects
            .enter()
            .append('rect');

        rects
            .attr('width', function() {
                return xScale(1) - xScale(0);
            })
            .attr('height', function() {
                return yScale(1) - yScale(0);
            })
            .attr('y', function(d) {
                return yScale(d.key);
            })
            .attr('fill', function(d) {
                return colorScale(d.values);
            })
            .attr('stroke', 'grey');

        rects
            .exit()
            .remove();

        var xTexts = svg.select('g.xAxis').selectAll('text.x')
            .data(this.props.dataset);

        xTexts
            .enter()
            .append('text')
            .classed('x', true);

        xTexts
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', this.props.height)
            .text(function(d) {
                return d.key;
            });

        xTexts
            .exit()
            .remove();

        var yTexts = svg.select('g.yAxis').selectAll('text.y')
            .data(d3.range(0, parseInt(23 / 3)));

        yTexts
            .enter()
            .append('text')
            .classed('y', true);

        yTexts
            .attr('x', 0)
            .attr('y', function(d) {
                return yScale(d) + (yScale(1) - yScale(0)) / 2;
            })
            .text(function(d) {
                return d * 3 + '-' + (d + 1) * 3;
            });

        yTexts
            .exit()
            .remove();
    },

    render: function() {
        return (
            <div ref="chart"></div>
        );
    }

});

module.exports = HeatMap;

})();
