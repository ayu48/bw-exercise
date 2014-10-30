angular.module('BWProgress', []).controller('Controller', [
  '$scope', function($scope) {
    $scope.expected = 1;
    $scope.actual = 0.23;
    return $scope.showProgress = function() {
      return $scope.redrawProgressIndicator();
    };
  }
]).directive('progressIndicator', function($parse) {
  return {
    link: function(scope, element, attr) {
      var actualNum, drawProgressIndicator, expectedNum, percentage, svg;
      actualNum = $parse(attr.actual)(scope);
      expectedNum = $parse(attr.expected)(scope);
      percentage = actualNum / expectedNum * 100;
      svg = d3.select(element[0]).append('svg');
      scope.redrawProgressIndicator = function() {
        actualNum = $parse(attr.actual)(scope);
        expectedNum = $parse(attr.expected)(scope);
        percentage = actualNum / expectedNum * 100;
        svg.selectAll("*").remove();
        return drawProgressIndicator();
      };
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
