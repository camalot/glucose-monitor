class DataChart {
  constructor() {};
  initialize(id, options) {

    const ctx = document.getElementById(id).getContext('2d');

    // Example glucose data
    const data = options.data;

    // Prepare data for the chart
    const labels = data.map(entry => entry.time);
    const values = data.map(entry => entry.value);

    console.log(labels);

    // Create the chart
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: options.label || 'N/A',
          data: values,
          borderColor: options.borderColor || 'rgba(75, 192, 192, 1)',
          backgroundColor: options.backgroundColor || 'rgba(75, 192, 192, 0.2)',
          borderWidth: options.borderWidth || 2,
          tension: options.tension || 0.4, // Smooth curve
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: "yyyy-MM-dd'T'HH:mm:ss.nnn'Z'", // Parse ISO date strings
              tooltipFormat: 'MMM d, YYYY, h:mm A', // Format for tooltips
              displayFormats: {
                hour: 'MMM d, h:mm A', // Format for the X-axis labels
              }
            },
            title: {
              display: true,
              text: options.xAxisLabel || 'Date/Time',
            }
          },
          y: {
            title: {
              display: true,
              text: options.yAxisLabel || 'Unknown',
            },
            beginAtZero: false
          }
        }
      }
    });
  }
}
