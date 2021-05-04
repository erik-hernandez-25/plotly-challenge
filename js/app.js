// select the dropdown list
var idSelect = d3.select("#selDataset");

// select the div sections
var demographicsTable = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("bubble");
var gaugeChart = d3.select("gauge");

// create the function for the initial data rendering
function init() {

    // reset previous data
    resetInfo();

    // read in JSON file
    d3.json("data/samples.json").then((data => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name).property("value");
        })); 

        // get the first ID from the list for initial charts as a default
        var initId = idSelect.property("value")

        // plot charts with initial ID
        setPlot(initId);
    }));
} // close init() function

// create a function to reset divs to prepare for new data
function resetInfo() {

    demographicsTable.html("");
    barChart.html("");
    bubbleChart.html("");
    gaugeChart.html("");

}; // close resetInfo()

// create a function to read JSON and plot charts
function setPlot(id) {

    // read in the JSON data
    d3.json("data/samples.json").then((data => {


        // POPULATE DEMOGRAPHICS TABLE


        // filter the metadata for the ID chosen
        var metadata = data.metadata.filter(participant => participant.id == id)[0];
        console.log(metadata)

        // get the wash frequency for gauge chart later
        var wfreq = metadata.wfreq;

        // Iterate through each key and value in the metadata
        Object.entries(metadata).forEach(([key, value]) => {

            var newList = demographicsTable.append("ul");
            newList.attr("class", "list-group list-group-flush");

            // append a li item to the unordered list tag
            var listItem = newList.append("li");

            // change the class attributes of the list item for styling
            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent");

            // add the key value pair from the metadata to the demographics list
            listItem.text(`${key}: ${value}`);

        }); // close forEach

        
        // filter the samples for the ID chosen
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // create empty arrays to store sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value in the sample to retrieve data for plotting
        Object.entries(individualSample).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                    // case
                default:
                    break;
            } 

        }); 

        // slice and reverse the arrays to get the top 10 values, labels and IDs
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var labels = otuLabels[0].slice(0, 10).reverse();
        var sampleValues = sampleValues[0].slice(0, 10).reverse();

        // use the map function to store the IDs with "OTU" for labelling y-axis
        var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);


        // PLOT BAR CHART


        // create a trace
        var traceBar = {
            height: 1000,
            x: sampleValues,
            y: topOtuIdsFormatted,
            text: labels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(258, 16, 81)'
            }
        };

        // create the data array for plotting
        var dataBar = [traceBar];

        // create layout variable to set plots layout
        var layoutBar = {
           
            title: {
                text: `<b>Top 10 OTUs ${id}</b>`,
                font: {
                    size: 18,
                    color: 'rgb(15,76,129)'
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(15,76,129)'
            },
            yaxis: {
                tickfont: { size: 14 }
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        }


        // plot the bar chart to the "bar" div
        Plotly.newPlot("bar", dataBar, layoutBar);

 
        //  BUBBLE CHART
       

        // create trace
        var traceBub = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'YlGnBu'
            }
        };

        // create the data array for the plot
        var dataBub = [traceBub];

        // define the plot layout
        var layoutBub = {
            xaxis: {
                title: "<b>OTU Id</b>",
                color: 'rgb(15,76,129)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(15,76,129)'
            },
            showlegend: false,
        };

        // plot the bubble chat to the appropriate div
        Plotly.newPlot('bubble', dataBub, layoutBub);

        
        
    })); // close .then function

}; // close setPlot() function

// when there is a change in the dropdown select menu, this function is called with the ID as a parameter
function optionChanged(id) {

    // reset the data
    resetInfo();

    // plot the charts for this id
    setPlot(id);


} // close optionChanged function

// call the init() function for default data
init();