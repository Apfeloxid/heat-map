const heightOfDataPoint = 40;
const widthOfDataPoint = 5;
const h = 12 * (1 + heightOfDataPoint);
const paddingWidth = 100;
const paddingHeight = 30;
const legendSquareSize = 30;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colorScheme = ["rgb(49, 54, 149)", 
                            "rgb(69, 117, 180)", 
                            "rgb(116, 173, 209)", 
                            "rgb(171, 217, 233)", 
                            "rgb(255, 255, 191)", 
                            "rgb(254, 224, 144)",
                            "rgb(253, 174, 97)",
                            "rgb(244, 109, 67)", 
                            "rgb(215, 48, 39)", 
                            "rgb(165, 0, 38)"];

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => showData(data));

function showData(data) {
    let baseTemperature = data["baseTemperature"];
    let dataPoints = data["monthlyVariance"];

    console.log(dataPoints);
    //data:
    //x-axis: dataPoints["year"]
    //y-axis: dataPoints["month"]
    //intensity: dataPoints["variance"]

    let months = Array.from(Array(12), (_, i) => i + 1);

    let years = dataPoints.map(el => new Date(el["year"], 0, 1));
    let minYear = new Date(d3.min(years).getFullYear(), 0, 1);
    let maxYear = new Date(d3.max(years).getFullYear(), 0, 1);

    let w = (maxYear.getFullYear() - minYear.getFullYear()) * (widthOfDataPoint + 1);

    minYear.setFullYear(minYear.getFullYear());
    maxYear.setFullYear(maxYear.getFullYear() + 1);

    let xScale = d3.scaleTime()
                    .domain([minYear, maxYear])                
                    .range([paddingWidth, w + paddingWidth]);

    let yScale = d3.scaleBand()
                    .domain(months)
                    .range([paddingHeight, h + paddingHeight]);

    let temperatures = dataPoints.map(el => el["variance"]);
    let colorScale = d3.scaleQuantize()
                    .domain([d3.min(temperatures) - 1, d3.max(temperatures) + 1])
                    .range(colorScheme);

    d3.select("#description").text(`${d3.min(years).getFullYear()}-${d3.max(years).getFullYear()}: base temperature ${baseTemperature}°C`);

    const svg = d3.select("#svg-container")
                    .append("svg")
                    .attr("height", h + 2 * paddingHeight)
                    .attr("width", w + 2 * paddingWidth);

    const tooltip = d3.select("#tooltip");
                
    svg.selectAll("rect")
        .data(dataPoints)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", d => d["month"] - 1)
        .attr("data-year", d => d["year"])
        .attr("data-temp", d => d["variance"] + baseTemperature)
        .attr("x", (d, i) => xScale(years[i]))
        .attr("y", d => yScale(d["month"]))
        .attr("height", heightOfDataPoint)
        .attr("width", widthOfDataPoint)
        .style("fill", (d, i) => colorScale(temperatures[i]))
        .on("mouseover", (d, i) => {
            tooltip.style("opacity", "0.75")
                .html(`${monthNames[d["month"] - 1]} ${d["year"]}<br>${(d["variance"] + baseTemperature).toFixed(2)}°C<br>${d["variance"] < 0 ? "-" : "+"}${Math.abs(d["variance"]).toFixed(2)}°C`)
                .style("left", xScale(years[i]) + "px")
                .style("top", (yScale(d["month"]) - 100) + "px")
                .attr("data-year", d["year"])

        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0).style("top", "-1000px").style("left", "-1000px");
        });


    let xAxis = d3.axisBottom(xScale);
    xAxis.ticks(d3.timeYear.every(10));
    svg.append("g")
        .attr("id", "x-axis")   
        .attr("class", "axis") 
        .attr("transform", "translate(0, " + (h + paddingHeight) + ")")
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);
    yAxis.ticks(12).tickFormat(d => monthNames[d - 1]);
    svg.append("g")
        .attr("id", "y-axis")
        .attr("class", "axis") 
        .attr("transform", "translate(" +  paddingWidth + ",0)")
        .call(yAxis);


    const legend = d3.select("#svg-container").append("svg").attr("id", "legend").attr("height", 100).attr("width",500);

    legend.selectAll("rect")
        .data(colorScheme)
        .enter()
        .append("rect")
        .attr("height", legendSquareSize)
        .attr("width", legendSquareSize)
        .attr("y", 0)
        .attr("x", (d, i) => legendSquareSize * i)
        .style("fill", d => d);
}