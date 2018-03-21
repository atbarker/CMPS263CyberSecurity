//sources are included in comments located around the code
//some collaboration with Staunton Sample
//used: https://bl.ocks.org/mbostock/3892919
//read data in...
var data = d3.csv("scatterdata.csv", function(data) {
	console.log(data);
	data.forEach(function(d) {
    	d.gdp = +d.gdp;
		d.population = +d.population;
		d.ecc = +d.ecc;
		d.ec = +d.ec;
  	});
	var ec_data = [];
	for (var i = 0; i < data.length; i++) {
		ec_data.push({name: data[i].country, country: data[i].country, gdp: data[i].gdp, population: data[i].population, epc: data[i].ecc, total: data[i].ec});
    }
	console.log(ec_data);
	
	//Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory20);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	  	.call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

	 //yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    //Define Scales   
    var xScale = d3.scaleLinear()
        .domain([0,d3.max(ec_data, function(d) {return d.gdp +1; })]) //Need to redefine this after loading the data
        .range([0, width]);
	console.log(width);

    var yScale = d3.scaleLinear()
        .domain([0,d3.max(ec_data, function(d) {return d.epc + 30; })]) //Need to redfine this after loading the data
        .range([height, 0]);
    
	console.log(d3.max(ec_data, function(d) {console.log(d); return d.epc;}));
    //Define Tooltip here
    
      
       //Define Axis
	var xAxis = d3.axisBottom(xScale).tickPadding(2);
    //var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    var yAxis = d3.axisLeft(yScale).tickPadding(2);
    
    //Get Data
    // Define domain for xScale and yScale
   	
	
    //div tooltips
	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
   
    //Draw Scatterplot
        svg.selectAll(".dot")
        .data(ec_data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d.total)/.2; })
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function (d) { return colors(d.country); })
		.on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.country + "<br/> Population: " + d.population + " Million<br/> GDP: $" + d.gdp + " Trillion<br/> EPC: " + d.epc + " Million BTUs<br/> Total: " + d.total + " Trillion BTUs")
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
    
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
	//used this as basis	 https://bl.ocks.org/mbostock/4e3925cdc804db257a86fdef3a032a45
	//var g = d3.select("g");
	
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
		.attr("fill","black")
        .text("GDP (in Trillion US Dollars) in 2010");
	
	//svg.select("g").call(xAxis);
	//svg.select("g").call(yAxis);

	
	
    
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
		.attr("fill","black")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");

	
	function zoomed() {
  		svg.attr("transform", d3.event.transform);
		svg.select("x axis").call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
  		svg.select("y axis").call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
		
	}

    //Draw Country Names
        svg.selectAll(".text")
        .data(ec_data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.name; })
		;

     // draw legend colored rectangles
	
    svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 240)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", function() { return Math.sqrt(1)/.2; })
        .attr("cx", width-80)
        .attr("cy", height-175)
        .style("fill", "green");
    
    svg.append("circle")
        .attr("r", function() { return Math.sqrt(10)/.2; })
        .attr("cx", width-80)
        .attr("cy", height-150)
        .style("fill", "green");

    svg.append("circle")
        .attr("r", function() { return Math.sqrt(100)/.2; })
        .attr("cx", width-80)
        .attr("cy", height-80)
        .style("fill", "green");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -135)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text("< 1 Million BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -135)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text("< 10 Million BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -135)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text("< 100 Million BTUs");
    /*
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");     
		*/

	
});

/*	
  var countries = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
		//console.log( {year: d, btu: d[id]});
		  //console.log(data.id);
		  console.log(d[id]);
		  console.log(d.country);
        return {name: d.country, country: d.country};
      })
    };
  });
console.log(countries);
});
*/
