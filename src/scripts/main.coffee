angular.module('components', [])
  .directive('progressIndicator', ->
    return {
      scope: {},
      link: (scope, element, attr) ->
        svg = d3.select(element[0])
          .append('svg')

        elem = svg.append("g")
          .attr("class", "circle-translate")

        #inner circle
        elem.append("circle")
          .attr("r", 80)

        #TODO: add actual text
        progressNum = elem.append("text")
          .attr("class", "progress-num")
          .attr("dx", -40)
          .attr("dy", 15)
          .attr("textLength", "80px")
          .text('73')

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
          .endAngle((0.33/1.0) * 2 * Math.PI)

        svg.append("path")
          .attr("class", "circle-translate actual-arc")
          .attr("d", actualArc)

        #expected arc
        expectedArc = d3.svg.arc()
          .innerRadius(95)
          .outerRadius(100)
          .startAngle(0)
          .endAngle((0.74/1.0) * 2 * Math.PI)

        svg.append("path")
          .attr("d", expectedArc)
          .attr("class", "circle-translate expected-arc")
    }
  )

angular.module 'BWApp', ['components']
