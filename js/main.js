angular.module('BWProgress', []).factory('Utilities', function() {
  return {
    isValid: function(value) {
      return value && !isNaN(value) && value <= 1 && value >= 0;
    }
  };
}).directive('invalidMessage', function(Utilities) {
  return {
    restrict: 'AE',
    scope: {
      expected: '=',
      actual: '='
    },
    template: '<div ng-if="!valid">Invalid Value</div>',
    link: function(scope, element, attrs) {
      scope.$watchCollection('[expected, actual]', function(_arg) {
        var actual, expected;
        expected = _arg[0], actual = _arg[1];
        return scope.valid = Utilities.isValid(expected) && Utilities.isValid(actual);
      });
    }
  };
}).directive('progressIndicator', function(Utilities) {
  return {
    restrict: 'E',
    scope: {
      expected: '=',
      actual: '='
    },
    link: function(scope, element, attr) {
      var actual, arc, arcs, color, elem, expected, getPercentage, progressNum, svg, updateIndicator, updateText;
      expected = 0;
      actual = 0;
      scope.$watchCollection('[expected, actual]', function(_arg) {
        var actual, expected;
        expected = _arg[0], actual = _arg[1];
        if (Utilities.isValid(expected) && Utilities.isValid(actual)) {
          updateIndicator(expected, actual);
          return updateText(expected, actual);
        }
      });
      getPercentage = function(value) {
        return Math.round(value * 100);
      };
      svg = d3.select(element[0]).append('svg');
      elem = svg.append("g").attr("class", "circle-translate");
      elem.append("circle").attr("r", 80);
      progressNum = elem.append("text").attr("class", "progress-num").attr("dx", -44).attr("dy", 15).attr("textLength", "98px").text(getPercentage(actual));
      progressNum.append("tspan").text("%");
      elem.append("text").attr("class", "progress-text").attr("dx", -35).attr("dy", 40).attr("textLength", "80px").text('Progress');
      color = d3.scale.linear().domain([0, 60, 100]).range(["#D91500", "#FFBA00", "#60CC00"]);
      arcs = [
        {
          "class": "expected-arc circle-translate",
          color: function() {
            return '#A8A8A8';
          },
          innerRadius: 90,
          outerRadius: 91,
          endAngle: parseFloat(expected)
        }, {
          "class": "actual-arc circle-translate",
          color: function(actual) {
            return color(getPercentage(actual));
          },
          innerRadius: 96,
          outerRadius: 97,
          endAngle: parseFloat(actual)
        }
      ];
      arc = d3.svg.arc().innerRadius(function(d) {
        return d.innerRadius;
      }).outerRadius(function(d) {
        return d.outerRadius;
      }).startAngle(0).endAngle(function(d) {
        return (d.endAngle / 1) * 2 * Math.PI;
      });
      svg.selectAll("path.arc").data(arcs).enter().append("path").attr("class", function(d) {
        return d["class"];
      }).attr('fill', function(d) {
        return d.color(actual);
      }).attr('stroke', function(d) {
        return d.color(actual);
      }).attr('stroke-linejoin', 'round').transition().duration(800).attrTween("d", function(d) {
        return arc(d);
      });
      updateText = function(expected, actual) {
        return progressNum.text(getPercentage(actual)).append("tspan").text("%");
      };
      return updateIndicator = function(expected, actual) {
        var newValue;
        newValue = [expected, actual];
        return svg.selectAll("path").transition().duration(800).attr('fill', function(d, i) {
          return arcs[i].color(actual);
        }).attr('stroke', function(d, i) {
          return arcs[i].color(actual);
        }).attrTween("d", function(d, i) {
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
