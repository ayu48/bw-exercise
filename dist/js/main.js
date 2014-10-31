angular.module('BWProgress', []).directive('progressIndicator', function($parse) {
  return {
    restrict: 'E',
    scope: {
      expected: "=",
      actual: "="
    },
    link: function(scope, element, attr) {
      var drawProgressIndicator, isValid, svg;
      scope.$watchCollection('[expected, actual]', function(_arg) {
        var actual, expected;
        expected = _arg[0], actual = _arg[1];
        if (isValid(expected, actual)) {
          svg.selectAll("*").remove();
          return drawProgressIndicator(expected, actual);
        }
      });
      svg = d3.select(element[0]).append('svg');
      isValid = function(expected, actual) {
        if (expected === void 0 || actual === void 0) {
          !isNaN(expected) || !isNaN(actual);
          expected < 0 || expected > 1;
          actual < 0 || actual > 1;
          return false;
        }
        return true;
      };
      return drawProgressIndicator = function(expected, actual) {
        var actualArc, elem, expectedArc, percentage, progressNum;
        percentage = Math.round(actual / expected * 100);
        elem = svg.append("g").attr("class", "circle-translate");
        elem.append("circle").attr("r", 80);
        progressNum = elem.append("text").attr("class", "progress-num").attr("dx", -40).attr("dy", 15).attr("textLength", "80px").text(percentage);
        progressNum.append("tspan").text("%");
        elem.append("text").attr("class", "progress-text").attr("dx", -35).attr("dy", 40).attr("textLength", "80px").text('Progress');
        actualArc = d3.svg.arc().innerRadius(90).outerRadius(93).startAngle(0).endAngle((actual / 1.0) * 2 * Math.PI);
        svg.append("path").attr("class", "circle-translate actual-arc").attr("d", actualArc);
        expectedArc = d3.svg.arc().innerRadius(95).outerRadius(100).startAngle(0).endAngle((expected / 1.0) * 2 * Math.PI);
        return svg.append("path").attr("d", expectedArc).attr("class", "circle-translate expected-arc");
      };
    }
  };
});

angular.module('BWApp', ['BWProgress']);
