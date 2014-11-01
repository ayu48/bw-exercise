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
        if (expected === void 0 || actual === void 0 || isNaN(expected) || isNaN(actual) || expected < 0 || expected > 1 || actual < 0 || actual > 1) {
          return false;
        }
        return true;
      };
      return drawProgressIndicator = function(expected, actual) {
        var arcs, color, elem, percentage, progressNum;
        percentage = Math.round(actual / expected * 100);
        elem = svg.append("g").attr("class", "circle-translate");
        elem.append("circle").attr("r", 80);
        progressNum = elem.append("text").attr("class", "progress-num").attr("dx", -40).attr("dy", 15).attr("textLength", "80px").text(percentage);
        progressNum.append("tspan").text("%");
        elem.append("text").attr("class", "progress-text").attr("dx", -35).attr("dy", 40).attr("textLength", "80px").text('Progress');
        arcs = [
          {
            id: "actual-arc",
            "class": "circle-translate",
            innerRadius: 90,
            outerRadius: 93,
            endAngle: parseFloat(actual)
          }, {
            id: "expected-arc",
            "class": "circle-translate",
            innerRadius: 95,
            outerRadius: 100,
            endAngle: parseFloat(expected)
          }
        ];
        color = d3.scale.linear().domain([0, 60, 100]).range(["#D91500", "#FFBA00", "#60CC00"]);
        return svg.selectAll("path.arc").data(arcs).enter().append("path").attr("id", function(d) {
          return d.id;
        }).attr("class", function(d) {
          return d["class"];
        }).transition().duration(800).attrTween("d", function(d) {
          return d3.svg.arc().innerRadius(d.innerRadius).outerRadius(d.outerRadius).startAngle(0).endAngle(function(t) {
            return t * (d.endAngle / 1) * 2 * Math.PI;
          });
        }).attr('fill', color(percentage));
      };
    }
  };
});

angular.module('BWApp', ['BWProgress']);
