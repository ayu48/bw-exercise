angular.module('BWProgress', []).directive('progressIndicator', function($parse) {
  return {
    restrict: 'E',
    scope: {
      expected: "=",
      actual: "="
    },
    link: function(scope, element, attr) {
      var actual, arc, arcs, color, elem, expected, getPercentage, isValid, progressNum, svg, updateIndicator, updateText;
      expected = 0;
      actual = 0;
      scope.$watchCollection('[expected, actual]', function(_arg) {
        var actual, expected;
        expected = _arg[0], actual = _arg[1];
        if (isValid(expected) && isValid(actual)) {
          updateIndicator(expected, actual);
          return updateText(expected, actual);
        }
      });
      isValid = function(value) {
        if (value && !isNaN(value) && value <= 1 && value >= 0) {
          return true;
        }
        return false;
      };
      getPercentage = function(expected, actual) {
        return Math.round(actual / expected * 100);
      };
      svg = d3.select(element[0]).append('svg');
      elem = svg.append("g").attr("class", "circle-translate");
      elem.append("circle").attr("r", 80);
      progressNum = elem.append("text").attr("class", "progress-num").attr("dx", -44).attr("dy", 15).attr("textLength", "98px").text(getPercentage(expected, actual));
      progressNum.append("tspan").text("%");
      elem.append("text").attr("class", "progress-text").attr("dx", -35).attr("dy", 40).attr("textLength", "80px").text('Progress');
      arcs = [
        {
          "class": "actual-arc circle-translate",
          innerRadius: 90,
          outerRadius: 93,
          endAngle: parseFloat(actual)
        }, {
          "class": "expected-arc circle-translate",
          innerRadius: 95,
          outerRadius: 100,
          endAngle: parseFloat(expected)
        }
      ];
      color = d3.scale.linear().domain([0, 60, 100]).range(["#D91500", "#FFBA00", "#60CC00"]);
      arc = d3.svg.arc().innerRadius(function(d) {
        return d.innerRadius;
      }).outerRadius(function(d) {
        return d.outerRadius;
      }).startAngle(0).endAngle(function(d) {
        return (d.endAngle / 1) * 2 * Math.PI;
      });
      svg.selectAll("path.arc").data(arcs).enter().append("path").attr("class", function(d) {
        return d["class"];
      }).attr('fill', color(getPercentage(expected, actual))).transition().duration(800).attrTween("d", function(d) {
        return arc(d);
      });
      updateText = function(expected, actual) {
        return progressNum.text(getPercentage(expected, actual)).append("tspan").text("%");
      };
      return updateIndicator = function(expected, actual) {
        var newValue;
        newValue = [actual, expected];
        return svg.selectAll("path").transition().duration(800).attr('fill', color(getPercentage(expected, actual))).attrTween("d", function(d, i) {
          var interpolate;
          interpolate = d3.interpolate(d.endAngle, newValue[i]);
          return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        });
      };
    }
  };
});

angular.module('BWApp', ['BWProgress']);
