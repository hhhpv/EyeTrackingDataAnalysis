var summ = {
    "P1": "<br/><br/><i>-Participant was observed to have the same amount of fixations when interacting with both graph and tree visualizations<br/>- However, the durations of the fixations for the graph were longer than those of the tree visualization<br/>- The participant took more time, on average, fixated on certain areas of the screen when looking at the graph</i>",
    "P33": "<br/><br/><i>-Participant was observed to have the same amount of fixations when interacting with both graph and tree visualizations<br/>- However, the durations of the fixations for the tree were longer than those of the graph visualization<br/>-	The participant took more time, on average, fixated on certain areas of the screen when looking at the tree</i>",
    "P7": "<br/><br/><i>-Participant was observed to have the same amount of fixations when interacting with both graph and tree visualization<br/>- The participant had little variance in quantitative fixation data between the graph and tree visualizations</i>",
    "P10": "<br/><br/><i>-Participant was observed to have more fixations when interacting with the tree when compared to graph <br/>- The average fixation duration was also higher on the tree visualization compared to the graph<br/>-	This implies that with more fixations and longer fixation duration, the participant might have struggled and/or taken more time with the tree visualization</i>",
    "P20": "<br/><br/><i>-Participant was observed to have more fixations when interacting with the graph when compared to tree <br/>- The average fixation duration was also higher on the graph visualization compared to the tree<br/>-	This implies that with more fixations and longer fixation duration, the participant might have struggled and/or taken more time with the graph visualization</i>"
}

