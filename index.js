//This Should be the top scatterplot

d3.csv("databreaches.csv", function(data) {
	//TODO make this threshold user selectable
	data.forEach(function(d) {
        d.entity = d.Entity;
        d.alternative_name = d.alternative_name;
        d.year = +d.year;
        d.records_lost = +d.records_lost;
		d.organization = d.organization;
		d.breach_cause = d.breach_cause;
		d.records_rounded = +d.records_rounded;
		d.severity = +d.severity;
  	});
	var top_breaches = [];
	//console.log(data.length);
	for (var i = 0; i < data.length; i++) {
		//TODO create impact score metric based on severity * number of records 
		//TODO decide if we only want to show records lost over this amount..
		if(data[i].records_lost > 100000000){
			//console.log(data[i]);
			top_breaches.push({entity: data[i].entity, alternative_name: data[i].alternative_name, year: data[i].year, records_lost: data[i].records_lost, organization: data[i].organization, breach_cause: data[i].breach_cause, records_rounded: data[i].records_rounded, severity: data[i].severity});
		}
			
		//ec_data.push({name: data[i].country, country: data[i].country, gdp: data[i].gdp, population: data[i].population, epc: data[i].ecc, total: data[i].ec});
    }
	//console.log(top_breaches);
	data = top_breaches;

	/*
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
	*/
	
    //Define Margin
	//console.log(data);
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color//TODO fix color
    var colors = d3.scaleOrdinal(d3.schemeCategory20);
	/*
	//TODO switch to this color scheme.
		color = d3.scaleThreshold()
    	.domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
		//d3.schemeGnBu[k]
    	.range(d3.schemeOrRd[9]);
	*/
 
    //Define Scales  
	//console.log(d3.min(data, function(d) {return d.year; })); 
	var xScale = d3.scaleLinear()
    	.domain([d3.min(data, function(d) {return d.year; }),d3.max(data, function(d) {return d.year;})]) 
   	 .range([0, width]);

	 //console.log(d3.max(data, function(d) {return d.records_lost; }));
	 var yScale = d3.scaleLinear()
   		.domain([0,d3.max(data, function(d) {return d.records_lost; })]) 
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
		.append("g");
        //.call(zoom);
    
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
        .attr("r", function(d) { return (Math.sqrt(d.records_lost)/.2)/5000; }) //TODO fix hardcoded scaling function...
        .attr("cx", function(d) {return xScale(d.year);})
        .attr("cy", function(d) {return yScale(d.records_lost);})
        .style("fill", function (d) { return colors(d.severity); })
        .on("mouseover", function(d) {      
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);      
            tooltip.html(d.entity + "<br/>Organization Type: " + d.organization + "<br/>Year: "  + d.year + "<br/>Records Lost: " + d.records_lost + "<br/>Breach Cause: " + d.breach_cause + "<br/>Sensitivity of Data Loss: " + d.severity)   
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
        .attr("y", function(d) {return yScale(d.records_lost);})
        .style("fill", "black")
        .text(function (d) {return d.entity; });

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
        .text("Year of Breach");

    
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
        .text("Size of Data Breach");

    
     // draw legend colored rectangles
	//TODO fix this later - add key!!
		/*
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
    */
	/*
    function zoomed() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.select(".dots")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        svg.select(".text")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    */
    //some code to handle scaling the circles
    /*
    svg.selectAll(".dots circle").attr("r", function(){
        return (3.5  * d3.event.scale);
    });
    */
});
