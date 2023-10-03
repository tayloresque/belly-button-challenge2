

// READ IN THE DATA

// Fetch the JSON data and assign it to the variables
    let namesData;
    let metaData;
    let samplesData;

    
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    d3.json(url).then(function(data) {
      namesData = data.names;
      metaData = data.metadata;
      samplesData = data.samples;

      // Create an initial bar chart with the first individuals data
      optionChanged(0);
      updateBubbleChart(0);
      displayMetadata(0);

      // Populate the dropdown menu with test subject IDs
      d3.select('#selDataset')
        .selectAll('option')
        .data(namesData)
        .enter()
        .append('option')
        .text(name => name)
        .property('value', name => name);

    }).catch(function(error) {
      console.error('Error fetching data:', error);
    });

    // This function 'updatePlotly' is called when a dropdown menu item is selected
    function optionChanged(index) {
      let sampleValues = samplesData[index].sample_values.slice(0, 10).reverse();
      let otuIds = samplesData[index].otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse();
      let otuLabels = samplesData[index].otu_labels.slice(0, 10).reverse();
        
      let trace = {
          x: sampleValues,
          y: otuIds,
          text: otuLabels,
          type: 'bar',
          orientation: 'h',
          marker: {
          color: 'rgb(31, 119, 180)' 
            }
              };
        
      let layout = {
          title: `Top 10 OTUs for Test Subject ID ${namesData[index]}`,
          xaxis: {
            title: 'Sample Values'
                },
            yaxis: {
            tickfont: { size: 14 }
                }
              };
        
      Plotly.newPlot('bar', [trace], layout);
            }
          

    // CREATE BUBBLE CHART
    function updateBubbleChart(index) {
      let sampleValues = samplesData[index].sample_values;
      let otuIds = samplesData[index].otu_ids;
      let otuLabels = samplesData[index].otu_labels;

    let trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth' 
      }
    };

    let layout = {
      title: `Bubble Chart for Test Subject ID ${namesData[index]}`,
      xaxis: {
        title: 'OTU IDs'
      },
      yaxis: {
        title: 'Sample Values'
      }
     };

     Plotly.newPlot('bubble', [trace], layout);
    }

    // Function to display the metadata for the selected individual
    function displayMetadata(index) {
      let metadataData = metaData[index];
      
    // Select the panel body and clear its content
     let panelBody = d3.select('#sample-metadata');
      panelBody.html('');
      
    // Append a new paragraph for each key-value pair in the metadata
    Object.entries(metadataData).forEach(([key, value]) => {
    panelBody.append('p').text(`${key}: ${value}`);
    });
      };

    // Function to handle dropdown selection change
    function dropdownChanged() {
      let selectedValue = d3.select('#selDataset').property('value');
      let selectedIndex = namesData.indexOf(selectedValue);
      optionChanged(selectedIndex);
      updateBubbleChart(selectedIndex);
      displayMetadata(selectedIndex);
    }

    // Initial event listener for the dropdown menu
    d3.select('#selDataset').on('change', dropdownChanged);

