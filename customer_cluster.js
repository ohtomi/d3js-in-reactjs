(function(global) {
var drawChart = function(svg, data, attributes, opt) {
  var nest, customers, partition, nodes, color, currency, main, g;

  nest = d3.nest();
  attributes.forEach(function(attribute) {
    if (attribute === 'age') {
      nest.key(function(d) { return 10 * (0 | d[attribute] / 10) + 's'; });
    } else {
      nest.key(function(d) { return d[attribute]; });
    }
  });

  customers = nest.rollup(function(values) {
    return d3.sum(values, function(d) {
      return d.lifeTimeValue;
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

  main = svg.append('g')
    .attr('width', opt.width)
    .attr('height', opt.height + opt.margin.height);

  g = main.selectAll('g').data(nodes).enter().append('g')
    .attr('transform', function(d) {
      return 'translate(' + d.y * opt.width + ',' + (d.x * opt.height + opt.margin.height) + ')';
    });

  g.append('rect')
    .attr('width', function(d) { return d.dy * opt.width; })
    .attr('height', function(d) { return d.dx * opt.height; })
    .attr('fill', function(d, idx) { return color(d.depth); })
    .attr('stroke', 'grey')
    .attr('data-val', function(d) { return d.depth; })
    .style('opacity',  function(d) { return d.parent ? d.value / d.parent.value : 0.8; })
    .style('cursor', 'pointer');

  g.append('text').text(function(d) {
    if (d.key) {
      return d.key + ' (' + currency(d.value) + ')';
    } else {
      return '';
    }
  }).attr('dy', 16)
    .attr('dx', 5)
    .style('opacity', function(d) { return d.dx * opt.height > 12 ? 1 : 0; });

  return main;
}

var appendController = function(svg, attributes, opt) {
  var color, w, triangle, ctrl, ctrlCell;

  color = d3.scale.category10();
  w = opt.width / (attributes.length + 1);
  triangle = d3.svg.symbol().type('triangle-up');

  ctrl = svg.append('g')
    .attr('width', opt.width)
    .attr('height', opt.margin.height)
    .attr('transform' ,'translate(0,0)');

  ctrlCell = ctrl.selectAll('g').data(d3.range(attributes.length + 1)).enter().append('g')
    .attr('transform', function(d, idx) {
      return 'translate(' + (idx * w) + ',0)';
    });

  ctrlCell.append('rect')
    .attr('width', w)
    .attr('height', opt.margin.height - 5)
    .attr('fill', function(d, idx) {
      return color(idx);
    }).attr('stroke', 'none')
    .style('opacity', 0.5);

  ctrlCell.append('path').classed('toLeft', true)
    .attr('d', triangle)
    .style('cursor', 'pointer')
    .attr('transform', 'translate(20, 20) rotate(-90)')
    .style('opacity', function(d, idx) {
      return (idx <= 1) ? 0 : 1;
    });

  ctrlCell.append('path').classed('toRight', true)
    .attr('d', triangle)
    .style('cursor', 'pointer')
    .attr('transform', 'translate(' + (w - 20) + ', 20) rotate(90)')
    .style('opacity', function(d, idx) {
      return (idx === 0 || idx === attributes.length) ? 0 : 1;
    });

  return ctrl;
};

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
var attributes = ['campaign', 'gender', 'age', 'job'];
var opt = {
  width: 1200,
  height: 600,
  margin: {
    height: 40
  }
};

var drawChart_ = function() {
  var svg = d3.select('#visualization').append('svg')
    .attr('width', opt.width)
    .attr('height', opt.height + opt.margin.height);

  var main = drawChart(svg, data, attributes, opt);

  var ctrl = appendController(svg, attributes, opt);
  ctrl.selectAll('path.toLeft').on('click', function(d, idx) {
    var a = attributes[idx - 2];
    attributes[idx - 2] = attributes[idx -1];
    attributes[idx - 1] = a;
    main.remove();
    main = drawChart(svg, data, attributes, opt);
  });
  ctrl.selectAll('path.toRight').on('click', function(d, idx) {
    var a = attributes[idx - 1];
    attributes[idx - 1] = attributes[idx];
    attributes[idx] = a;
    main.remove();
    main = drawChart(svg, data, attributes, opt);
  });
}

App.push(drawChart_);
$('#d3case').append('<option>customer cluster</option>');

}).call(this);
