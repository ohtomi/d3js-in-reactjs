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
        d3.select(this.refs.chart).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        this.updateChart();
    },

    componentDidUpdate: function() {
        this.updateChart();
    },

    updateChart: function() {
        var svg = d3.select(this.refs.chart).select('svg');
    },

    render: function() {
        return (
            <div ref="chart"></div>
        );
    }

});

module.exports = HeatMap;

})();