function createMap(person, dislayData) {

    document.getElementById("summary").innerHTML = summ[person];


    let colorMin = 86400000;
    let colorMax = 0;

    document.getElementById("my_dataviz_1").innerHTML = "";
    document.getElementById("my_dataviz_2").innerHTML = "";

    // set the dimensions and margins of the graph
    var margin = { top: 80, right: 25, bottom: 150, left: 40 },
        width = 500 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz_1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data

    let file = "";
    if (dislayData === "GFP") file = `./data/${person}/${person}.graphFXD_PointsSummary.csv`;
    else if (dislayData === "GFD") file = `./data/${person}/${person}.graphFXD_DurationSummary.csv`;
    else if (dislayData === "TFP") file = `./data/${person}/${person}.treeFXD_PointsSummary.csv`;
    else if (dislayData === "TFD") file = `./data/${person}/${person}.treeFXD_DurationSummary.csv`;

    vals = []


    d3.csv(file, function (data) {

        data.forEach(element => {
            vals.push(element.Total);
            colorMin = Math.min(parseInt(element.Total), colorMin);
            colorMax = Math.max(parseInt(element.Total), colorMax);
        });


        if (dislayData == "GE" || dislayData == "TE") {
            let lst = "<span style='font-size:17px;'><strong>Summary of Events for each Quadrant:</strong><br/></span><ul>";
            let arr = {};
            data.forEach(element => {
                if (!arr.hasOwnProperty(element.Quadrant)) arr[element.Quadrant] = "";
                if (arr[element.Quadrant].length == 0) arr[element.Quadrant] += element.Event;
                else arr[element.Quadrant] += ", " + element.Event;
            });
            for (const element in arr) {
                lst += `<li> <strong>Quadrant-${element}</strong>: <i>${arr[element]}</i> </li>`;
            }
            lst += "</ul>";
            document.getElementById('eventList').innerHTML = lst;
        }

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain([533, 1066, 1600])
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain([400, 800, 1200])
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()




        // Build color scale
        var myColor = d3.scaleSequential(d3.interpolateBuGn).domain([
            Math.floor(colorMin),
            Math.ceil(colorMax)
        ])
        // create a tooltip
        var tooltip = d3.select("#my_dataviz_1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip
                .html("Total for this Quadrant: " + d.Total)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg.selectAll()
            .data(data, function (d) { return d.Quadrants + ':' + d.Total; })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q4" || d.Quadrant == "Q7") { return x(533); }
                else if (d.Quadrant == "Q2" || d.Quadrant == "Q5" || d.Quadrant == "Q8") { return x(1066); }
                else { return x(1600); }
            })
            .attr("y", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q2" || d.Quadrant == "Q3") { return y(1200); }
                else if (d.Quadrant == "Q4" || d.Quadrant == "Q5" || d.Quadrant == "Q6") { return y(800); }
                else { return y(400); }
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(parseInt(d.Total)))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        // svg.append('g')

        var linear = d3.scaleLinear()
            .domain([0, colorMax])
            .range(["rgb(255, 255, 255)", "rgb(0, 100, 0)"]);

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(20,400)");

        var legendLinear = d3.legendColor()
            .shapeWidth(75)
            .orient('horizontal')
            .scale(linear);

        svg.select(".legendLinear")
            .call(legendLinear);

    })


    let heading = "";
    if (dislayData == "GFP" || dislayData == "GFD") heading = "Heat Map of Fixation Data for Graph";
    if (dislayData == "TFP" || dislayData == "TFD") heading = "Heat Map of Fixation Data for Tree";

    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .text(heading);

    // append the svg object to the body of the page
    var svg_2 = d3.select("#my_dataviz_2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data

    let file_2 = "";
    if (dislayData === "GFP" || dislayData === "GFD") file_2 = `./data/${person}/${person}.graphFXD_EventsSummary.csv`;
    else if (dislayData === "TFP" || dislayData === "TFD") file_2 = `./data/${person}/${person}.treeFXD_EventsSummary.csv`;

    d3.csv(file_2, function (data) {
        colorMin = 86400000;
        colorMax = 0;

        data.forEach(element => {
            colorMin = Math.min(parseInt(element.Total), colorMin);
            colorMax = Math.max(parseInt(element.Total), colorMax);
        });


        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain([533, 1066, 1600])
            .padding(0.05);
        svg_2.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain([400, 800, 1200])
            .padding(0.05);
        svg_2.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential(d3.interpolatePurples).domain([
            Math.floor(colorMin),
            Math.ceil(colorMax)
        ])
        // create a tooltip
        var tooltip = d3.select("#my_dataviz_2")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip
                .html("Total for this Quadrant: " + d.Total)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg_2.selectAll()
            .data(data, function (d) { return d.Quadrants + ':' + d.Total; })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q4" || d.Quadrant == "Q7") { return x(533); }
                else if (d.Quadrant == "Q2" || d.Quadrant == "Q5" || d.Quadrant == "Q8") { return x(1066); }
                else { return x(1600); }
            })
            .attr("y", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q2" || d.Quadrant == "Q3") { return y(1200); }
                else if (d.Quadrant == "Q4" || d.Quadrant == "Q5" || d.Quadrant == "Q6") { return y(800); }
                else { return y(400); }
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(parseInt(d.Total)))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



        var linear = d3.scaleLinear()
            .domain([0, colorMax])
            .range(["rgb(255, 255, 255)", "rgb(76, 0, 153)"]);

        svg_2.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(20,400)");

        var legendLinear = d3.legendColor()
            .shapeWidth(75)
            .orient('horizontal')
            .scale(linear);

        svg_2.select(".legendLinear")
            .call(legendLinear);
    })

    heading = "";
    if (dislayData == "GFP" || dislayData == "GFD") heading = "Heat Map of Event Data for Graph";
    if (dislayData == "TFP" || dislayData == "TFD") heading = "Heat Map of Event Data for Tree";
    // Add title to graph
    svg_2.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .text(heading);
}



