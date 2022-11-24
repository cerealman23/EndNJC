

/* JavaScript goes here. */

// This is where I add all the html elements 

  
var width = 1300,
    height = 1000;

var maps = d3.select("body").select(".row").select(".map")

var svg = maps.append("svg")
    .attr("width", width)
    .attr("class", "state-map")
    .attr("height", height);

var svg_state = maps.append("svg")
    .attr("width", width)
    .attr("class", "county-map")
    .attr("height", height);

var tooltip = d3.select('body')
    .append('div')
    .attr('width', '200')
    .attr('height', '200')
    .style("position", "absolute")
    .text("I'm a circle!")
    .attr('color', 'white')
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .attr("pointer-events", "none")


var projection = d3.geoAlbersUsa().scale(1000)

var file = 'county-prison-1970'

d3.json('counties.json').then( function(uk) {

  var slider = d3
    .sliderHorizontal()
    .min(1970)
    .max(2018)
    .step(1)
    .width(300)
    .displayValue(false)
    .on('onchange', (val) => {
        file = 'county-prison-'
	file += val
        change_map(file)
	console.log(file)
    });

  d3.select('#slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(slider);
  //     console.log(county)


	states = topojson.feature(uk, uk.objects.states)
	statemap = new Map(states.features.map(d => [d.id, d]))
        console.log(uk)
	statemesh = topojson.mesh(uk, uk.objects.states, (a, b) => a !== b)

	colors = ['#F4F1DE','#E07A5F','#3D405B','#81B29A','#F2CC8F']


var color = d3.scaleQuantize()




// d3.select('.slider').select('input').attr('min',r_min ).attr('max',r_max) 


	function change_map (file) {
	console.log(file)
	    console.log("Here")
    d3.csv('csv/' + file + '.csv').then( function(county) {

    color.range(colors)
    .domain([d3.min(county, d => parseFloat(d.total_prison_pop) ), d3.max(county, d => parseFloat(d.total_prison_pop))])
      // debugging log for easy viewing of the data
    console.log(d3.max(county, d => parseFloat(d.total_prison_pop)))
	for (var i = 0; i < county.length; i++) {
	    
	    var county_name = county[i].county
	    var val = parseFloat(county[i].total_prison_pop)
	    var year = county[i].year
	    var fips = county[i].fips.slice(0,2)
	    
	    
	    for (var j = 0; j < uk.objects.counties.geometries.length; j++) {
		
		map_name = uk.objects.counties.geometries[j].properties.name
		id = uk.objects.counties.geometries[j].id.slice(0,2)
		
		if (map_name == county_name && fips == id) {
                    uk.objects.counties.geometries[j].properties.values = val
		    
		}
	    }
	    
	}
	// svg.selectAll("path")

	//     .attr("fill", function(d) {
	// 	// all void data is set to a white color
	// 	if (isNaN(d.properties.values)) {
	// 	    return color(0)
	// 	}
	// 	else {
	// 	    value = d.properties.values
	// 	    return color(value)
	// 	}
	//     })
	//     .attr("prop", function (d) {return d.properties.values })
        })};	

	//     .attr("fill", function(d) {
	// 	// all void data is set to a white color
	// 	if (isNaN(d.properties.values)) {
	// 	    return color(0)
	// 	}
	// 	else {
	// 	    value = d.properties.values
	// 	    return color(value)
	// 	}
	//     })
	// // prop is a debugging attrubute
	//     .attr("name", function (d) {return d.properties.name })
	//     .attr("prop", function (d) {return d.properties.values })
        // .attr("pointer-events", "none")

	    // .on("mouseover", function (d) {
	    // 	tooltip.style('visisbility', 'visible')
	    // 	tooltip.text("County: " + d3.select(this).attr("name") + " population " + d3.select(this).attr('prop'))
	    // })

	    // .on("mousemove", function (d) {
            //   return tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
	    // })

    



    svg.selectAll("path")
	.data(topojson.feature(uk, uk.objects.states).features)
	.enter().append("path")
	.attr("stroke", "red")
	.attr("stroke-width", "7")
	.attr("fill", "white")
	.attr("d", d3.geoPath().projection(projection))
        .on("mouseover", function (d) {
	    console.log("I am malcolm")
	    d3.select(this).attr("fill", "blue")
	})

    svg.selectAll("path")
	.data(topojson.feature(uk, uk.objects.counties).features)
	.enter().append("path")
        .attr("fill-opacity", "0.0")
        .attr("pointer-events", "none")
        .attr("stroke", "black")
	.attr("d", d3.geoPath().projection(projection))
        .classed("county", true)
    });
