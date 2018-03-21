/*
Worked with Staunton Sample and Matt Bryson
*/

//Get Data
d3.csv("databreaches.csv", function(d) {
    return{
        entity : d.Entity,
        alternative : d.alternative_name,
        story : d.story,
        year : +d.year,
        recordslost : +d.records_lost,
        sector: d.organization,
        cause: d.breach_cause,
        records_rounded : +d.records_rounded,
        severity : +d.severity
    };
}, function(data){
    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scale.category20();
 
    //Define Scales   
    var xScale = d3.scale.linear()
        .domain([2004,2017]) //Need to redefine this after loading the data
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([0,d3.max(data, function(d){return d.records_rounded;})]) //Need to redfine this after loading the data
        .range([height, 0]);

    //var zoom = d3.behavior.zoom()
     //   .x(xScale)
     //   .y(yScale)
     //   .scaleExtent([1, 32])
     //   .on("zoom", zoomed);

    //Define SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //.call(zoom);
    
    //Define Tooltip here
    var tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
      
    //Define Axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);
    // Define domain for xScale and yScale
    //xScale.domain([-width /2, width/2]);
    //yScale.domain([-height /2, height/2]);
    
    //Draw Scatterplot
    var g = svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("r", function(d) { return Math.sqrt(d.records_rounded)/.2/100; })
        .attr("cx", function(d) {return xScale(d.year);})
        .attr("cy", function(d) {return yScale(d.records_rounded);})
        .style("fill", function (d) { return colors(d.severity); })
        .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(d.entity + "<br/>Description: "  + d.story + "<br/>Year:" + d.year + "<br/>Records: " + d.recordslost + "<br/>Sector: " + d.sector + "")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })					
        .on("mouseout", function() {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
    
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom

    //Draw Country Names
    svg.append("g")
        .attr("class", "text")
        .selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.year);})
        .attr("y", function(d) {return yScale(d.records_rounded);})
        .style("fill", "black")
        .text(function (d) {return d.country; });

    //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Year");

    
    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Records lost (x1000)");

    
     // draw legend colored rectangles
    /*svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Million BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Million BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Million BTUs");
    
    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");*/
    
    //redraw and scale depending on the zoom
    /*function zoomed() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.select(".dots")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        svg.select(".text")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }*/
    
    //some code to handle scaling the circles
    /*
    svg.selectAll(".dots circle").attr("r", function(){
        return (3.5  * d3.event.scale);
    });
    */
});