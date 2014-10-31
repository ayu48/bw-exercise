angular.module('BWProgress', []).directive('progressIndicator', function($parse) {
  return {
    scope: {
      expected: "=",
      actual: "="
    },
    link: function(scope, element, attr) {
      var actualNum, drawProgressIndicator, expectedNum, percentage, svg;
      expectedNum = 1;
      actualNum = 0.23;
      percentage = actualNum / expectedNum * 100;
      scope.$watchCollection('[expected, actual]', function(_arg) {
        var actual, expected;
        expected = _arg[0], actual = _arg[1];
        expectedNum = expected;
        actualNum = actual;
        percentage = actualNum / expectedNum * 100;
        svg.selectAll("*").remove();
        return drawProgressIndicator();
      });
      svg = d3.select(element[0]).append('svg');
      drawProgressIndicator = function() {
        var actualArc, elem, expectedArc, progressNum;
        elem = svg.append("g").attr("class", "circle-translate");
        elem.append("circle").attr("r", 80);
        progressNum = elem.append("text").attr("class", "progress-num").attr("dx", -40).attr("dy", 15).attr("textLength", "80px").text(percentage);
        progressNum.append("tspan").text("%");
        elem.append("text").attr("class", "progress-text").attr("dx", -35).attr("dy", 40).attr("textLength", "80px").text('Progress');
        actualArc = d3.svg.arc().innerRadius(90).outerRadius(93).startAngle(0).endAngle((actualNum / 1.0) * 2 * Math.PI);
        svg.append("path").attr("class", "circle-translate actual-arc").attr("d", actualArc);
        expectedArc = d3.svg.arc().innerRadius(95).outerRadius(100).startAngle(0).endAngle((expectedNum / 1.0) * 2 * Math.PI);
        return svg.append("path").attr("d", expectedArc).attr("class", "circle-translate expected-arc");
      };
      return drawProgressIndicator();
    }
  };
});

angular.module('BWApp', ['BWProgress']);
