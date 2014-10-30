angular.module('BWProgress', []).controller('Controller', [
  '$scope', function($scope) {
    $scope.expected = 1;
    $scope.actual = 0.23;
    return $scope.showProgress = function() {};
  }
]).directive('progressIndicator', function($parse) {
  return {
    link: function(scope, element, attr) {
      var actual, actualArc, elem, expected, expectedArc, percentage, progressNum, svg;
      actual = $parse(attr.actual)(scope);
      expected = $parse(attr.expected)(scope);
      percentage = actual / expected * 100;
      svg = d3.select(element[0]).append('svg');
      elem = svg.append("g").attr("class", "circle-translate");
      elem.append("circle").attr("r", 80);
      progressNum = elem.append("text").attr("class", "progress-num").attr("dx", -40).attr("dy", 15).attr("textLength", "80px").text(percentage);
      progressNum.append("tspan").text("%");
      elem.append("text").attr("class", "progress-text").attr("dx", -35).attr("dy", 40).attr("textLength", "80px").text('Progress');
      actualArc = d3.svg.arc().innerRadius(90).outerRadius(93).startAngle(0).endAngle((actual / 1.0) * 2 * Math.PI);
      svg.append("path").attr("class", "circle-translate actual-arc").attr("d", actualArc);
      expectedArc = d3.svg.arc().innerRadius(95).outerRadius(100).startAngle(0).endAngle((expected / 1.0) * 2 * Math.PI);
      return svg.append("path").attr("d", expectedArc).attr("class", "circle-translate expected-arc");
    }
  };
});

angular.module('BWApp', ['BWProgress']);
