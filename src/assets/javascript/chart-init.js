const chartInstances = {};
class DataChart {
  constructor() {};
  
  initialize(id, options) {

    const ctx = document.getElementById(id).getContext('2d');

    if (chartInstances[id]) {
      chartInstances[id].destroy();
    }

    // Example glucose data
    const data = options.data;

    // Prepare data for the chart
    // get local time offset from UTC
    const offset = new Date().getTimezoneOffset() * 60000;
    const localTime = data.map(entry => new Date(entry.time).getTime() + offset);
    const ltISO8601 = localTime.map(time => new Date(time).toISOString());
    const labels = ltISO8601;
    const values = data.map(entry => entry.value);

    console.log(labels);



    // Create the chart
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: options.label || 'N/A',
          data: values,
          borderColor: options.borderColor || '#0d6efd',
          backgroundColor: options.backgroundColor || '#212529',
          borderWidth: options.borderWidth || 2,
          tension: options.tension || 0.4, // Smooth curve
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", // Parse ISO date strings
              tooltipFormat: 'MMM d, yyyy, h:mm a', // Format for tooltips
              displayFormats: {
                hour: 'MMM d, h:mm a', // Format for the X-axis labels
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
    chartInstances[id] = chart;

    $(`.chart.${id}`)
      .addClass('bg-body-tertiary')
      .removeClass('placeholder-glow')
      .removeClass('bg-dark');
    $(`.chart.${id} .chart-canvas`).removeClass('placeholder');
  }
}
