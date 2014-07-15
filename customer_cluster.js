(function(global) {
var drawChart = function(data, opt) {
  var nest, customers, partition, nodes, color, currency, svg, main;

  nest = d3.nest()
    .key(function(d) { return d.campaign; })
    .key(function(d) { return d.gender; })
    .key(function(d) { return 10 * (0 | d.age / 10) + 's'; })
    .key(function(d) { return d.job; });

  customers = nest.rollup(function(values) {
    return d3.sum(values, function(d) {
      return d.lifeTimeValue
    });
  }).entries(data);

  partition = d3.layout.partition()
    .children(function(d) {
      return d.values;
    }).value(function(d) {
      return (0 | d.values);
    });
  nodes = partition.nodes({key: 'All', values: customers});

  color = d3.scale.category10();
  currency = d3.format(',');

  svg = d3.select('#visualization').append('svg')
    .attr('width', opt.width)
    .attr('height', opt.height);

  main = svg.selectAll('g').data(nodes).enter().append('g')
    .classed(function(d) {
      return 'depth' + d.depth;
    }).attr('transform', function(d) {
      return 'translate(' + d.y * opt.width + ',' + d.x * opt.height + ')';
    });

  main.append('rect')
    .attr('width', function(d) { return d.dy * opt.width; })
    .attr('height', function(d) { return d.dx * opt.height; })
    .attr('fill', function(d, idx) { return color(d.depth); })
    .attr('stroke', 'grey')
    .attr('data-val', function(d) { return d.depth; })
    .style('opacity',  function(d) { return d.parent ? d.value / d.parent.value : 0.8; })
    .style('cursor', 'pointer');

  main.append('text').text(function(d) {
    if (d.key) {
      return d.key + ' (' + currency(d.value) + ')';
    } else {
      return '';
    }
  }).attr('dy', 16)
  .attr('dx', 5)
  .style('opacity', function(d) { return d.dx * opt.height > 12 ? 1 : 0; });

  return svg;
}

var uRandom = d3.random.normal(30, 10);
var data = d3.range(1000).map(function(d) {
  return {
    age: 0 | uRandom(),
    gender: (0 | uRandom()) % 2 === 0 ? 'female' : 'male',
    job: 'job' + (0 | uRandom()) % 5,
    campaign: 'campaign' + (0 | uRandom()) % 4,
    lifeTimeValue: (0 | uRandom()) * 123 + (0 | uRandom())
  };
});
var opt = {
  width: 1000,
  height: 600
};

var drawChart_ = function() {
  drawChart(data, opt);
}

App.push(drawChart_);
$('#d3case').append('<option>customer cluster</option>');

}).call(this);
