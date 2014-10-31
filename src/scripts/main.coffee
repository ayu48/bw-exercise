angular.module('BWProgress', [])
  .directive('progressIndicator', ($parse)->
    return {
      restrict: 'E'
      scope:
        expected: "="
        actual: "="
      link: (scope, element, attr) ->

        scope.$watchCollection '[expected, actual]', ([expected, actual]) ->
          if isValid(expected, actual)
            svg.selectAll("*").remove()
            drawProgressIndicator(expected, actual)

        svg = d3.select(element[0]).append('svg')

        isValid = (expected, actual)->
          if expected is undefined or actual is undefined
            expected < 0 || expected > 1
            actual < 0 || actual > 1
            return false
          return true

        drawProgressIndicator = (expected, actual) ->
          percentage = actual/expected * 100

          elem = svg.append("g")
            .attr("class", "circle-translate")

          #inner circle
          elem.append("circle")
            .attr("r", 80)

          progressNum = elem.append("text")
            .attr("class", "progress-num")
            .attr("dx", -40)
            .attr("dy", 15)
            .attr("textLength", "80px")
            .text(percentage)

          progressNum.append("tspan")
            .text("%")

          elem.append("text")
            .attr("class", "progress-text")
            .attr("dx", -35)
            .attr("dy", 40)
            .attr("textLength", "80px")
            .text('Progress')

          #actual arc
          actualArc = d3.svg.arc()
            .innerRadius(90)
            .outerRadius(93)
            .startAngle(0)
            .endAngle((actual/1.0) * 2 * Math.PI)

          svg.append("path")
            .attr("class", "circle-translate actual-arc")
            .attr("d", actualArc)

          #expected arc
          expectedArc = d3.svg.arc()
            .innerRadius(95)
            .outerRadius(100)
            .startAngle(0)
            .endAngle((expected/1.0) * 2 * Math.PI)

          svg.append("path")
            .attr("d", expectedArc)
            .attr("class", "circle-translate expected-arc")
    }
  )

angular.module 'BWApp', ['BWProgress']
