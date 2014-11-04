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
      var actual, arc, arcs, color, elem, expected, getPercentage, progressNum, scale, size, svg, transform, updateIndicator, updateText;
      size = attr.size || 200;
      scale = size / 200;
      transform = 'scale(' + scale + ') translate( 100px, 100px)';
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
      svg = d3.select(element[0]).append('svg').attr("width", size).attr("height", size);
      elem = svg.append("g").style("transform", transform);
      elem.append("circle").attr("r", 80);
      progressNum = elem.append("text").attr("class", "progress-num").attr("x", 5).attr("y", 10).attr("text-anchor", "middle").text(getPercentage(actual));
      progressNum.append("tspan").text("%");
      elem.append("text").attr("class", "progress-text").attr("x", 5).attr("y", 40).attr("text-anchor", "middle").text('Progress');
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
          color: function(value) {
            return color(getPercentage(value));
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
        return d.color(actual / expected);
      }).attr('stroke', function(d) {
        return d.color(actual / expected);
      }).attr('stroke-linejoin', 'round').style('transform', transform).transition().duration(800).attrTween("d", function(d) {
        return arc(d);
      });
      updateText = function(expected, actual) {
        return progressNum.text(getPercentage(actual)).append("tspan").text("%");
      };
      return updateIndicator = function(expected, actual) {
        var newValue;
        newValue = [expected, actual];
        return svg.selectAll("path").transition().duration(800).attr('fill', function(d, i) {
          return arcs[i].color(actual / expected);
        }).attr('stroke', function(d, i) {
          return arcs[i].color(actual / expected);
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
