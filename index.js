const heightOfDataPoint = 50;
const widthOfDataPoint = 6;
const h = 12 * heightOfDataPoint;
const padding = 40;


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

    minYear.setFullYear(minYear.getFullYear() - 1);
    maxYear.setFullYear(maxYear.getFullYear() + 1);

    let temperatures = dataPoints.map(el => el["variance"]);
    let minTemperature = d3.min(temperatures) - 1;
    let maxTemperature = d3.max(temperatures) + 1;

    let w = (maxYear.getFullYear() - minYear.getFullYear()) * widthOfDataPoint;


    let xScale = d3.scaleTime()
                    .domain([minYear, maxYear])                
                    .range([padding, w + padding]);

    let yScale = d3.scaleBand()
                    .domain(months)
                    .range([padding, h + padding]);

    let colorScale = d3.scaleQuantize()
                    .domain([minTemperature, maxTemperature])
                    .range(["rgb(49, 54, 149)", 
                            "rgb(69, 117, 180)", 
                            "rgb(116, 173, 209)", 
                            "rgb(171, 217, 233)", 
                            "rgb(255, 255, 191)", 
                            "rgb(254, 224, 144)",
                            "rgb(253, 174, 97)",
                            "rgb(244, 109, 67)", 
                            "rgb(215, 48, 39)", 
                            "rgb(165, 0, 38)"]);

    const svg = d3.select("main")
                    .append("svg")
                    .attr("height", h + padding)
                    .attr("width", w + padding);
                
    svg.selectAll("rect")
        .data(dataPoints)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(years[i]))
        .attr("y", (d, i) => yScale(dataPoints[i]["month"]))
        .attr("height", heightOfDataPoint)
        .attr("width", widthOfDataPoint)
        .style("fill", (d, i) => colorScale(temperatures[i]));
}