//Bottom graph

d3.csv("databreaches.csv", function(d) {
    return{
        entity : d.Entity,
        alternative_name : d.alternative_name,
        year : +d.year,
        records_lost : +d.records_lost,
		organization : d.organization, 
		breach_cause : d.breach_cause,
		records_rounded : +d.records_rounded,
		severity : + d.severity
    };
}, function(data){
    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory20);
 
    //Define Scales   
    var xScale = d3.scaleLinear()
        .domain([0,16]) //Need to redefine this after loading the data
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0,450]) //Need to redfine this after loading the data
        .range([height, 0]);

    // var zoom = d3.zoom()
    //     .x(xScale)
    //     .y(yScale)
    //     .scaleExtent([1, 32])
    //     .on("zoom", zoomed);

    //Define SVG
    var svg = d3.select("#bottom")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
        }))
        .append("g")
        // .call(zoom);
    
    //Define Tooltip here
    var tooltip = d3.select("#bottom").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);
      
    //Define Axis
    var xAxis = d3.axisBottom(xScale).tickPadding(2);
    var yAxis = d3.axisLeft(yScale).tickPadding(2);
    // Define domain for xScale and yScale
    //xScale.domain([-width /2, width/2]);
    //yScale.domain([-height /2, height/2]);
    
    //Draw Scatterplot
    var g = svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("r", function(d) { return Math.sqrt(d.ec)/.2; })
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function (d) { return colors(d.severity); })
        .on("mouseover", function(d) {      
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);      
            tooltip.html(d.entity + "<br/>Population: "  + d.population + " Million<br/>GDP: $" + d.gdp + " Trillion<br/>EPC: " + d.epc + " Million BTUs<br/>Total: " + d.ec + " Trillion BTUs")   
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
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
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
        .text("GDP (in Trillion US Dollars) in 2010");

    
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
        .text("Energy Consumption per Capita (in Million BTUs per person)");

    
     // draw legend colored rectangles
    svg.append("rect")
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
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");
    
    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");
    
    function zoomed() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.select(".dots")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        svg.select(".text")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
    //some code to handle scaling the circles
    /*
    svg.selectAll(".dots circle").attr("r", function(){
        return (3.5  * d3.event.scale);
    });
    */
});
