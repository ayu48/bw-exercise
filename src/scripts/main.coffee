angular.module('BWProgress', [])
  .factory('Utilities', () ->
    return {
      isValid: (value) -> value and !isNaN(value) and value <= 1 and value >= 0
    }
  )
  .directive('invalidMessage', (Utilities)->
    return {
      restrict: 'AE'
      scope:
        expected: '='
        actual: '='
      template: '<div ng-if="!valid">Invalid Value</div>'
      link: (scope, element, attrs) ->

        scope.$watchCollection '[expected, actual]', ([expected, actual]) ->
          scope.valid = Utilities.isValid(expected) and Utilities.isValid(actual)

        return
  })
  .directive('progressIndicator', (Utilities)->
    return {
      restrict: 'E'
      scope:
        expected: '='
        actual: '='
      link: (scope, element, attr) ->
        size = attr.size || 200
        scale = size/200
        transform = 'scale(' + scale + ') translate( 100px, 100px)'
        expected = 0
        actual = 0

        scope.$watchCollection '[expected, actual]', ([expected, actual]) ->
          if Utilities.isValid(expected) and Utilities.isValid(actual)
            updateIndicator(expected, actual)
            updateText(expected, actual)

        getPercentage = (value) -> Math.round(value * 100)

        svg = d3.select(element[0]).append('svg')
          .attr("width", size)
          .attr("height", size)
        elem = svg.append("g")
          .style("transform", transform)

        #inner circle
        elem.append("circle").attr("r", 80)

        #inner circle
        progressNum = elem.append("text")
          .attr("class", "progress-num")
          .attr("x", 5)
          .attr("y", 10)
          .attr("text-anchor", "middle")
          .text(getPercentage(actual))

        progressNum.append("tspan").text("%")

        elem.append("text")
          .attr("class", "progress-text")
          .attr("x", 5)
          .attr("y", 40)
          .attr("text-anchor", "middle")
          .text('Progress')

        #arcs
        color = d3.scale.linear().domain([0, 60, 100]).range(["#D91500","#FFBA00", "#60CC00"])

        arcs = [
          {
            class: "expected-arc circle-translate"
            color: () -> '#A8A8A8'
            innerRadius: 90,
            outerRadius: 91,
            endAngle: parseFloat(expected)
          },
          {
            class: "actual-arc circle-translate"
            color: (value) -> color(getPercentage(value))
            innerRadius: 96,
            outerRadius: 97,
            endAngle: parseFloat(actual)
          }
        ]

        arc = d3.svg.arc()
          .innerRadius((d) -> d.innerRadius)
          .outerRadius((d) -> d.outerRadius)
          .startAngle(0)
          .endAngle((d) -> (d.endAngle/1) * 2 * Math.PI)


        svg.selectAll("path.arc").data(arcs)
          .enter().append("path")
          .attr("class", (d) -> d.class)
          .attr('fill', (d) -> d.color(actual/expected))
          .attr('stroke', (d) -> d.color(actual/expected))
          .attr('opacity', (d) -> if d.endAngle is 0 then 0 else 1)
          .attr('stroke-linejoin', 'round')
          .style('transform', transform)
          .transition().duration(800)
          .attrTween("d", (d) ->
            return arc(d)
          )

        updateText = (expected, actual) ->
          progressNum.text(getPercentage(actual))
            .append("tspan").text("%")

        updateIndicator = (expected, actual) ->
          newValue = [parseFloat(expected), parseFloat(actual)]
          svg.selectAll("path").transition().duration(800)
            .attr('fill', (d, i) -> arcs[i].color(actual/expected))
            .attr('stroke', (d, i) -> arcs[i].color(actual/expected))
            .style('opacity', (d, i) -> if newValue[i] is 0 then 0 else 1)
            .attrTween("d", (d, i) ->
              interpolate = d3.interpolate(d.endAngle, newValue[i])
              return (t) ->
                d.endAngle = interpolate(t)
                return arc(d)
            )
    }
  )

angular.module 'BWApp', ['BWProgress']
