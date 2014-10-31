angular.module('BWProgress', [])
  .directive('progressIndicator', ($parse)->
    return {
      scope:
        expected: "="
        actual: "="
      link: (scope, element, attr) ->
        #TODO check valid input
        expectedNum = 1
        actualNum = 0.23
        percentage = actualNum/expectedNum * 100

        scope.$watchCollection '[expected, actual]', ([expected, actual]) ->
          expectedNum = expected
          actualNum = actual
          percentage = actualNum/expectedNum * 100
          svg.selectAll("*").remove()
          drawProgressIndicator()

        svg = d3.select(element[0]).append('svg')

        drawProgressIndicator = ->
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
            .endAngle((actualNum/1.0) * 2 * Math.PI)

          svg.append("path")
            .attr("class", "circle-translate actual-arc")
            .attr("d", actualArc)

          #expected arc
          expectedArc = d3.svg.arc()
            .innerRadius(95)
            .outerRadius(100)
            .startAngle(0)
            .endAngle((expectedNum/1.0) * 2 * Math.PI)

          svg.append("path")
            .attr("d", expectedArc)
            .attr("class", "circle-translate expected-arc")

        drawProgressIndicator()
    }
  )

angular.module 'BWApp', ['BWProgress']