function compareMap(person, dislayData) {

    document.getElementById("summary").innerHTML = summ[person];


    let compareQuadrants_1 = { "Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0, "Q5": 0, "Q6": 0, "Q7": 0, "Q8": 0, "Q9": 0 };
    let compareQuadrants_2 = { "Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0, "Q5": 0, "Q6": 0, "Q7": 0, "Q8": 0, "Q9": 0 };


    let colorMin = 86400000;
    let colorMax = 0;

    document.getElementById("my_dataviz_1").innerHTML = "";
    document.getElementById("my_dataviz_2").innerHTML = "";
    document.getElementById("my_dataviz_2").style.display = "block";

    // set the dimensions and margins of the graph
    var margin = { top: 80, right: 25, bottom: 150, left: 40 },
        width = 500 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz_1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    let file = "";
    if (dislayData === "CF") file = `./data/${person}/${person}.graphFXD_PointsSummary.csv`;
    else if (dislayData === "CE") file = `./data/${person}/${person}.graphFXD_EventsSummary.csv`;
    console.log(file);

    d3.csv(file, function (data) {

        data.forEach(element => {
            compareQuadrants_1[String(element.Quadrant)] = compareQuadrants_1[String(element.Quadrant)] + parseInt(element.Total);
            colorMin = Math.min(parseInt(element.Total), colorMin);
            colorMax = Math.max(parseInt(element.Total), colorMax);
        });

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain([533, 1066, 1600])
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain([400, 800, 1200])
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential(d3.interpolateBuGn).domain([
            Math.floor(colorMin),
            Math.ceil(colorMax)
        ])
        // create a tooltip
        var tooltip = d3.select("#my_dataviz_1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip
                .html("Total for this Quadrant: " + d.Total)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg.selectAll()
            .data(data, function (d) { return d.Quadrants + ':' + d.Total; })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q4" || d.Quadrant == "Q7") { return x(533); }
                else if (d.Quadrant == "Q2" || d.Quadrant == "Q5" || d.Quadrant == "Q8") { return x(1066); }
                else { return x(1600); }
            })
            .attr("y", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q2" || d.Quadrant == "Q3") { return y(1200); }
                else if (d.Quadrant == "Q4" || d.Quadrant == "Q5" || d.Quadrant == "Q6") { return y(800); }
                else { return y(400); }
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(parseInt(d.Total)))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })

    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .text("Total duration of time spent on \neach Quadrant");


    var svg_2 = d3.select("#my_dataviz_2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data

    let file_2 = "";
    if (dislayData === "CF") file_2 = `./data/${person}/${person}.treeFXD_PointsSummary.csv`;
    else if (dislayData === "CE") file_2 = `./data/${person}/${person}.treeFXD_EventsSummary.csv`;
    console.log(file_2);

    d3.csv(file_2, function (data) {

        data.forEach(element => {
            compareQuadrants_2[String(element.Quadrant)] = compareQuadrants_2[element.Quadrant] + parseInt(element.Total);
            colorMin = Math.min(parseInt(element.Total), colorMin);
            colorMax = Math.max(parseInt(element.Total), colorMax);
        });


        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain([533, 1066, 1600])
            .padding(0.05);
        svg_2.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain([400, 800, 1200])
            .padding(0.05);
        svg_2.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential(d3.interpolateBuGn).domain([
            Math.floor(colorMin),
            Math.ceil(colorMax)
        ])
        // create a tooltip
        var tooltip = d3.select("#my_dataviz_2")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip
                .html("Total for this Quadrant: " + d.Total)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg_2.selectAll()
            .data(data, function (d) { return d.Quadrants + ':' + d.Total; })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q4" || d.Quadrant == "Q7") { return x(533); }
                else if (d.Quadrant == "Q2" || d.Quadrant == "Q5" || d.Quadrant == "Q8") { return x(1066); }
                else { return x(1600); }
            })
            .attr("y", function (d) {
                if (d.Quadrant == "Q1" || d.Quadrant == "Q2" || d.Quadrant == "Q3") { return y(1200); }
                else if (d.Quadrant == "Q4" || d.Quadrant == "Q5" || d.Quadrant == "Q6") { return y(800); }
                else { return y(400); }
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(parseInt(d.Total)))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



        var linear = d3.scaleLinear()
            .domain([0, colorMax])
            .range(["rgb(255, 255, 255)", "rgb(0, 100, 0)"]);

        svg_2.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(20,450)");

        var legendLinear = d3.legendColor()
            .shapeWidth(75)
            .orient('horizontal')
            .scale(linear);

        svg_2.select(".legendLinear")
            .call(legendLinear);



    })

    // Add title to graph
    svg_2.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .text("Total duration of time spent on \neach Quadrant");

}

function visualize() {
    let displayData = document.getElementById('DisplayData').value;
    let person = document.getElementById('person').value;


    if (displayData == "CE" || displayData == "CF") compareMap(person, displayData);
    else createMap(person, displayData);
}
