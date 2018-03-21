d3.csv('databreaches.csv',function (data) {
// CSV section
  var body = d3.select('#top')
  var selectData = [ { "text" : "all" },
                     { "text" : "inside job" },
                     { "text" : "hacked" },
                     { "text" : "lost / stolen device or media" },
                     { "text" : "poor security"},
                     { "text" : "accidentally published"}
                   ]

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Breach Cause: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  
  body.append('br')
    
  var tooltip = d3.select("#top").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

  // Variables
  var body = d3.select('#top')
  var margin = { top: 50, right: 310, bottom: 50, left: 80 }
  var h = 500 - margin.top - margin.bottom
  var w = 1700 - margin.left - margin.right
  // Scales
  //var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
  var colorScale = d3.scaleSequential(d3["interpolateYlOrRd"])
    .domain([0, d3.max(data, function(d) { return d.severity; })]);
  var xScale = d3.scaleLinear()
    .domain([2004, 2018])
    .range([0,w])
  var yScale = d3.scaleLinear()
    .domain([
      0,
      1000000
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.axisBottom(xScale)
    //.tickFormat(formatPercent)
    .ticks(5)
  // Y-axis
  var yAxis = d3.axisLeft(yScale)
    //.tickFormat(formatPercent)
    .ticks(5)
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d['year']) })
      .attr('cy',function (d) { return yScale(d['records_rounded']) })
      .attr('r', function(d) { return Math.sqrt(d['records_rounded'])/.2/100; })
      .attr('fill',function (d) { return colorScale(d.severity); })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(10)
          .attr('r',function(d) { return Math.sqrt(d['records_rounded'])/.2/75; })
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(10)
          .attr('r',function(d) { return Math.sqrt(d['records_rounded'])/.2/100; })
          .attr('stroke-width',1)
      })//tooltip
      .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(d['Entity'] + "<br/>Description: "  + d['story'] + "<br/>Year:" + d['year'] + "<br/>Records: " + d['records_lost'] + "<br/>Sector: " + d['organization'] + "")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })					
        .on("mouseout", function() {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
    
    
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Year')
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Size of Breach (x1000 records)')
    
    
  var legend = svg.selectAll(".legend")
      .data(colorScale.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", w + 60)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

  // draw legend text
  legend.append("text")
      .attr("x", w + 80)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) {
      if (d == 1){
        return "1: Email Addresses";
      }else if(d == 2){
          return "2: SSN/Personal Details";
      }else if(d == 3){
          return "3: Credit Card info";
      }else if(d == 4){
          return "4: Email password/Health Records";
      }else if(d == 5){
          return "5: Full Bank Account Details";
      }  
   })
    

  /*function yChange() {
    var value = this.value // get the new y value
    yScale // change the yScale
      .domain([
        0,
        d3.max(data,function (d) { if(value == 'records lost'){return 1000000;}else if(value == 'impact'){return 4000000;}else{return 5;} })
        ])
    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)    
    d3.selectAll('circle') // move the circles
      .transition().duration(1)
      .delay(function (d,i) { return i*10})
        .attr('cy',function (d) { if(value == 'records lost'){return yScale(d["records_rounded"]);}else{return yScale(d[value]);} })
  }*/
   function yChange(){
       var value = this.value;
       //d3.selectAll('circle') // move the circles
       circles.transition().duration(1)
      .delay(function (d,i) { return i*10})
        .attr('cy',function (d) { if(d['breach_cause'] == value){return yScale(d["records_rounded"])}else if(value == 'all'){return yScale(d["records_rounded"])}else{return 0;} })
       .attr('cx',function (d) { if(d['breach_cause'] == value){return xScale(d["year"])}else if(value == 'all'){return xScale(d["year"])}else{return 0;} })
       .attr('r',function (d) { if(d['breach_cause'] == value){return Math.sqrt(d['records_rounded'])/.2/100;}else if(value == 'all'){return Math.sqrt(d['records_rounded'])/.2/100;}else{return 0;} })
   }
})
