angular.module('BWProgress', [])
  .directive('progressIndicator', ($parse)->
    return {
      restrict: 'E'
      scope:
        expected: "="
        actual: "="
      link: (scope, element, attr) ->
        expected = 0
        actual = 0

        scope.$watchCollection '[expected, actual]', ([expected, actual]) ->
          if isValid(expected) and isValid(actual)
            updateIndicator(expected, actual)
            updateText(expected, actual)

        isValid = (value) ->
          if (value and !isNaN(value) and value <= 1 and value >= 0)
            return true
          return false

        getPercentage = (expected, actual) -> Math.round(actual/expected * 100)

        svg = d3.select(element[0]).append('svg')
        elem = svg.append("g").attr("class", "circle-translate");

        #inner circle
        elem.append("circle").attr("r", 80)

        #inner circle
        progressNum = elem.append("text")
          .attr("class", "progress-num")
          .attr("dx", -44)
          .attr("dy", 15)
          .attr("textLength", "98px")
          .text(getPercentage(expected, actual))

        progressNum.append("tspan").text("%")

        elem.append("text")
          .attr("class", "progress-text")
          .attr("dx", -35)
          .attr("dy", 40)
          .attr("textLength", "80px")
          .text('Progress')

        #arcs
        arcs = [
          {
            class: "actual-arc circle-translate"
            innerRadius: 90,
            outerRadius: 93,
            endAngle: parseFloat(actual)
          },
          {
            class: "expected-arc circle-translate"
            innerRadius: 95,
            outerRadius: 100,
            endAngle: parseFloat(expected)
          }
        ]

        color = d3.scale.linear().domain([0, 60, 100]).range(["#D91500","#FFBA00", "#60CC00"])

        arc = d3.svg.arc()
          .innerRadius((d) -> d.innerRadius)
          .outerRadius((d) -> d.outerRadius)
          .startAngle(0)
          .endAngle((d) -> (d.endAngle/1) * 2 * Math.PI)


        svg.selectAll("path.arc").data(arcs)
          .enter().append("path")
          .attr("class", (d) -> d.class)
          .attr('fill', color(getPercentage(expected, actual)))
          .transition().duration(800)
          .attrTween("d", (d) ->
            return arc(d)
          )

        updateText = (expected, actual) ->
          progressNum.text(getPercentage(expected, actual))
            .append("tspan").text("%")

        updateIndicator = (expected, actual) ->
          newValue = [actual, expected]
          svg.selectAll("path").transition().duration(800)
            .attr('fill', color(getPercentage(expected, actual)))
            .attrTween("d", (d, i) ->
              interpolate = d3.interpolate(d.endAngle, newValue[i])
              return (t) ->
                d.endAngle = interpolate(t)
                return arc(d)
            )
    }
  )

angular.module 'BWApp', ['BWProgress']
