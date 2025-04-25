'use strict';

function getWeightData() {
  return [
    { time: '2023-04-01T08:00:00', value: 150 },
    { time: '2023-04-02T12:00:00', value: 148 },
    { time: '2023-04-03T16:00:00', value: 149 },
    { time: '2023-04-04T20:00:00', value: 147 },
    { time: '2023-04-05T22:00:00', value: 146 }, 

  ];
}

function populateWeightChart() {
  const ctx = document.getElementById('weightChart').getContext('2d');

  const weightData = getWeightData();
  const labels = weightData.map(entry => new Date(entry.time).toLocaleTimeString());
  const values = weightData.map(entry => entry.value);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Weight Levels (lbs)', // Updated label to reflect weight data
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4, // Smooth curve
      }]
    }
  });
}