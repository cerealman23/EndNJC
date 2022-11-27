/* JavaScript goes here. */

// This is where I add all the html elements 
  
var width = 1000,
    height = 500;

var maps = d3.select("body").select(".row").select(".map")

var state_map = d3.select("body").select(".row").select(".state")

var svg = maps.append("svg")
    .attr("width", width)
    .attr("class", "state-map")
    .attr("height", height)
    .attr("display", "block")
    .attr("margin", "auto");


var county_borders = svg.append("g").classed("countys", true)// .attr("class", "countys")

var state_borders = svg.append("g").classed("borders", true)// .attr("class", "borders")
var svg_state = state_map.append("svg")
    .attr("width", width )
    .attr("class", "state-map")
    .attr("height", height);

var tooltip = d3.select('body')
    .append('div')
    .attr('width', '200')
    .attr('height', '200')
    .attr("pointer-events", "none")
    .style("position", "absolute")
    .text("I'm a circle!")
    .attr("pointer-events", "none")
    .attr('color', 'white')
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")


var projection = d3.geoAlbersUsa().scale(1000)

var file = 'county-prison-1970'

// This is where all the user input is collcted

// Race selector
// Rece menu

d3.select(".race-menu").select(".white")
    .on("click", function (d) {
	console.log("white")
    })

d3.select(".race-menu").select(".black")
    .on("click", function (d) {
	console.log("black")
    })

d3.select(".race-menu").select(".latinx")
    .on("click", function (d) {
	console.log("latinx")
    })

d3.select(".race-menu").select(".native")
    .on("click", function (d) {
	console.log("Native")
    })

// Gender selector 
// Male population button
d3.select(".gender-menu").select(".male")
    .on("click", function (d) {
	console.log("Male")
    })

// Female population button
d3.select(".gender-menu").select(".female")
    .on("click", function (d) {
	console.log("Female")
    })


// Prison selector
// Prison population button
d3.select(".jail-menu").select(".prison-population")
    .on("click", function (d) {
	console.log("prison")
    })

// Jail pop  button
d3.select(".jail-menu").select(".jail-population")
    .on("click", function (d) {
	console.log("jail-population")
    })

// Incarceratioin rate button
d3.select(".jail-menu").select(".incarceration-rate")
    .on("click", function (d) {
	console.log("incarceration rate")
    })

// This is where the GeoJSON is loaded and renderd on the wensite as SVG elements


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
    });

  d3.select('#slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(slider);


	states = topojson.feature(uk, uk.objects.states)
	statemap = new Map(states.features.map(d => [d.id, d]))
        console.log(uk)
	statemesh = topojson.mesh(uk, uk.objects.states, (a, b) => a !== b)

	colors = ['#F4F1DE','#E07A5F','#3D405B','#81B29A','#F2CC8F']


var color = d3.scaleQuantize()



// d3.select('.slider').select('input').attr('min',r_min ).attr('max',r_max) 


    // This is where the map is changes when the slider is slid
    function change_map (file, data_type) {
	    d3.csv('csv/' + file + '.csv').then( function(county) {

		color.range(colors)
    .domain([d3.min(county, d => parseFloat(d.total_prison_pop) ), d3.max(county, d => parseFloat(d.total_prison_pop))])

      // debugging log for easy viewing of the data
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

	county_borders.selectAll("path")
	    .attr("fill-opacity", "1")
	    .attr("fill", function(d) {
		// all void data is set to a white color
		if (isNaN(d.properties.values)) {
		    return "#808080"
		}
		else {
		    value = d.properties.values
		    return color(value)
		}
	    })
	    .attr("prop", function (d) {return d.properties.values })
	
	state_borders.selectAll("path")
	    .attr("stroke", "black")
	    .attr("stroke-width", "7")
	    .attr("fill", "white")
	    .on("click", function (d) {

		tooltip.style('visisbility', 'visible')
		tooltip.text("State : " + d3.select(this).attr("name") + " population ")
		state_id = d3.select(this).attr("state-id")

		display_state(state_id)
		d3.select(this).attr("fill", "blue")
		d3.select(this).attr("fill-opacity", "1")

	    })

	    .on("mousemove", function (d) {
		return tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX + 5)+"px");
	    })
	    .on("mouseout", function(d) {
		d3.select(this).attr("fill-opacity", "0")
	    })

        })};	
    // Display the state in which was selected by the user

    function display_state (state_id) {

	d3.csv('csv/' + file + '.csv').then( function(county) {

	    var counties = topojson.feature(uk, uk.objects.counties)
		.features
		.filter(function(d) {return d.id.slice(0,2) == state_id;})

	    // for (var i = 0; i < county.length; i++) {

	    // 	var fips = county[i].fips.slice(0,2)
	    // 	var val = parseFloat(county[i].total_prison_pop)


	    // 	for (var j = 0; j < counties; j++) {

	    // 	    county_id = counties[i].id.slice(0, 2)

	    // 	    if (fips == county_id) {
	    // 		counties.properties.values_state = val
	    // 	    }

	    // 	}

	    // }


	    var new_color = d3.scaleQuantize()
		.range(colors)
		.domain([d3.min(counties, d => parseFloat(d.properties.values) ), d3.max(counties, d => parseFloat(d.properties.values))])

	    console.log(counties)

	    console.log(d3.max(counties, d => parseFloat(d.properties.value)))

	    svg_state.selectAll("path").remove()
	    
	    var state = topojson.feature(uk, uk.objects.states)
		.features
		.filter(function(d) {return d.id == state_id;})[0]
	    
	    var state_projection = d3.geoIdentity()
		.reflectY(true)
		.fitSize([900, 500], state)
	    
	    svg_state.selectAll("path")
		.data(counties)
		.enter().append("path")
		.attr("stroke", "black")
		.attr("stroke-width", "7")
		.attr("fill", function(d) {
		    // all void data is set to a white color
		    if (isNaN(d.properties.values)) {
			return new_color(0)
		    }
		    else {
			value = d.properties.values
			return new_color(value)
		    }
		})
		.attr("name", d => d.properties.name)
		.attr("current_value", d => d.properties.values)
		.attr("d", d3.geoPath().projection(state_projection))
		.classed("state", true)
		.on("mouseover", function (d) {
		    tooltip.style('visisbility', 'visible')
		    tooltip.text("County : " + d3.select(this).attr("name") + " population: " + d3.select(this).attr("current_value"))
		    // d3.select(this).attr("fill", "blue")
		})
	    
		.on("mousemove", function (d) {
		    return tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
		})
		.on("mouseout", function(d) {
		})
	
	})}

    state_borders.selectAll("path")
	.data(topojson.feature(uk, uk.objects.states).features)
	.enter().append("path")
        .attr("fill-opacity", "0.0")
	.attr("stroke", "black")
	.attr("stroke-width", "7")
        .attr("state-id", d => d.id)
	.attr("d", d3.geoPath().projection(projection))
	.attr("name", d => d.properties.name)
	.classed("state", true)

    county_borders.selectAll("path")
	.data(topojson.feature(uk, uk.objects.counties).features)
	.enter().append("path")
        .attr("fill", "pink")
        .attr("pointer-events", "none")
        .attr("stroke", "black")
	.attr("name", d => d.properties.name)
	.attr("d", d3.geoPath().projection(projection))
        .classed("county", true)


    });
