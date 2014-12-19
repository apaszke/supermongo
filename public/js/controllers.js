var supermongoControllers = angular.module('supermongoControllers', []);

supermongoControllers.controller('MainCtrl', function($scope) {
  function generateoplogChart() {
    var n = 40,
        random = d3.random.normal(0, .2),
        data = d3.range(n).map(function(i) {
          return {
            time: d3.time.second.offset(Date.now(), i-n),
            value: random()
          }
        });

    var svgSize = document.getElementById("oplogChart").getBoundingClientRect();

    var margin = {top: 10, right: 20, bottom: 20, left: 80},
        width = parseInt(svgSize.width),
        height = parseInt(svgSize.height);

    var x = d3.time.scale()
      .domain([data[1].time, data[n-2].time])
      .rangeRound([0, width - margin.left - margin.right]);

    var y = d3.scale.linear()
        .domain([-1, 1])
        .range([height, 0]);

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d, i) { return x(d.time); })
        .y(function(d, i) { return y(d.value); });

    var svg = d3.select("#oplogChart")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

    var path = svg.append("g")
        .attr("clip-path", "url(#clip)")
      .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    function tick() {

      // push a new data point onto the back
      data.push({
        time: d3.time.second.offset(Date.now(), 0),
        value: random()
      });

      // redraw the line, and slide it to the left
      path
          .attr("d", line)
          .attr("transform", null)
        .transition()
          .duration(1000)
          .ease("linear")
          .attr("transform", "translate(" + x(data[0].time) + ",0)");

      x
        .domain([data[2].time, data[n-1].time])

      svg.select(".x.axis")
      	.transition()
      	.duration(1000)
      	.ease("linear")
      	.call(xAxis)
        .each("end", tick);


      // pop the old data point off the front
      data.shift();

    }


    tick();
  }

  function generateCollectionsChart() {
    var data = [{ size: 40 }, { size: 10 }, { size: 50 }, { size: 20 }];

    var svgSize = document.getElementById("collectionsChart").getBoundingClientRect();

    var margins = { top: 10 };

    var width = parseInt(svgSize.width),
        height = parseInt(svgSize.height);

    var radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.size; });

    var svg = d3.select("#collectionsChart")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 +margins.top)  + ")");

    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return "Collection"; });

  }

  generateoplogChart();
  generateCollectionsChart();

})
