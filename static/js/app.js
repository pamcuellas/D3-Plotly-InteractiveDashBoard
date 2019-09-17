/*jshint esversion: 6 */  

// Global variables
names = [];
metadata = []; 
samples = [];

d3.json("https://pamcuellas.github.io/D3-Plotly-InteractiveDashBoard/samples.json")
    .then( data =>  {
        names = data.names; 
        names.unshift("Choose an ID...");
        metadata = data.metadata;
        samples  = data.samples; 

        // console.log(names);
        // console.log(metadata);
        // console.log(samples);

        //*********** Popupate dropdown  
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
        const otu_ids   = subjectIdData.otu_ids.slice(0,10).reverse();
        const all_otu_ids = subjectIdData.otu_ids.reverse();
        const values    = subjectIdData.sample_values.slice(0,10).reverse();
        const allValues = subjectIdData.sample_values.reverse();
        const tmpHover  = subjectIdData.otu_labels.slice(0,10).reverse();
        const all_otu_labels = subjectIdData.otu_labels.reverse();
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



// part of data to input
var traceGauge = {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
    direction: 'clockwise',
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['','','','','','','','','','white'],
      labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      hoverinfo: 'label'
    }
  };

  // needle
  var degrees = 50, radius = 0.9;
  var radians = degrees * Math.PI / 180;
  var x = -1 * radius * Math.cos(radians) * 7; //wfreqNum;
  var y = radius * Math.sin(radians);

  var gaugeLayout = {
    shapes: [{
      type: 'arc',
      x0: 0.5,
      y0: 0.5,
      x1: 0.6,
      y1: 0.6,
      line: {
        color: 'red',
        width: 3
      }
    }],
    title: 'Chart',
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]}
  };

  var dataGauge = [traceGauge];

  Plotly.plot('gauge', dataGauge, gaugeLayout);




// var traceA = {
//     type: "pie",
//     showlegend: false,
//     hole: 0.4,
//     rotation: 90,
//     values: [100 / 5, 100 / 5, 100 / 5, 100 / 5, 100 / 5, 100],
//     text: ["Very Low", "Low", "Average", "Good", "Excellent", ""],
//     direction: "clockwise",
//     textinfo: "text",
//     textposition: "inside",
//     marker: {
//       colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "white"]
//     },
//     labels: ["0-10", "10-50", "50-200", "200-500", "500-2000", ""],
//     hoverinfo: "label"
//   };

//   var degrees = 115, radius = .6;
//   var radians = degrees * Math.PI / 180;
//   var x = -1 * radius * Math.cos(radians);
//   var y = radius * Math.sin(radians);
   
//   var layout = {
//     shapes:[{
//         type: 'line',
//         x0: 0,
//         y0: 0,
//         x1: x,
//         y1: 0.5,
//         line: {
//           color: 'black',
//           width: 8
//         }
//       }],
//     title: 'Number of Printers Sold in a Week',
//     xaxis: {visible: false, range: [-1, 1]},
//     yaxis: {visible: false, range: [-1, 1]}
//   };
   
//   var data = [traceA];
   
//   Plotly.plot('gauge', data, layout, {staticPlot: true});


// Plotly.newPlot('gauge',data,layout);



// var data = [{domain: {
//     x: [0, 1], 
//     y: [0, 1]
// }, 
// value: 420, // Main value or biger number on the gauge
// title: {text: "Speed", // Title
//         font: {size: 24} // Title font size
//         }, 
// type: "indicator", 
// mode: "gauge+number+delta",
// delta: { reference: 420, // Number subtracted from "value" above
//          increasing: {color: "RebeccaPurple"}
//         },
// gauge: {
//         axis: {
//                 range: [null, 500], // Max size of gauge and change the position of milestones. 
//                 tickwidth: 1,       // Pointer/mark of each milestone
//                 tickcolor: "darkblue" // Pointer/mark color of each milestone
//               },
//         bar: {color: "darkblue"}, // Main arc on the center of the gauge.
//         bgcolor: "white", // Background color of the end of gauge portion.
//         borderwidth: 2, // Border of the gauge, the external limit.  
//         bordercolor: "gray", // Gauge border color 
//         steps: [ { range: [0, 250], color: 'cyan'},   // **** ranges/milestones (WE WILL MODIFY HERE) 
//                  { range: [250, 400], color: 'royalblue'
//                 }], 
//         threshold: { line: { color: "red", width: 4}, // The horizontal line on the end of gauge 
//                      thickness: 0.75, // The horizontal line on the end of gauge
//                      value: 490 // The horizontal line POSITION on the end of gauge
//                     }
//         }
// }];


// Plotly.restyle(graphDiv, update [, traceIndices])
// graphDiv
// DOM node or string id of a DOM node
// update
// object, see below for examples 
// (defaults to {})
// traceIndices