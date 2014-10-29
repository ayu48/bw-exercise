angular.module('components', []).directive('progressIndicator', function() {
  return {
    scope: {},
    link: function(scope, element, attr) {
      var circle, elem, svg, text;
      svg = d3.select(element[0]).append('svg').attr("width", 300).attr("height", 300);
      elem = svg.append("g").attr("transform", "translate( 150, 150)");
      circle = elem.append("circle").attr("r", 80).style("fill", "#F0F0F0");
      text = elem.append("text").attr("dx", -40).attr("dy", 15).attr("font-size", "60px").attr("textLength", "80px").text('73');
      text.append("tspan").attr("font-size", "30px").text("%");
      return elem.append("text").attr("dx", -35).attr("dy", 40).attr("font-size", "23px").attr("textLength", "80px").attr("fill", "#909090").text('Progress');
    }
  };
});

angular.module('BWApp', ['components']);
