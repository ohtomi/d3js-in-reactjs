// TreeMap.js
(function() {

'use strict';

var React = require('react');
var d3 = require('d3');

var TreeMap = React.createClass({

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
        d3.select(this.refs.chart).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        this.updateChart();
    },

    componentDidUpdate: function() {
        this.updateChart();
    },

    updateChart: function() {
        var colorScale = d3.scale.category10();

        var that = this;

        var svg = d3.select(this.refs.chart).select('svg');

        var rects = svg.selectAll('rect')
            .data(this.props.dataset);

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
            .style('cursor', 'pointer')
            .on('click', function(d) {
                if (d.depth === 0) {
                    return;
                }
                var index = d.depth - 1;
                that.context.emitter.emit('click:rect', index);
            });

        rects
            .exit()
            .remove();

        var texts = svg.selectAll('text')
            .data(this.props.dataset);

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

        texts
            .exit()
            .remove();
    },

    render: function() {
        return (
            <div ref="chart"></div>
        );
    }

});

module.exports = TreeMap;

})();
