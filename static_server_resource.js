(function(global) {
var drawChart = function(data, info, opt) {
  var svg, main, xExtent, yExtent, x, y, color, line, path, xaxis, yaxis, xAxis, yAxis;

  svg = d3.select('#visualization').append('svg')
    .attr('width', opt.width + opt.margin.width)
    .attr('height', opt.height + opt.margin.height);
  main = svg.append('g')
    .attr('width', opt.width)
    .attr('height', opt.height)
    .attr('transform', 'translate(' + opt.margin.left + ', ' + opt.margin.top + ')');

  if (opt.title) {
    svg.append('text').classed('chart-title', true).text(opt.title)
      .attr('dx', '1em').attr('dy', '1.25em');
  }

  xExtent = d3.extent(data, function(d) { return new Date(d.epoch * 1000); });
  yExtent = d3.extent(data, function(d) { return +d[info]; });

  x = d3.time.scale().range([0, opt.width]).domain(xExtent);
  //y = d3.scale.linear().range([opt.height, 0]).domain([0, yExtent[1]]);
  y = d3.scale.linear().range([opt.height, 0]).domain([0, 100]);
  color = d3.scale.category10();

  line = d3.svg.line()
    .x(function(d) { return x(new Date(d.epoch * 1000)); })
    .y(function(d) { return y(+d[info]); });

  path = main.append('path').datum(data)
    .attr({
      class: 'line',
      d: line,
      fill: 'none',
      stroke: color(0)
    });

  xaxis = d3.svg.axis().scale(x).ticks(6).tickFormat(d3.time.format('%m/%d %H:%M'));
  yaxis = d3.svg.axis().orient('left').scale(y).ticks(4).tickFormat(d3.format('s'));
  xAxis = main.append('g').classed('axis', true).call(xaxis)
    .attr('transform', 'translate(0, ' + opt.height +')');
  yAxis = main.append('g').classed('axis', true).call(yaxis);

  return svg;
}

var origin = new Date('2014/07/01 12:00:00').getTime();
var uRandom = d3.random.normal(50, 10);
var data = d3.range(1000).map(function(d) {
  return {
    epoch: origin / 1000 + d * 60,
    'total_cpu_usage.usr': uRandom()
  };
});
var info = 'total_cpu_usage.usr';
var opt = {
  width: 1000,
  height: 100,
  margin: {
    width: 70,
    height: 70,
    left: 50,
    top: 40
  },
  title: info
};

var drawChart_ = function() {
  drawChart(data, info, opt);
}

App.push(drawChart_);
$('#d3case').append('<option>static server resource</option>');

}).call(this);
