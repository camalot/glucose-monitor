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
    // offset the time from `entry.tz_offset`
    const labels = data.map(entry => moment(entry.time).add(entry.tz_offset, 'minutes').toISOString());

    const values = data.map(entry => entry.value);

    console.log(labels);



    // Create the chart
    const chart = new Chart(ctx, {
      plugins: {
        colors: {
          enabled: false
        }
      },
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: options.label || 'N/A',
          data: values,
          color: options.color || '#dee2e6',
          borderColor: options.borderColor || '#0d6efd',
          backgroundColor: options.backgroundColor || '#212529',
          borderWidth: options.borderWidth || 2,
          tension: options.tension || 0.4, // Smooth curve

        }]
      },
      options: {
        color: options.color || '#dee2e6',
        borderColor: options.borderColor || '#0d6efd',
        backgroundColor: options.backgroundColor || '#212529',
        borderWidth: options.borderWidth || 2,
        tension: options.tension || 0.4, // Smooth curve

        scales: {
          x: {
            grid: {
              color: options.color || '#dee2e655'
            },
            type: 'time',
            color: options.color || '#dee2e6',
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
              color: options.color || '#dee2e6',
            },
            ticks: {
              color: options.color || '#dee2e6',
            }
          },
          y: {
            grid: {
              color: options.color || '#dee2e655'
            },
            title: {
              display: true,
              text: options.yAxisLabel || 'Unknown',
              color: options.color || '#dee2e6',
            },
            beginAtZero: false,
            ticks: {
              color: options.color || '#dee2e6',
            }
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
