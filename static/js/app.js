/*jshint esversion: 6 */  

// Global variables
names = [];
metadata = []; 
samples = [];

d3.json("./static/data/samples.json")
    .then( data =>  {
        names = data.names; 
        names.unshift("Choose an ID...");
        metadata = data.metadata;
        samples  = data.samples; 

        //*********** Populate dropdown  
        let dropdown = d3.select("#selDataset");

        // Clear drop-down content 
        dropdown.text("");

        // // Populate dropdown 
        dropdown
        .selectAll("option")
        .data(names)
        .enter()
        .append("option")  
            .text( d => d);	
});


d3.select("#selDataset").on('change', () => {

    if (parseInt(d3.event.target.value)) { 
        /* PROCESS TO PLOT BAR CHART */    
        const subjectIdData = samples.find( obj => obj.id === d3.event.target.value );
        const otu_ids       = subjectIdData.otu_ids.slice(0,10).reverse();
        const all_otu_ids   = subjectIdData.otu_ids.reverse();
        const values        = subjectIdData.sample_values.slice(0,10).reverse();
        const allValues     = subjectIdData.sample_values.reverse();
        const tmpHover      = subjectIdData.otu_labels.slice(0,10).reverse();
        const all_otu_labels= subjectIdData.otu_labels.reverse();
        const hovertext = tmpHover.map( text => text.replace(/;/g, " ") );
        let labels = otu_ids.map( val => 'OTU ' + val );
        plotBar(values, labels, hovertext);

        plotBubble(all_otu_ids, allValues, all_otu_labels);

        // UPDATE THE DEMOGRAPHIC INFO 
        const tmpDemoInfo = metadata.find( obj => {
            return obj.id === parseInt(d3.event.target.value);
        });
        demoInfo = Object.entries( tmpDemoInfo ).map(  obj =>  obj[0] + ": " + obj[1] );
        var item = d3.select('#sample-metadata ul')
            .selectAll('li')
            .data(demoInfo);
        // Enter
        item
            .enter()
            .append('li')
            .attr('class', 'li')
            .text( d => d);
        // Update
        item
            .text( d => d );
        // Exit
        item.exit().remove();

    }
});


let plotBar = ( values, labels, hovertext ) => {

    var trace1 = {
        x: values,
        y: labels,
        hovertext: hovertext,
        orientation: 'h',
        marker: {
          color: 'rgba(55,128,191,0.6)',
          width: 0.1
        },
        type: 'bar'
      };

      var data = [trace1];

      var layout = {
        title: 'Title'
      };

      Plotly.newPlot('bar', data, layout);
};


let plotBubble = ( allValues, labels,  hovertext ) => {

    var trace1 = {
        x: allValues,
        y: labels,
        hovertext: hovertext,
        mode: 'markers',
        marker: {
          size: labels,
          color: allValues
        }
      };
      
      var data = [trace1];
      
      var layout = {
        xaxis: { title: "OTU ID"},
        yaxis: { title: "Samples" }
      };

      Plotly.newPlot('bubble', data, layout);
};



// Plotly.restyle(graphDiv, update [, traceIndices])
// graphDiv
// DOM node or string id of a DOM node
// update
// object, see below for examples 
// (defaults to {})
// traceIndices