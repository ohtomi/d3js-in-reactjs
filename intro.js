(function(global) {
var drawChart = function() {
  var circle, circleWithData, colors, data, div, height, r, svg, width;

  width = 600;
  height = 600;
  r = 30;
  //colors = ["green", "red", "orange", "blue", "yellow", "cyan", "grey", "magenta", "purple", "brown", "black"];
  colors = d3.scale.category10();

  data = d3.range(10).map(function(d) {
    return {
      cx: 0 | Math.random() * width,
      cy: 0 | Math.random() * height,
      r: 0 | (Math.random() * r + r)
    };
  });

  div = d3.select('div#visualization');

  svg = div.append('svg');
  svg.attr('width', width).attr('height', height);

  var circlesInSVG = svg.selectAll('circle');

  circleWithData = circlesInSVG.data(data);
  circleWithDataSelection = circleWithData.enter();
  circlesInNewCircle = circleWithDataSelection.append('circle');
  circlesInNewCircle
    .attr('r', function(d) { return d.r; })
    .attr('cx', function(d) { return d.cx; })
    .attr('cy', function(d) { return d.cy; })
    .attr('fill', function(d, idx) {
      return colors(idx);
      //return colors[idx % colors.length];
    })
    .style('opacity', 0.6);
};

App.push(drawChart);
$('#d3case').append('<option>intro</option>');

}).call(this);
