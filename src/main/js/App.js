// App.js
(function() {

'use strict';

var React = require('react');
var Chart = require('./Chart');

var App = React.createClass({

    getInitialState: function() {
        return {
            seed: 0,
            dataset: [],
            width: 800,
            height: 400,
            xPadding: 40,
            yPadding: 20
        };
    },

    componentDidMount: function() {
        this.refreshData();
    },

    refreshData: function() {
        var seed = this.state.seed;
        var dataset = [];
        var numDataPoints = 50;
        var xRange = Math.random() * 1000;
        var yRange = Math.random() * 1000;
        for (var i = 0; i < numDataPoints; i++) {
            var newNumber1 = Math.round(Math.random() * xRange);
            var newNumber2 = Math.round(Math.random() * yRange);
            dataset.push([newNumber1, newNumber2, seed++]);
        }
        this.setState({
            seed: seed,
            dataset: dataset
        });
    },

    render: function() {
        return (
            <div>
                <div style={{width: '800px'}}>
                    <div style={{float: 'right'}}>
                        <a href="#" onClick={this.refreshData}>Refresh Data</a>
                    </div>
                </div>
                <div>
                    <Chart {...this.state} />
                </div>
            </div>
        );
    }

});

module.exports = App;

})();
